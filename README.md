# Smart Campus Complaint & Maintenance System

A full-stack web application for managing campus maintenance complaints, built with **React**, **Vite**, and **Tailwind CSS**.

## Features

- **AI-powered complaint classification** — auto-suggests category, department, priority and summary
- **Role-based access control** — Student, Maintenance Staff, and Admin portals
- **Real-time status tracking** — Pending → Assigned → In Progress → Resolved
- **Smart staff assignment** — workload visibility for admins
- **Analytics & Reports** — charts, resolution rates, department performance
- **Premium dark UI** — glassmorphism, animations, responsive design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router v6 |
| Notifications | React Hot Toast |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campus.edu | admin123 |
| Student | arjun@student.edu | student123 |
| Staff | selvam@staff.edu | staff123 |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── charts/        # Recharts components
│   └── shared/        # Reusable UI components
├── contexts/          # AuthContext, DataContext
├── data/              # Mock data (users, complaints, etc.)
├── pages/
│   ├── auth/          # Login, Register
│   ├── student/       # Student portal pages
│   ├── staff/         # Staff portal pages
│   └── admin/         # Admin portal pages
└── utils/             # Helpers, AI classifier
```

## User Roles

- **Student** — Submit complaints, track status, give feedback
- **Maintenance Staff** — View assigned complaints, update progress, mark resolved
- **Admin** — Full system access, assign staff, manage departments/categories, view reports

---

*Built as a university project demonstrating centralized complaint management, AI classification, and campus maintenance analytics.*
