# AgriFlow

**AgriFlow** is a modern farmer community platform that helps farmers connect, communicate, collaborate, and grow together. Built with **React**, **Django Rest Framework**, and **WebSockets**, AgriFlow enables real-time messaging, community building, event coordination, and product exchange between farmers.
<p align="center">
  <img src="./assets/AgriFlowLandingPageReadMe1.png" alt="AgriFlow Logo" width="full"/>
</p>

---

## 🚀 Features

### 👨‍🌾 Farmer Community & Social Networking
 - Create and manage personalized farmer profiles.
 - Connect with nearby or regional farmers using location-based suggestions.
 - Post farming-related content: text, images, and videos.
 - Like, comment, and engage with the community through interactive feeds.

### 💬 Real-time Chat System (Powered by Django Channels + WebSockets)
  - 1:1 Direct Chat – Farmer-to-farmer messaging.
  - Group Chat / Community Chat – Region or topic-based group conversations.
  - Product Chat – OLX-style buyer-seller interactions.
  - Media Sharing – Upload and share images and documents within chats.
  - Typing & Seen Indicators – Real-time feedback on user actions.
  - Redis – Used as a message broker to handle socket connections.

### 📅 Event Management System
  - Host and join online or offline events (e.g., workshops, webinars).
  - RSVP to events and manage attendee lists.
  - ZegoCloud integration for live virtual events.
  - Celery Beat – Sends event reminders via notification 10 minutes before start time.
  - Share event links, view participants, and join seamlessly.

### 🛒 Product Selling Marketplace
   - Post, edit, and manage agricultural product listings (tools, seeds, crops).
   - Browse products by category or search.
   - Integrated product chat to enable buyer-seller communication.
   - OLX-like experience optimized for farmers.


### 🔔 Notification System (WebSocket + Celery + Redis)
   - Real-time in-app notifications for:
      1. New posts
      2. Product listings
      3. Event invitations
      4. Chat messages (1:1, group, product)
   - Supports read/unread status and in-browser alerts.  
   - Celery – Handles background task queueing (e.g., post notifications).
   - Celery Beat – Triggers scheduled notifications (e.g., event reminders).
   - Redis – Backend used for real-time queue management.

### 🔐 Authentication & Security
   - JWT-based authentication (using Django Rest Framework JWT).
   - Protected API endpoints with role-based access.  
   - Session-based fallback login for flexibility.
   - Secure media handling and user data protection.
     
### ☁️ Media Management
  - Cloudinary integration for optimized image & video storage.
  - Media uploads supported for 
      1. Community posts
      2. Product images
      3. Chat attachments
        
### 🧰 DevOps & Deployment
    
   -  Dockerized backend for consistent and isolated development.
   -  CI/CD pipeline set up using GitHub Actions for automated testing & deployment.
   -  GCP (Google Cloud Platform) used for scalable backend hosting.
      Vercel used to deploy frontend for fast performance and global CDN.
      
---

## 🧩 Installation & Setup

### ⚙️ Prerequisites

Before you begin, make sure you have the following installed:

### 📦 General
- [Git](https://git-scm.com/) – for cloning the repository

### 🐳 Backend (Docker)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) – required for running backend containers
  
  > ⚠️ Make sure Docker Desktop is running before you start the backend.
  
- [Docker Compose](https://docs.docker.com/compose/install/) – usually included with Docker Desktop

### 🌐 Frontend (Vite + React)
- [Node.js (v16+)](https://nodejs.org/) – runtime environment for running the frontend
- [npm](https://www.npmjs.com/) – comes with Node.js, for installing packages


- 📁 Clone the Repository
  
  ```
  git clone https://github.com/VishnuCheruvakkara/AgriFlow-Community-web-app.git
  cd AgriFlow-Community-web-app
  ```
### 📀 Backend (Using docker)

1. Navigate to backend directory :
   ```
   cd back_end
   ```
2. Build All Docker Images :
   ```
   docker-compose build
   ```
   
   > This will read the docker-compose.yml file and build the backend using their respective     Dockerfiles.
   
 3. Start the Project :
   ```
   docker-compose up -d
   ```

   > The backend (Django server) will now be running at http://localhost:8000.

### 🌐 Frontend Setup (Manual) : 
1. Navigate to Frontend Directory :
     ```
     cd front_end 
     ```
2. Install Frontend Dependencies :
     ```
    npm install
     ```
1.  Start Frontend Server:
     ```
     npm run dev
     ```
     
     > The frontend (Vite server) will now be running at http://localhost:5173.


## 🤝 Contributing

Thank you for your interest in contributing to this project — we really appreciate it!

Here’s how you can contribute :

### 🌿 Branching Strategy
keep in mind that
- main: Active development happens here.
- production: Default branch used for deployment. ( ⚠️ Default Branch )

> 🔁 Please create your feature branches from main.
Our team will take care of reviewing and merging your contributions.


### 🚀 Contribution Steps : 

1. Fork the Repository
    - Click the "Fork" button on the top right of this GitHub page.
2. Clone Your Fork
   ```
    git clone https://github.com/VishnuCheruvakkara/AgriFlow-Community-web-app.git
    cd AgriFlow-Community-web-app
   ```
3. Create a New Branch
   ```
   git checkout -b feature/your-feature-name
   ```
4. Make Your Changes
   - Implement your feature or fix.
   - Keep commits clear and meaningful.
5. Push Your Branch
  ```
  git push origin feature/your-feature-name
  ```
6. Open a Pull Request
   - Go to your fork on GitHub.
   - Click "Compare & pull request".
   - Target branch: main.
   - Add a short and clear description of what you’ve done.

###  ✅ A Few Guidelines 
- Keep your pull request focused on one feature/fix at a time.
- Please follow the existing project structure and style.
- If you're unsure about something, feel free to ask by opening a GitHub issue or starting a discussion.
  
---

Our team will review your contribution and get back to you as soon as possible. Thanks again for helping improve the project! 🌱
































