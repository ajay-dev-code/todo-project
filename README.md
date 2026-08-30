 📔 Personal Diary — Full-Stack Journaling Application

A full-stack personal diary application that allows users to securely register, log in, create diary entries, manage tasks, and track their mood.

 🚀 Features

* User registration and login
* JWT-based authentication
* BCrypt password hashing
* Create, view, edit, and delete diary entries
* Mood selection for diary entries
* Dated diary entries
* Task completion tracking
* User-specific diary data
* Responsive frontend
* RESTful backend APIs
* MySQL database integration
* CORS configuration
* Backend deployed on Railway

 🛠️ Technologies Used

 Backend

* Java
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* Maven

 Database

* MySQL

 Frontend

* HTML
* CSS
* JavaScript

 Tools & Deployment

* Git
* GitHub
* Postman
* Railway

 🏗️ Application Workflow

                    ┌─────────────────────┐
                    │     User Browser    │
                    │  HTML/CSS/JavaScript│
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                     ┌─────────┴─────────┐
                     │                   │
                     ▼                   ▼
              ┌─────────────┐    ┌──────────────┐
              │ JWT / Spring│    │ REST APIs    │
              │  Security   │    │ CRUD Logic   │
              └─────────────┘    └──────┬───────┘
                                         │
                                         ▼
                                ┌────────────────┐
                                │     MySQL      │
                                │    Database    │
                                └────────────────┘

 🔐 Authentication Flow

User
  │
  ▼
Register
  │
  ▼
Password encrypted using BCrypt
  │
  ▼
User stored in MySQL
  │
  ▼
Login
  │
  ▼
Credentials validated
  │
  ▼
JWT Token generated
  │
  ▼
Token sent to frontend
  │
  ▼
Token included in API requests
  │
  ▼
Spring Security validates JWT
  │
  ▼
Authorized user accesses diary APIs

 📝 Diary Entry Workflow

User Login
    │
    ▼
JWT Authentication
    │
    ▼
Create Diary Entry
    │
    ├── Title
    ├── Description
    ├── Mood
    └── Date
    │
    ▼
REST API
    │
    ▼
Spring Boot
    │
    ▼
Spring Data JPA
    │
    ▼
MySQL
    │
    ▼
Diary Entry Saved

 🔄 CRUD Operations

| Operation | Description            |
| --------- | ---------------------- |
| CREATE    | Add a new diary entry  |
| READ      | View diary entries     |
| UPDATE    | Edit an existing entry |
| DELETE    | Delete an entry        |

 📡 Main API Endpoints

 Authentication

POST /auth/register
POST /auth/login

 Diary

POST   /api/create
GET    /api/get
PUT    /api/update/{id}
DELETE /api/delete/{id}

> Note: Update the endpoint names above if your actual project uses different mappings.

 🗄️ Database

The application uses MySQL for persistent data storage.

Main data includes:

* User information
* Encrypted passwords
* Diary entries
* Entry dates
* Mood
* Task completion status

 🔒 Security

* JWT-based authentication
* BCrypt password hashing
* Spring Security authorization
* User-specific diary access
* Protected REST API endpoints
* CORS configuration for frontend/backend communication

 🌐 Deployment

The backend is deployed using Railway.

The frontend communicates with the deployed Spring Boot backend through REST APIs.

Frontend
   │
   │ HTTP / REST API
   ▼
Railway Backend
   │
   ▼
MySQL Database

 🧪 API Testing

REST APIs were tested using Postman.

Testing includes:

* User registration
* User login
* JWT authentication
* Creating diary entries
* Retrieving entries
* Updating entries
* Deleting entries


 ▶️ How to Run Locally

 1. Clone the repository


git clone YOUR_GITHUB_REPOSITORY_URL

 2. Open the backend

Open the Spring Boot project in Eclipse or VS Code.

 3. Configure MySQL

Create a MySQL database and configure your database credentials in:


application.properties

 4. Run the Spring Boot application

Run the main Spring Boot application.

The backend will start on:

http://localhost:8080

 5. Open the frontend

Open the frontend files using a browser or Live Server.

 6. Test the application

Register a new user, log in, and start creating diary entries.

 📂 Project Structure

Personal-Diary/
│
├── src/
│   ├── pom.xml
│   └── application.properties
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── style.css
│   └── script.js
│
└── README.md


> Adjust the folder structure above to match your actual repository.

 📌 Future Improvements

* Search and filter diary entries
* Image attachments
* Password reset
* Email verification
* Pagination
* Cloud database
* Improved dashboard and analytics


