# PROJECT REPORT
## Job Board SaaS Platform (Web Development Domain)

---

## 1. Candidate & Program Details

| Field | Details |
|------|--------|
| Candidate Name | Divyanshu Mishra |
| Email | [mishraaman4512@gmail.com](mailto:mishraaman4512@gmail.com) |
| Contact Number | 9506880176 |
| Company | MetaUpSpace |
| Program Name | Industry Ready Developer Program (IRDP) |
| Domain | Web Development |
| Project Title | Job Board SaaS Platform |
| Mentor Name | Saksham Jain & Harshit Saini |
| Submission Date | 06/05/2026 |

---

## 2. Executive Summary

NextHire is a SaaS-based job board platform designed to streamline the hiring process for recruiters, company administrators, and candidates. It solves the common problem of fragmented job discovery, difficult application tracking, and inefficient application review by providing one centralized platform for job posting, company verification, candidate applications, and status tracking.

The target users are candidates looking for jobs and recruiter-side users such as recruiters, HR, managers, company admins, and super admins who need structured hiring workflows. The platform supports secure authentication, role-based access control, company KYC verification, job posting and management, job search and filtering, application review, assessment link sharing, profile management, and file uploads.

The application uses React, Redux Toolkit, React Router DOM, Node.js, Express.js, MongoDB, JWT authentication, Zod validation, Multer, and Cloudinary. The final outcome is a production-oriented full-stack web application with modular backend architecture, reusable frontend components, secure APIs, and role-based dashboards.

---

## 3. Problem Statement

Modern recruitment systems often suffer from poor role separation, scattered job listings, weak application tracking, and complicated company onboarding. Candidates struggle to manage multiple applications in one place, while companies need a controlled way to verify their identity, manage team members, and review applicants efficiently.

NextHire addresses this hiring and job application problem by offering a secure, scalable, and user-friendly platform where candidates can search and apply for jobs, and company-side users can post jobs, review applications, and manage the hiring pipeline.

---

## 4. Solution Overview

NextHire is a layered monolithic recruitment platform built around separate public, authenticated, and dashboard experiences.

- System functionality includes authentication, company registration and KYC, job posting, application submission, application management, profile editing, and admin approval workflows.
- User roles include candidate, recruiter, HR, manager, company admin, and super admin.
- Key workflows start with registration and login, continue through company verification and job posting, and end with candidate applications, recruiter review, and final status updates.

At a high level, candidates browse jobs and apply using a resume link and cover letter, while recruiter-side users manage job posts and review applications. Super admins approve or reject companies, and company admins can add team members after company onboarding.

---

## 5. Objectives

* To build a scalable SaaS-based job portal for real-world hiring workflows
* To provide secure authentication and role-based access control
* To support company registration, verification, and team management
* To implement a job posting and application review system
* To create a responsive and reusable frontend interface
* To build modular REST APIs with validation and error handling
* To gain hands-on experience in production-style full-stack development

---

## 6. Technology Stack

| Layer | Technology Used |
|------|----------------|
| Frontend | React, Redux Toolkit, React Router DOM, CSS Modules, Vanila CSS|
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT |
| Deployment | Render, Vercel |
| Other Tools | Cloudinary, Multer, Zod, Nodemailer, Git, GitHub |

---

## 7. System Architecture

### 7.1 Architecture Type
Layered Monolithic Architecture

### 7.2 High-Level Flow
Client → React Frontend → Express API → Business Logic → MongoDB Database → Response

### 7.3 Description
The frontend sends requests to Express REST APIs through a centralized API layer. Redux Toolkit stores authentication state, while React Router DOM manages public pages, protected dashboard routes, and role-specific layouts.

On the backend, requests pass through validation and authorization middleware before reaching module controllers and services. Data is stored in MongoDB using Mongoose models for users, companies, jobs, and applications. Cloudinary is used for uploaded files such as KYC documents and profile-related images.

