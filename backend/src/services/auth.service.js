import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'orange_mantra_secret_jwt_key_2026';

export const registerUser = async (data) => {
  const normalizedEmail = (data.email || '').trim().toLowerCase();

  if (!data.password) {
    throw new Error('Password is required');
  }

  const existing = await prisma.user.findFirst({
    where: {
      email: {
        equals: normalizedEmail
      }
    }
  });
  if (existing) {
    throw new Error('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: data.role || 'CLIENT',
      companyName: data.companyName,
      phone: data.phone,
      title: data.title
    }
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const loginUser = async (email, password) => {
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (!email || !password) {
    throw new Error('Invalid email or password');
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: normalizedEmail
      }
    }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      phone: true,
      companyName: true,
      title: true,
      status: true,
      joinedDate: true
    }
  });
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserProfile = async (id, data) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone
    }
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserAvatar = async (id, avatarUrl) => {
  const user = await prisma.user.update({
    where: { id },
    data: { avatar: avatarUrl }
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserRole = async (id, role) => {
  const user = await prisma.user.update({
    where: { id },
    data: { role }
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

