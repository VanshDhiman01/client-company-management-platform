import { Router } from 'express';
import * as messageController from '../controllers/message.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/zip', 'application/x-zip-compressed'
        ];
        if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

const router = Router();

router.get('/users/:role', authenticateToken, messageController.getUsersByRole);
router.post('/conversation', authenticateToken, messageController.getOrCreateConversation);
router.get('/', authenticateToken, messageController.getConversations);
router.post('/', authenticateToken, messageController.getOrCreateConversation);
router.get('/:id', authenticateToken, messageController.getConversationById);
router.post('/:id/messages', authenticateToken, messageController.sendMessage);
router.post('/:id/messages/with-attachment', authenticateToken, upload.single('attachment'), messageController.sendMessageWithAttachment);
router.put('/:id/read', authenticateToken, messageController.markAsRead);

export default router;
