# AgriFlow

**AgriFlow** is a modern farmer community platform that helps farmers connect, communicate, collaborate, and grow together. Built with **React**, **Django Rest Framework**, and **WebSockets**, AgriFlow enables real-time messaging, community building, event coordination, and product exchange between farmers.
<p align="center">
  <img src="./assets/AgriFlowLandingPageReadMe1.png" alt="AgriFlow Logo" width="full"/>
</p>

---

## 🚀 Features

### 👨‍🌾 Farmer Community & Social Networking
- Create and manage user profiles for farmers.
- Connect with other farmers in your area or across regions.
- View nearby farmers using location-based services.

### 💬 Real-time Chat System (WebSocket Powered)
- **1:1 Chat** — Farmer to farmer direct messaging.
- **Group Chat** — Community group creation and interaction.
- **Product Chat** — OLX-like buyer-seller conversations with media support.
- **Media Sharing** — Send images, files, and documents in chat.
- **Typing & Seen indicators**, with socket-based real-time updates.

### 📅 Event Management
- Organize **offline** or **online events** (e.g., farming workshops, exhibitions).
- RSVP and join events within the platform.
- Online event with Zego Cloud API implimentation
- Share event links or manage participant lists.

### 🛒 Product Selling Portal
- Post products for sale (tools, crops, seeds).
- In-app product page with seller chat integration.

### 🔔 Notification System
- Realtime in-app notifications via WebSockets.
- Message alerts, event invites, group mentions.
- Notification tray and read/unread status.

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
































