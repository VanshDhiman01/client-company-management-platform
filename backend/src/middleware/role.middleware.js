import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User unauthenticated' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true }
      });

      if (!user) {
        return res.status(401).json({ message: 'User not found in database' });
      }

      const currentRole = user.role;

      if (!allowedRoles.includes(currentRole)) {
        return res.status(403).json({
          message: `Forbidden: User role '${currentRole}' is not authorized to access this resource`
        });
      }

      req.user.role = currentRole;
      next();
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error validating role' });
    }
  };
};
