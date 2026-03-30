import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { MessageRepository } from "./Infrastructure/Repository/MessageRepository";
import { FriendRepository } from "./Infrastructure/Repository/FriendRepository";

const messageRepo = new MessageRepository();
const friendRepo = new FriendRepository();

const onlineUsers = new Map<string, string>();

export function initWebSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token requis"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Token invalide"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;
    onlineUsers.set(userId, socket.id);

    socket.broadcast.emit("user:online", userId);

    socket.on(
      "message:send",
      async (data: { receiverId: string; content: string }) => {
        const { receiverId, content } = data;
        if (!receiverId || !content) return;

        const friendsList = await friendRepo.getFriendsByUserId(userId);
        const isFriend = friendsList.some(
          (f) =>
            (f.requesterId === userId && f.addresseeId === receiverId) ||
            (f.requesterId === receiverId && f.addresseeId === userId),
        );
        if (!isFriend) {
          socket.emit("error", { message: "Vous n'êtes pas amis" });
          return;
        }

        const message = await messageRepo.sendMessage({
          senderId: userId,
          receiverId,
          content,
        });

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("message:receive", message);
        }

        socket.emit("message:sent", message);
      },
    );

    socket.on("message:read", async (messageId: string) => {
      const updated = await messageRepo.markAsRead(messageId);
      if (updated) {
        const senderSocketId = onlineUsers.get(updated.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("message:read", messageId);
        }
      }
    });

    socket.on("typing:start", (receiverId: string) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:start", userId);
      }
    });

    socket.on("typing:stop", (receiverId: string) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:stop", userId);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user:offline", userId);
    });
  });

  return io;
}
