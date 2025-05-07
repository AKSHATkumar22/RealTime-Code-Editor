A powerful real-time collaborative code editor with live code sharing, multi-language compilation, and active user visibility, built using React, Socket.IO, and Piston API.

🔗 Live Preview
https://real-time-code-editor-drab.vercel.app/

🧑‍💻 Real-time collaborative code editing

💬 Active user list & typing indicators

🌐 Multiple programming language support:

JavaScript, Python, C++, C, Java, C#

⚡ Code compilation using Piston API

📋 Room-based sharing with copyable Room ID

🌙 Monaco editor with dark theme


🎯 Lightweight and fast


# TECH STACKS
| Frontend      | Backend     | Others     |
| ------------- | ----------- | ---------- |
| React.js      | Node.js     | Socket.IO  |
| Monaco Editor | Express.js  | Piston API |
| CSS           | HTTP Server | Axios      |


# FOLDER STRUCTURE
project-root/
├── frontend/      # React App
├── server/        # Express + Socket.io server

# COMPILE LOGIC
On pressing Execute, code is sent to server.

Server sends code, language & version to Piston API.

API returns output, which is broadcasted to all users in the same room.

