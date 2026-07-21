const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const env = require('../config/env');

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '30d' });
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const user = await userRepository.findByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const userExists = await userRepository.findByUsername(username);

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await userRepository.createUser({
      username,
      password: hashedPassword,
      role: role || 'operator'
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser };
