const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      required: true,
      enum: [
        'CENTRAL_ADMIN',
        'STATE_OFFICER',
        'DISTRICT_COLLECTOR',
        'REQUIRING_AGENCY',
        'FIELD_SURVEYOR',
        'CITIZEN'
      ],
      default: 'CITIZEN'
    },
    jurisdiction: {
      state: { type: String, trim: true },
      district: { type: String, trim: true },
      taluka: { type: String, trim: true },
      agencyName: { type: String, trim: true }
    },
    designation: {
      type: String,
      trim: true
    },
    aadhaarNumber: {
      type: String,
      trim: true,
      select: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      otp: String,
      expiresAt: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
