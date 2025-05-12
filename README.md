# REAL-TIME-COLLABORATION-TOOL

# 📄 Real-Time Collaborative Document Editor

**Company Name**: CODETECH IT SOLUTIONS

**Intern Name**: KARUNYARAJ

**Intern ID**: CT4MWZ95  

**Domain**: MERN STACK WEB DEVELOPMENT  

**Duration**: 15 Weeks  

**Mentor**: NEELA SANTHOSH  

---

## Description

A **MERN stack** web application that allows multiple users to collaborate on documents in real-time. The platform includes secure user authentication, live synchronization using WebSockets, document versioning, and a user-friendly rich text editor.

---

## Features

- Real-time collaborative text editing  
- User authentication (Register/Login)  
- Document creation and management  
- Live cursor position sharing  
- Revision history tracking  
- Shareable document links  
- Rich text formatting options  
- Responsive design for all devices  

---

## Project Structure

```
collab-tool/
├── client/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Route pages
│   │   ├── context/         # Auth context
│   │   └── App.js           # Main component
│   └── package.json
├── server/                  # Node.js Backend
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── socket/              # Socket.io handlers
│   ├── server.js            # Express server
│   └── package.json
├── .gitignore
└── README.md
```

---

## How It Works

1. **User Authentication** → Secure signup/login using JWT  
2. **Document Creation** → Users can start new collaborative documents  
3. **Real-Time Editing** → Multiple users can edit documents simultaneously  
4. **Live Updates** → Changes sync instantly for all users using WebSockets  
5. **Document Management** → Users can view, edit, and delete documents  
6. **Share Documents** → Documents can be shared via secure links  

---

## Built With

- **Frontend**: React.js, Socket.io-client, Quill Rich Text Editor  
- **Backend**: Node.js, Express.js, Socket.io  
- **Database**: MongoDB (with Mongoose ODM)  
- **Authentication**: JWT (JSON Web Tokens)  
- **Styling**: Material-UI, CSS Modules  

---

  ## Output

![Image](https://github.com/user-attachments/assets/cc906140-0dd2-4103-83a0-c6c3a731964d)

![Image](https://github.com/user-attachments/assets/02e7067a-c38f-4dbb-85ff-9811273ccd2f)

![Image](https://github.com/user-attachments/assets/5a82c44a-6e67-47e7-95d0-680f95a1eea9)