---

## 8. Key Features

### 8.1 Core Features
- [x] User Authentication (Signup/Login)
- [x] Role-Based Access Control (Recruiter / Candidate)
- [x] Job Posting & Management (Create, Edit, Delete)
- [x] Dynamic Job Board (Application Status Tracking)
- [x] Real-time Recruiter Stats (Active Jobs, Candidates, Shortlisted)
- [x] Dynamic Activity Feed (Recent Application Tracking)
- [x] Premium Dashboard UI (Outfit/Jakarta Sans, CSS Modules)
- [x] CRUD Operations

### 8.2 Advanced Features (Tick Implemented)
- [x] Pagination & Filtering
- [x] Search Functionality
- [x] Protected Routes
- [x] Secure APIs
- [x] Error Handling
- [x] Deployment

---

## 9. Module-Wise Breakdown

### 9.1 Authentication Module
**Description:**
The authentication system supports user registration, login, JWT token generation, and session restoration on the frontend. Passwords are hashed before storage, protected routes restrict unauthenticated access, and role-based authorization ensures users only access allowed resources.

---

### 9.2 Job Management Module
**Description:**
The job management module allows approved company recruiters and HR to create, update, delete, and view job listings. Each job stores title, description, location, salary range, job type, experience level, and required skills. Public users can browse jobs and filter them by keyword, location, and type. Company Admins have view-only access to their company's job listings.

---

### 9.3 Dashboard & Stats Module
**Description:**
The Recruiter Dashboard has been modernized with real-time statistics including Active Jobs, Total Candidates, and Shortlisted counts. A dynamic Recent Activity feed tracks latest applications with relative time formatting (e.g., "2 hours ago") and status badges. The UI features premium typography and smooth transitions using CSS Modules.

---

### 9.4 Application Module
**Description:**
The application module handles the full job application flow. Candidates can apply by providing a resume link and uploading a PDF cover letter. Recruiter-side users can review applications, view/download cover letters directly, shortlist, reject, select, and send assessment links. The system also tracks application status in real-time, showing "Applied" status directly on the job cards for candidates.

---

### 9.4 Frontend Module
**Description:**
The frontend uses a component-based architecture with public layouts and dashboard layouts. Reusable UI components such as buttons, badges, loaders, modals, cards, and inputs keep the interface consistent. Role-based dashboards improve navigation, while CSS Modules and inline styling are used for styling.

---

### 9.5 Database Design
**Entities:**
- Users
- Companies
- Jobs
- Applications

**Explanation:**
The schema is designed to support nested profile data and recruitment workflows. Users store identity and profile details along with role and company association. Companies store registration and verification details. Jobs store job metadata and the company reference. Applications store the candidate, job, company, application status, resume URL, cover letter, and assessment link.

---

## 10. API Design Overview

| Endpoint | Method | Description |
|---------|--------|------------|
| /api/auth/register | POST | User registration |
| /api/auth/login | POST | User login |
| /api/auth/me | GET | Get current authenticated user |
| /api/users/profile | GET | Fetch user profile |
| /api/users/profile | PUT | Update profile |
| /api/company | GET | Get approved companies |
| /api/company/register | POST | Register company with KYC |
| /api/company/dashboard/stats | GET | Company dashboard stats |
| /api/company/team/all | GET | Fetch team members |
| /api/company/team/add | POST | Add team member |
| /api/jobs | GET | Fetch jobs |
| /api/jobs | POST | Create job |
| /api/jobs/:id | GET | Fetch single job |
| /api/jobs/:id | PUT | Update job |
| /api/jobs/:id | DELETE | Delete job |
| /api/jobs/stats | GET | Public platform stats |
| /api/jobs/get/company-jobs | GET | Fetch jobs for company |
| /api/application | POST | Apply to job |
| /api/application/my-applications | GET | Fetch my applications |
| /api/application/job/:jobId | GET | Fetch job applications |
| /api/application/get/company-applications | GET | Fetch company applications |
| /api/application/:id/status | PUT | Update application status |
| /api/application/:id/assessment | POST | Send assessment link |
| /api/admin/companies | GET | Fetch all companies for super admin |
| /api/admin/companies/:companyId/kyc | PUT | Update company KYC status |
| /api/upload | POST | Upload file to Cloudinary |

