import Notification from "../models/Notification.js";
import { getIo } from "../socket/socket.js";

export const createNotification = async ({
  recipientId,
  senderId,
  type,
  entityId,
  entityType,
}) => {
  if (recipientId.toString() === senderId.toString()) return null;

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    entityId,
    entityType,
  });

  const populated = await Notification.findById(notification._id)
    .populate("sender", "name email picture pfp")
    .lean();

  try {
    const io = getIo();
    io.to(recipientId.toString()).emit("notification", {
      notification: populated,
    });
  } catch (e) {
    // socket not initialized yet
  }

  return populated;
};

export const getNotifications = async (req, res) => {
  try {
    const { cursor, limit = 20 } = req.query;
    const query = { recipient: req.userId };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1)
      .populate("sender", "name email picture pfp")
      .lean();

    let nextCursor = null;
    if (notifications.length > Number(limit)) {
      const next = notifications.pop();
      nextCursor = next.createdAt.toISOString();
    }

    res.json({ success: true, notifications, nextCursor });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.userId },
      { read: true },
      { new: true }
    ).populate("sender", "name email picture pfp");

    if (!notification) {
      return res.status(404).send({ success: false, error: "Not found" });
    }

    res.json({ success: true, notification });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    // Mark all as read (same as × button for all)
    await Notification.updateMany(
      { recipient: req.userId, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({ _id: id, recipient: req.userId });
    if (!notification) {
      return res.status(404).send({ success: false, error: "Not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.userId,
      read: false,
    });
    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, error });
  }
};