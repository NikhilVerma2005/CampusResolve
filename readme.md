# 🚀 CampusResolve – Full-Stack Complaint Management System

A production-ready full-stack campus complaint management system built using React and Flask.  
This project demonstrates role-based dashboards, RESTful API design, database persistence, and real cloud deployment.

> This project focuses on practical full-stack architecture and real deployment constraints, not just UI.

---

## 🔧 Tech Stack

### 🌐 Frontend
- React (Vite)
- Axios (API communication)
- Custom CSS (Responsive design)

### 🧠 Backend
- Flask (Blueprint architecture)
- SQLAlchemy ORM
- PostgreSQL (Production)
- SQLite (Local development)
- REST API design

### 🚀 Deployment
- Frontend: Render Static Hosting
- Backend: Render Web Service (Gunicorn)
- Database: Render PostgreSQL

---

## ✨ Key Features

### 👨‍🎓 Student Dashboard
- Raise new complaints
- Join similar existing complaints
- View complaint status & priority
- Track complaint timeline
- View personal complaint statistics

### 🏢 Office Dashboard
- View assigned complaints
- Start / Reject / Resolve complaints
- Update complaint status
- View report count aggregation
- Complaint lifecycle management

### ⚙️ System Features
- Role-based access control (Student / Office)
- Status flow management (OPEN → IN_PROGRESS → RESOLVED)
- Automatic priority update based on report count
- Timeline history tracking
- RESTful API structure

---

## 🗂 Project Structure

.
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── tickets.py
│   │   ├── users.py
│   │   └── offices.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
└── README.md

---

## 🔑 Authentication & Role Flow (High Level)

1. User logs in (Student or Office)
2. Role is stored in localStorage
3. Protected dashboards render based on role
4. API routes enforce role validation on backend
5. Office users manage complaint lifecycle

---

## 🌍 Live Deployment

Frontend:
https://campus-resolve.onrender.com

Backend API:
https://campusresolve-05m5.onrender.com

Health Check:
https://campusresolve-05m5.onrender.com/health

Expected response:
{"status":"ok"}

---

## 🧪 Sample API Endpoints

Create Complaint  
POST /api/tickets

Get Student Complaints  
GET /api/users/{student_id}/tickets

Update Ticket Status  
PATCH /api/tickets/{ticket_id}

---

## 🧠 Database Design Highlights

- User model (Student / Staff roles)
- Ticket model (status, priority, SLA tracking)
- Report model (join existing complaints)
- TicketHistory model (timeline tracking)
- Automatic priority escalation based on report count

---

## 🚧 Free-Tier Deployment Notes

- Render free tier suspends inactive services
- First request may be slow (cold start)
- PostgreSQL ensures persistent production data
- SQLite used only for local development

---

## 🔐 Security Considerations

- Password hashing (Werkzeug security)
- Role validation on backend routes
- Environment-based configuration
- No hardcoded secrets
- CORS properly configured

---

## 🧠 What This Project Demonstrates

- Full-stack architecture design
- RESTful API development
- ORM-based database modeling
- Role-based system logic
- Cloud deployment handling
- Real-world system thinking

---

## 👨‍💻 Author

**Nikhil Verma**  
Engineering Student | Aspiring Software Engineer & ML Enthusiast

- GitHub: [@NikhilVerma2005](https://github.com/NikhilVerma2005)  
- LinkedIn: [Nikhil Verma](https://www.linkedin.com/in/nikhil-verma-5767b3290/)