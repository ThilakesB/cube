# Cube AI Solutions ERP Software

A full-stack Enterprise Resource Planning (ERP) application built with React, FastAPI, and PostgreSQL.

## 🚀 Modules & Features

- **Employee Management**: Manage staff profiles, designations, roles, contact details, and department allocations.
- **Projects & Taskboard**: Track company projects, budgets, rates, deadlines, priorities, team members, and task workflows with full deletion and search capabilities.
- **Attendance & Leave Management**: Record attendance, clock-in/out times, leave types, and monthly attendance sheets with quick selection from stored employee datasets.
- **Payroll & Salaries**: Manage employee salary structures, allowances (DA, HRA, Conveyance, Medical), deductions (PF, ESI, TDS, Tax), and payslip generation.
- **Recruitment & Jobs**: Job postings, resume tracking, candidate shortlisting, and job offer approval pipelines.
- **Training & Development**: Trainer management, training scheduling, and cost tracking.
- **HR Operations**: Promotions, resignations, terminations, and performance appraisals.
- **Budgeting & Accounting**: Track revenues, expenses, categories, and financial logs.
- **Company Settings & Holidays**: Company configuration, public holidays, and administrative notifications.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v7, Material UI (MUI), Axios, Lucide/Material Icons
- **Backend**: FastAPI, SQLAlchemy ORM, Pydantic v2, Uvicorn
- **Database**: PostgreSQL (with automatic schema initialization)

---

## 📦 Setup & Installation

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- PostgreSQL 14+

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Copy environment template and configure your PostgreSQL database credentials
cp .env.example .env

# Initialize database schema
python init_db.py

# Start FastAPI server
uvicorn main:app --reload --port 5000
```
API Documentation will be available at `http://localhost:5000/docs`.

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env

# Start React app
npm start
```
Frontend application will run at `http://localhost:3000`.

---

## 🔒 Confidentiality & Security
Sensitive files (`.env`, `node_modules`, database binaries, and local credentials) are protected and excluded via `.gitignore`.
