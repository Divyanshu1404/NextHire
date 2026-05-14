# NextHire Project: Technical Internal Logic & Presentation Guide

## 1. Project Overview
**NextHire** is a full-stack Job Portal built using the **MERN Stack** (MongoDB, Express, React, Node.js). It is designed to bridge the gap between Candidates and Recruiters through a secure, scalable, and modular architecture.

---

## 2. Core Architecture: The "Modular" Approach
Unlike traditional monolithic applications, NextHire uses a **Feature-Based Modular Architecture**.

### Backend Structure:
Each feature (User, Job, Company, Auth) is self-contained in a module folder:
- **Routes:** Defines the API endpoints.
- **Controllers:** Handles the logic for requests/responses.
- **Services:** Manages database interactions (Mongoose).
- **Validations:** Ensures data integrity using Zod schemas.

**Why this matters:** This design allows for "Plug-and-Play" development. Adding a new feature like "Chat" wouldn't require modifying existing "Job" or "Auth" logic.

---

## 3. The Technical Logic Flow
When a user interacts with the app, the following logic is executed:

### Step 1: The Request (Frontend)
- The React frontend (built with **Vite**) sends a request via **Axios**.
- If the route is protected, the **JWT (JSON Web Token)** is attached to the request header.

### Step 2: Security & Validation (Middleware)
- **Authentication:** The `protect` middleware verifies the JWT token.
- **Authorization:** The `authorizeRoles` middleware checks if the user's role (Candidate, Recruiter, Admin) has permission for that specific action.
- **Validation:** The `validate` middleware checks the input data against a Zod schema to prevent SQL injection or bad data.

### Step 3: Business Logic (Controller & Service)
- The **Controller** extracts the data.
- The **Service** performs the operation (e.g., saving a job to MongoDB).
- Passwords are never stored in plain text; they are hashed using **Bcrypt.js**.

### Step 4: The Response
- A standardized JSON response is sent back.
- Global state in React is updated using **Redux Toolkit**.

---

## 4. Key Features & Internal Logic
| Feature | Logic Explanation |
| :--- | :--- |
| **Authentication** | Uses JWT for stateless sessions. Passwords hashed with Bcrypt. |
| **Role Management** | Strict Role-Based Access Control (RBAC). Only Recruiters can post jobs. |
| **Job Management** | CRUD operations with soft-delete capabilities. |
| **API Documentation** | Integrated **Swagger UI** for real-time API testing. |
| **File Handling** | Managed via a dedicated `upload` module for resumes and logos. |

---

## 5. Frequently Asked Questions (Preparation)

### Q1: "How do you handle security in your project?"
**Answer:** "Security is handled at multiple layers. We use Bcrypt for password hashing, JWT for session management, and custom Middleware for Role-Based Access Control. Additionally, we use Zod for schema validation to prevent malicious data entry."

### Q2: "What is the benefit of using Redux in this project?"
**Answer:** "Redux Toolkit acts as a Single Source of Truth. It allows us to manage the user's login state and job data across the entire application without 'Prop-Drilling,' ensuring the UI stays in sync with the backend."

### Q3: "Explain your database design."
**Answer:** "We use MongoDB, a NoSQL database. We use Mongoose for schema modeling. Our models are highly relational (using ObjectIds), allowing us to link Jobs to Companies and Applications to Candidates efficiently."

---

## 6. Deployment & Testing
- **Development:** Built with Vite for instant Hot Module Replacement (HMR).
- **API Testing:** Documented and tested via Swagger at `/api-docs`.
- **Environment:** Sensitive data (DB URI, JWT Secret) is managed via `.env` files for security.

---

## 7. API Endpoint Reference (Summary)
The backend provides a structured set of RESTful APIs categorized by feature.

### A. Auth Module (`/api/auth`)
Handles user identity and session lifecycle.
- `POST /register`: Registers a new Candidate or Recruiter.
- `POST /login`: Validates credentials and returns a signed JWT.
- `GET /me`: Returns the profile of the currently authenticated user.

### B. Job Module (`/api/jobs`)
Manages the lifecycle of job postings.
- `GET /`: Lists all available jobs with filtering and search logic.
- `POST /`: (**Recruiter/Admin Only**) Creates a new job listing.
- `GET /:id`: Fetches full details and requirements for a single job.
- `PUT /:id`: (**Owner/Admin Only**) Modifies an existing job posting.
- `DELETE /:id`: (**Admin Only**) Removes a job listing from the system.

### C. Company Module (`/api/company`)
Handles corporate branding and verification.
- `POST /`: Registers a new company entity.
- `GET /`: Lists all verified hiring companies.
- `PUT /kyc`: Updates the verification and compliance status of a company.
- `GET /my-company`: Fetches details for the recruiter's associated company.

### D. Application Module (`/api/applications`)
Coordinates the hiring process between users.
- `POST /apply/:jobId`: (**Candidate Only**) Submits a resume and profile for a specific role.
- `GET /my-applications`: (**Candidate Only**) Tracks the status of all submitted applications.
- `GET /job/:jobId`: (**Recruiter Only**) Lists all candidates who applied for their posting.
- `PATCH /status/:id`: (**Recruiter Only**) Updates the application stage (e.g., Shortlisted, Interviewing).

### E. Upload Module (`/api/upload`)
Manages cloud or local storage for user files.
- `POST /resume`: Handles PDF/DOCX uploads for candidate resumes.
- `POST /logo`: Handles image uploads for company branding.
