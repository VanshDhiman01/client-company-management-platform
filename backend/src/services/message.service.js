import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsersByRole = async (role) => {
  return prisma.user.findMany({
    where: { role: role.toUpperCase() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyName: true,
      avatar: true,
      title: true
    },
    orderBy: { name: 'asc' }
  });
};

export const getOrCreateConversation = async (clientId, adminId) => {
  let conversation = await prisma.conversation.findFirst({
    where: { clientId, adminId },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  if (!conversation) {
    const clientUser = await prisma.user.findUnique({ where: { id: clientId } });
    const adminUser = await prisma.user.findUnique({ where: { id: adminId } });

    conversation = await prisma.conversation.create({
      data: {
        clientId,
        adminId,
        clientName: clientUser ? clientUser.name : 'Client',
        companyName: clientUser ? (clientUser.companyName || 'Client Organization') : 'Client Organization',
        clientAvatar: clientUser?.avatar,
        lastMessage: 'Conversation initialized',
        lastMessageTime: new Date()
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
  }

  return conversation;
};

export const getAllConversations = async (userId, userRole) => {
  const whereCondition =
    userRole === 'CLIENT'
      ? { clientId: userId }
      : userRole === 'ADMIN'
      ? { OR: [{ adminId: userId }, { adminId: { not: '' } }] }
      : {};

  return prisma.conversation.findMany({
    where: whereCondition,
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
};

export const getConversationById = async (id, userId, userRole) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { timestamp: 'asc' }
      }
    }
  });

  if (!conversation) return null;

  // Verify access control
  if (userRole === 'CLIENT' && conversation.clientId !== userId) {
    throw new Error('Unauthorized access to this conversation');
  }

  return conversation;
};

export const markAsRead = async (conversationId, userRole) => {
  const updateData =
    userRole === 'CLIENT'
      ? { unreadCountClient: 0 }
      : { unreadCountAdmin: 0 };

  return prisma.conversation.update({
    where: { id: conversationId },
    data: updateData
  });
};

export const sendMessage = async (conversationId, senderId, senderName, senderRole, text, io, attachmentUrl = null, attachmentName = null, attachmentType = null, attachmentSize = null) => {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) {
    throw new Error('Conversation not found');
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      senderName,
      senderRole,
      text: text || '',
      attachmentUrl,
      attachmentName,
      attachmentType,
      attachmentSize
    }
  });

  const isClientSender = senderRole === 'CLIENT';
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessage: text ? text : (attachmentName ? `Attachment: ${attachmentName}` : 'New attachment'),
      lastMessageTime: new Date(),
      unreadCountAdmin: isClientSender ? { increment: 1 } : 0,
      unreadCountClient: isClientSender ? 0 : { increment: 1 }
    }
  });

  // Emit real-time socket event to the room `conversation:<id>`
  if (io) {
    io.to(`conversation:${conversationId}`).emit('new_message', message);
  }

  return message;
};
