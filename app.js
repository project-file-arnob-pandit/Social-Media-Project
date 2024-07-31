// Import necessary modules
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { router } from './route/route.js';
import { Message } from './models/message.models.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create HTTP server using Express app
export const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Middleware and settings
app.set('view engine', 'ejs');
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(router);
// Socket.IO logic

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join chat', ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined chat`);
    });

    socket.on('send message', async ({ senderId, receiverId, message }) => {
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        io.to(receiverId).emit('receive message', { senderId, message });
        io.to(senderId).emit('receive message', { senderId, message }); // Optionally send to sender for confirmation
    });

    socket.on('get messages', async ({ userId }) => {
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ timestamp: 1 });

        socket.emit('load messages', messages);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});