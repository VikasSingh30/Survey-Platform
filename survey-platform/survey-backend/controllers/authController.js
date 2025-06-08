const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({
      success: false,
      message: 'Email already exists',
      errors: { email: ['This email is already registered'] }
    });

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
    const user = await User.create({ email, password: hashedPassword, name });

    const token = generateToken(user);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          created_at: user.created_at
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: { id: user._id, email: user.email, name: user.name },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);  // <--- Log error here
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.user_id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    }
  });
};
