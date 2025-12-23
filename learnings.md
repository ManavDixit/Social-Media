# Learning Notes – Social Media Project

This document highlights **practical engineering problems** I encountered while building my social media project and the **solutions I designed and implemented**.  
The focus is on real-world trade-offs rather than feature lists.

---

## 1. Email Verification Flow

### Problem
A common pattern is to:
- Create the user in the database
- Mark them as `unverified`
- Verify later via email

This leads to:
- Database pollution with unverified users
- Many users never completing verification
- Need for cleanup jobs or cron tasks
- Increased attack surface for bot signups

### Solution
I avoided storing users before verification.

### Implementation
- User submits signup data
- Backend **does not store the user**
- Required user data is encrypted
- Encrypted data is embedded in the email verification link
- Frontend opens the verification URL
- URL sends the encrypted string back to backend
- Backend decrypts and **creates the user only after verification**

### Outcome
- No unverified users in the database
- User exists only if email is verified
- Cleaner data model

### Trade-offs
- Larger verification link size
- Requires careful encryption and expiry handling

---

## 2. Media Uploads (Images & Videos)

### Problem
Initial approach involved:
- Uploading media to backend
- Storing files on server disk

Issues:
- Server storage fills quickly
- Backend spends resources processing files
- Poor scalability
- Risk of data loss during deployments

### Solution
Direct client-to-cloud uploads using Cloudinary signed requests.

### Implementation
- Backend generates a secure upload signature
- Signature is sent to frontend
- Frontend uploads media directly to Cloudinary
- Cloudinary returns the media URL
- Backend stores only the URL in the database

### Outcome
- Backend never handles file data
- Reduced server load
- Better scalability and performance

### Trade-offs
- Slightly more complex setup
- Secure signature generation is critical

---

## 3. Messaging Pagination (Real-time Chat)

### Problem
Used page-based pagination for messages:
- Fetching messages by page number

Issues in real-time context:
- New messages arrived via WebSocket
- Previously fetched pages changed
- Fetching older pages caused duplicate messages
- Pagination state became inconsistent

### Solution
Switched to cursor-based (time-based) pagination.

### Implementation
- Each message has a timestamp-based cursor
- Messages are fetched **older than a given cursor**
- Cursor = timestamp of the oldest loaded message
- New real-time messages do not affect historical fetches

### Outcome
- No message duplication
- Stable infinite scrolling
- Correct behavior with live updates

### Why This Matters
Page-based pagination breaks when data is mutable.
Cursor-based pagination is the correct approach for chat systems.

---

## Key Learnings

- Do not store data until it is truly valid
- Offload heavy tasks away from the backend
- Real-time systems require different pagination strategies
- Simple CRUD patterns often fail in production scenarios

---

This project improved my understanding of **data integrity, scalability, and real-world backend system design**.