**Candidate Input:**
The actual backend APIs are organized under the `/api` prefix with separate route groups for auth, users, company, jobs, application, admin, and upload.

---

## 11. Challenges & Solutions

| Challenge | Solution |
|----------|---------|
| Managing different user roles and access levels | Implemented role-based middleware and role-aware dashboard routing |
| Supporting company onboarding with verification | Added company registration, KYC upload, and super admin approval flow |
| Keeping application records consistent | Used unique application constraints and service-layer validation |
| Handling file uploads securely | Integrated Multer with Cloudinary for image and document storage |
| Maintaining reusable frontend structure | Built a feature-based component architecture with shared UI components |

---

## 12. Performance & Optimization

- Query-based filtering for jobs using keyword, location, and job type
- Separate feature modules to keep API logic maintainable
- Reusable frontend components to avoid repeated UI code
- Centralized auth state management with Redux Toolkit
- Efficient dashboard loading with targeted API calls

**Candidate Input:**
The project focuses on clean API separation and practical performance improvements rather than heavy caching or pagination at scale. Filtering and route protection are implemented to keep interactions responsive and secure.

---

## 13. Testing Strategy

- API Testing
- Manual UI Testing
- Authentication Testing
- Route Protection Testing
- Role Access Verification

**Candidate Input:**
The APIs were tested using Postman and browser-based manual testing. Frontend flows such as login, registration, company registration, job browsing, job application, profile update, and dashboard access were checked manually. MongoDB Compass was used to inspect stored records where needed.

---

## 14. Deployment Details

| Item | Details |
|-----|--------|
| Frontend URL | Deployed on Vercel |
| Backend URL | Deployed on Render |
| GitHub Repository | NextHire GitHub Repository |
| Hosting Platform | Render / Vercel |

---

## 15. Outcomes

- Production-ready SaaS application
- Live deployed system
- Real-world portfolio project
- Hands-on experience with industry tools

---

## 16. Key Learnings

- Backend architecture design
- Authentication and security
- Real-world problem solving
- Deployment and production readiness

**Candidate Input:**
This project improved my understanding of modular backend development, role-based access control, frontend state management, and real-world workflow design. It also helped me work with production-style APIs, file uploads, and deployment pipelines.

---

## 17. Future Enhancements

- Real-time notifications
- Resume parsing
- Admin dashboard
- Recommendation engine

**Candidate Input:**
Future improvements can include AI-based job recommendations, analytics for recruiter dashboards, real-time chat between recruiters and candidates, and pagination improvements for very large job and application datasets.

---

## 18. Self-Evaluation

| Criteria | Self Rating (1–5) | Remarks |
|---------|------------------|--------|
| Technical Skills | 5 | Strong implementation of full-stack architecture and backend workflows |
| Problem Solving | 5 | Solved role management, verification, and application workflow challenges |
| Code Quality | 4 | Kept the project modular and reusable with feature-based structure |
| System Design | 4 | Applied layered architecture and structured API design |

---

## 19. Declaration

I hereby declare that the project submitted is my original work and has been completed as part of the IRDP program.

- Candidate Signature: Divyanshu Mishra
- Date: 06/05/2026

---

## 20. Appendix

## Screenshots
### Company Admin
![Company Admin Screenshot](frontend/dist/assets/Screenshot/Company-Admin/Screenshot%202026-05-06%20210106.png)
### HR

![HR Screenshot 5](frontend/dist/assets/Screenshot/HR/Screenshot%202026-05-06%20204118.png)

