const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
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
      role
    });

    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, role, password } = req.body;
    
    const user = await userRepository.findById(id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (password) updateData.password = bcrypt.hashSync(password, 10);
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, role: true }
    });
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user.id) {
      res.status(400);
      throw new Error('Cannot delete yourself');
    }
    
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
