const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

// @desc Get all users with jurisdiction filters
// @route GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { role, state, district } = req.query;
    const filter = { ...req.jurisdictionFilter };

    if (role) filter.role = role;
    if (state) filter['jurisdiction.state'] = state;
    if (district) filter['jurisdiction.district'] = district;

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return ApiResponse.success(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Create a new user
// @route POST /api/users
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, jurisdiction, designation, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return ApiResponse.badRequest(res, 'User with this email already exists');
    }

    const newUser = await User.create({
      name,
      email,
      password: password || 'Password@123',
      role,
      jurisdiction,
      designation,
      phone
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return ApiResponse.created(res, userObj, 'User created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc Update user
// @route PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updated) {
      return ApiResponse.notFound(res, 'User not found');
    }

    return ApiResponse.success(res, updated, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser
};