![HR Screenshot 1](frontend/dist/assets/Screenshot/HR/Screenshot%202026-05-06%20203715.png)

![HR Screenshot 2](frontend/dist/assets/Screenshot/HR/Screenshot%202026-05-06%20203727.png)

![HR Screenshot 3](frontend/dist/assets/Screenshot/HR/Screenshot%202026-05-06%20203738.png)

![HR Screenshot 4](frontend/dist/assets/Screenshot/HR/Screenshot%202026-05-06%20203755.png)

### Super Admin
![Super Admin Screenshot](frontend/dist/assets/Screenshot/SuperAdmin/image.png)

### USER Page Screenshots

![USER Screenshot 1](frontend/dist/assets/Screenshot/USER/Screenshot%202026-05-06%20212150.png)

![USER Screenshot 2](frontend/dist/assets/Screenshot/USER/Screenshot%202026-05-06%20212239.png)

![USER Screenshot 3](frontend/dist/assets/Screenshot/USER/Screenshot%202026-05-06%20212454.png)

![USER Screenshot 4](frontend/dist/assets/Screenshot/USER/Screenshot%202026-05-06%20212507.png)

![USER Screenshot 5](frontend/dist/assets/Screenshot/USER/Screenshot%202026-05-06%20212533.png)

![USER Screenshot 6](frontend/dist/assets/Screenshot/USER/image.png)

## 🏗️ Architecture Diagram — NextHire

## 📌 Architecture Type

**Layered Monolithic Full-Stack SaaS Architecture**

---

# 🌐 High-Level System Architecture

```plaintext
┌─────────────────────────────────────────────┐
│                 CLIENT LAYER                │
│─────────────────────────────────────────────│
│ React Frontend (Vite)                       │
│ Redux Toolkit (State Management)            │
│ React Router DOM                            │
│ Axios API Layer                             │
└─────────────────────────────────────────────┘
                     │
                     ▼
                

┌─────────────────────────────────────────────┐
│               API COMMUNICATION             │
│─────────────────────────────────────────────│
│ REST API Requests (JWT Protected)           │
│ Role-Based Route Access                     │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│               EXPRESS BACKEND               │
│─────────────────────────────────────────────│
│ Routes → Controllers → Services → Models    │
│                                             │
│ Modules:                                    │
│ - Auth Module                               │
│ - User Module                               │
│ - Company/KYC Module                        │
│ - Job Module                                │
│ - Application Module                        │
│ - Upload Module                             │
│ - Admin Module                              │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│              MIDDLEWARE LAYER               │
│─────────────────────────────────────────────│
│ JWT Authentication                          │
│ Role-Based Authorization                    │
│ Request Validation                          │
│ Error Handling                              │
│ File Upload Middleware                      │
└─────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌───────────────────┐   ┌────────────────────┐
│    MONGODB DB     │   │    CLOUDINARY      │
│───────────────────│   │────────────────────│
│ Users             │   │ Resume Uploads     │
│ Companies         │   │ KYC Documents      │
│ Jobs              │   │ Images / Media     │
│ Applications      │   │                    │
└───────────────────┘   └────────────────────┘
```

---

# 🔄 Complete Workflow Architecture

```plaintext
Company Registration
        ↓
KYC Upload
        ↓
Super Admin Verification
        ↓
Approved Company
        ↓
Company Admin Adds Team
(HR / Recruiter / Manager)
        ↓
Recruiter Posts Job
        ↓
User Searches Jobs
        ↓
User Applies
        ↓
HR Shortlists / Rejects
        ↓
Manager Reviews Candidate
        ↓
Assessment Sent
        ↓
Final Selection / Rejection
        ↓
User Tracks Status
```

---

# 👥 Role-Based Architecture

