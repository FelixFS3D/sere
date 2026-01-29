const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const crypto = require('crypto');
const { sendMail } = require('../services/email.service');

/**
 * Generates a JWT token for a user
 * @param {Object} user - User from database
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    username: user.username
  };
  
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};

/**
 * New user registration (signup)
 * Creates a new user with email/password and sends verification email
 */
exports.signup = async (req, res) => {
  const { email, username, password } = req.body;
  
  try {
    // Check if user already exists
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res
        .status(400)
        .json({ errorMessage: "A user is already registered with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    
    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const newUser = await User.create({ 
      email,
      username, 
      password: hashPassword,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false,
      provider: 'local'
    });

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${emailVerificationToken}`;
    
    try {
      await sendMail({
        to: email,
        subject: 'Verify your email - Sere Shop',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome to Sere Shop, ${username}!</h1>
            <p style="font-size: 16px; color: #666;">
              Thanks for registering. Please verify your email address by clicking the link below:
            </p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Verify Email
            </a>
            <p style="font-size: 14px; color: #999;">
              This link will expire in 24 hours.
            </p>
            <p style="font-size: 14px; color: #999;">
              If you didn't create this account, you can ignore this email.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Do not fail registration if email fails
    }

    res.status(201).json({ 
      message: "User registered successfully. Please verify your email to activate your account.",
      userId: newUser._id
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: "Error registering user" });
  }
};

/**
 * Email verification
 * Verifies the token sent via email and activates the account
 */
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  try {
    const user = await User.findOne({ 
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification token.' 
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({ 
      message: 'Email verified successfully. You can now log in.' 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email.' });
  }
};

/**
 * Traditional login with email and password
 * Verifies credentials and returns JWT token
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res
        .status(400)
        .json({ errorMessage: "No user registered with this email" });
    }

    // Verify user uses local authentication
    if (foundUser.provider !== 'local') {
      return res.status(400).json({ 
        errorMessage: `This account is linked with ${foundUser.provider}. Please login with ${foundUser.provider}.` 
      });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ errorMessage: "Incorrect password" });
    }

    // Check if email is verified
    if (!foundUser.isEmailVerified) {
      return res.status(403).json({ 
        errorMessage: "Please verify your email before logging in",
        emailNotVerified: true
      });
    }

    // Update last login
    foundUser.lastLogin = new Date();
    await foundUser.save();

    // Generate JWT token
    const authToken = generateToken(foundUser);

    res.status(200).json({ 
      authToken, 
      role: foundUser.role,
      user: {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        avatar: foundUser.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Error logging in" });
  }
};

/**
 * Verify JWT token
 * Used to validate active sessions
 */
exports.verify = (req, res) => {
  res.status(200).json(req.payload);
};

/**
 * Request password reset
 * Sends an email with a token to reset the password
 */
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security, do not reveal if email exists
      return res.status(200).json({ 
        message: 'If the email exists, you will receive instructions to reset your password.' 
      });
    }

    // Verify it is a local user
    if (user.provider !== 'local') {
      return res.status(400).json({ 
        message: `This account uses ${user.provider} for authentication. You cannot reset the password.` 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email with instructions
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await sendMail({
      to: email,
      subject: 'Reset Password - Sere Shop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Password</h1>
          <p style="font-size: 16px; color: #666;">
            We received a request to reset your password. Click the link below:
          </p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #999;">
            This link will expire in 1 hour.
          </p>
          <p style="font-size: 14px; color: #999;">
            If you did not request this, you can ignore this email.
          </p>
        </div>
      `
    });

    res.status(200).json({ 
      message: 'If the email exists, you will receive instructions to reset your password.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Error processing request.' });
  }
};

/**
 * Reset password with token
 * Allows user to set a new password
 */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired token.' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ 
      message: 'Password updated successfully. You can now log in.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
