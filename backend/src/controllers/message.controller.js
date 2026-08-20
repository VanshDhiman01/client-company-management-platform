import * as messageService from '../services/message.service.js';
import cloudinary from '../config/cloudinary.js';

export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const users = await messageService.getUsersByRole(role);
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getOrCreateConversation = async (req, res, next) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required' });
    }

    let clientId, adminId;
    if (userRole === 'CLIENT') {
      clientId = userId;
      adminId = targetUserId;
    } else {
      clientId = targetUserId;
      adminId = userId;
    }

    const conversation = await messageService.getOrCreateConversation(clientId, adminId);
    res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const conversations = await messageService.getAllConversations(userId, userRole);
    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const conversation = await messageService.getConversationById(req.params.id, userId, userRole);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    // Automatically mark as read when opened
    await messageService.markAsRead(req.params.id, userRole);
    res.status(200).json({ success: true, conversation });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required' });
    }

    // Sender identity derived strictly from JWT authenticated user
    const senderId = req.user.id;
    const senderName = req.user.name;
    const senderRole = req.user.role;

    const io = req.app.get('io');
    const message = await messageService.sendMessage(id, senderId, senderName, senderRole, text.trim(), io);
    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

export const sendMessageWithAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    
    const senderId = req.user.id;
    const senderName = req.user.name;
    const senderRole = req.user.role;
    const io = req.app.get('io');

    let attachmentUrl = null;
    let attachmentName = null;
    let attachmentType = null;
    let attachmentSize = null;

    if (req.file) {
      attachmentName = req.file.originalname;
      attachmentType = req.file.mimetype;
      attachmentSize = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';

      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'orange-mantra-messages' },
        async (error, result) => {
          if (error) {
            return next(error);
          }
          attachmentUrl = result.secure_url;
          
          try {
            const message = await messageService.sendMessage(
              id, senderId, senderName, senderRole, (text || '').trim(), io,
              attachmentUrl, attachmentName, attachmentType, attachmentSize
            );
            res.status(201).json({ success: true, message });
          } catch (err) {
            next(err);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    } else {
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, message: 'Message text is required' });
      }
      const message = await messageService.sendMessage(id, senderId, senderName, senderRole, text.trim(), io);
      res.status(201).json({ success: true, message });
    }
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    await messageService.markAsRead(id, userRole);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