| Role          | Responsibility                      |
| ------------- | ----------------------------------- |
| User          | Search & apply for jobs             |
| Recruiter     | Create/manage jobs & view dashboard |
| HR            | Shortlist/reject candidates         |
| Manager       | Assessment & final decisions        |
| Company Admin | Manage team & view company stats    |
| Super Admin   | KYC verification & platform control |

---

# 🔐 Security Architecture

```plaintext
Frontend Request
        ↓
JWT Authentication Middleware
        ↓
Role Authorization Middleware
        ↓
Validation Middleware
        ↓
Controller → Service → Database
```

---

# 📂 Frontend Architecture

```plaintext
React App
│
├── Public Pages
├── Protected Dashboard Routes
├── Redux Global State
├── Reusable UI Components
├── Feature-Based Modules
└── Axios API Integration
```

---

# 📂 Backend Architecture

```plaintext
Routes
  ↓
Controllers
  ↓
Services
  ↓
Mongoose Models
  ↓
MongoDB Database
```

---



# 🎯 Key Architectural Features

* Modular feature-based backend
* Role-based access control (RBAC)
* Multi-stage hiring pipeline
* Company KYC verification
* Secure JWT authentication
* Cloudinary-based file storage
* Scalable frontend component architecture
* Dashboard-based workflow separation

---

# 💡 README Description

> NextHire follows a layered monolithic architecture with role-based workflow separation. The frontend communicates with protected REST APIs through Axios, while the backend uses modular services, middleware-based authorization, and MongoDB persistence. Cloudinary is integrated for scalable file storage.


## API Documentation

| Endpoint | Method | Description | Auth |
|---------|--------|-------------|------|
| /api/auth/register | POST | User registration | No |
| /api/auth/login | POST | User login | No |
| /api/auth/me | GET | Get current authenticated user | Yes |
| /api/users/profile | GET | Fetch user profile | Yes |
| /api/users/profile | PUT | Update user profile | Yes |
| /api/company | GET | Get approved companies | No |
| /api/company/register | POST | Register company with KYC | Yes |
| /api/company/dashboard/stats | GET | Get company dashboard stats | Yes |
| /api/company/team/all | GET | Fetch team members | Yes |
| /api/company/team/add | POST | Add team member | Yes |
| /api/jobs | GET | Fetch jobs | No |
| /api/jobs | POST | Create job | Yes |
| /api/jobs/:id | GET | Fetch single job | No |
| /api/jobs/:id | PUT | Update job | Yes |
| /api/jobs/:id | DELETE | Delete job | Yes |
| /api/jobs/stats | GET | Public platform stats | No |
| /api/jobs/get/company-jobs | GET | Fetch company jobs | Yes |
| /api/application | POST | Apply to a job | Yes |
| /api/application/my-applications | GET | Fetch my applications | Yes |
| /api/application/job/:jobId | GET | Fetch job applications | Yes |
| /api/application/get/company-applications | GET | Fetch company applications | Yes |
| /api/application/:id/status | PUT | Update application status | Yes |
| /api/application/:id/assessment | POST | Send assessment link | Yes |
| /api/admin/companies | GET | Fetch all companies for super admin | Yes |
| /api/admin/companies/:companyId/kyc | PUT | Update company KYC status | Yes |
| /api/upload | POST | Upload file to Cloudinary | Yes |

### Notes
- Base API prefix: `/api`
- Protected routes require a valid JWT token
- Role-based access is enforced on company, application, and admin routes
- Request validation is handled with Zod and middleware before reaching controllers

---

# Conclusion

NextHire is a job board SaaS platform built to solve the real-world problems of job discovery, company verification, job posting, and application management. The system supports secure authentication, role-based workflows, modular backend APIs, and reusable frontend components.

The project demonstrates practical full-stack development using React, Redux Toolkit, Node.js, Express.js, MongoDB, JWT, Cloudinary, and Zod. It is suitable both as an academic submission for the IRDP program and as a portfolio-ready production-style application.
