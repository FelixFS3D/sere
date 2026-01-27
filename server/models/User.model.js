/**
 * @file User.model.js
 * @description User Mongoose Schema and Model.
 * Handles user data including authentication (local & social), profile info, and roles.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      // Password is required only for traditional users (not social login)
      required: function () {
        return !this.googleId && !this.facebookId && !this.appleId;
      },
      minlength: 6,
    },
    
    // Email Verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // Password Reset fields
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // Social Login IDs
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    facebookId: {
      type: String,
      sparse: true,
      index: true,
    },
    appleId: {
      type: String,
      sparse: true,
      index: true,
    },

    // Profile Information
    avatar: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook', 'apple'],
      default: 'local',
    },

    // Roles and Permissions
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
