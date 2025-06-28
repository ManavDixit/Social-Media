# 🌐 MERN Social Media App

A full-featured social media platform built using the MERN stack (MongoDB, Express, React, Node.js). This app supports user authentication, Google OAuth, email verification, post creation with media (image/video), likes, comments, sharing, and a full follow system.

---

## 🚀 Features

### 🔐 Authentication
- Signup/Login with email & password
- Email verification via tokenized link
- Google OAuth integration

### 📝 Posts
- Create posts with text, images, or videos
- Efficient video uploading with streaming support (chunked upload & playback)
- Like / Comment / Share functionality
- View full post with all interactions

### 👤 User & Social
- User profile page with bio and posts
- Follow/Unfollow users
- Personalized feed of followed users
- Public post exploration

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Others |
|----------|---------|----------|--------|
| React    | Node.js (Express) | MongoDB (Mongoose) | Cloudinary/S3 for media |
| Context API or Redux | JWT for auth | | Multer + Streams for video |
| Tailwind CSS / CSS Modules | Nodemailer for email | | Socket.io (optional for notifications) |

---

## 📸 Screenshots

> _Add images/gifs here once deployed_  
> ![Home Feed](screenshots/home.png)  
> ![Post View](screenshots/post.png)  
> ![Profile Page](screenshots/profile.png)

---

## ⚙️ Installation & Setup

1. **Clone the repositories** (if frontend & backend are in separate folders)
```bash
git clone https://github.com/your-username/mern-social-media-app.git
cd mern-social-media-app
