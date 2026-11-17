# TaskFlow API

A project management REST API built with **Node.js, Express.js, TypeScript, and MongoDB**. TaskFlow provides secure user authentication, role-based authorization, and project management functionality.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization (Admin and User)
- Create, read, update, and delete projects
- User-specific project access
- Admin-only operations
- Delete users and their associated projects
- Project search
- Project status filtering
- Pagination
- Sorting
- Request validation using Zod

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Zod

## Project Structure

```text
TaskFlow/
│
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── projectController.ts
│   │
│   ├── db/
│   │   └── database.ts
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.ts
│   │   └── authMiddleware.ts
│   │
│   ├── models/
│   │   ├── projectModel.ts
│   │   └── userModel.ts
│   │
│   ├── routes/
│   │   ├── authRouts.ts
│   │   └── projectRoutes.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   ├── validators/
│   │   └── authValidator.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/AbubakarSiddique966/taskflow-api.git
```

**2. Navigate to the project directory**

```bash
cd taskflow-api
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use the actual environment variable names expected by your application.

**5. Run the development server**

```bash
npm run dev
```

## API Functionality

| Module | Functionality |
|---|---|
| Authentication | Register and Login |
| Authorization | JWT and Role-based access |
| Projects | Create, Read, Update, Delete |
| Admin | User management |
| Search | Search projects |
| Filtering | Filter projects by status |
| Pagination | Limit and navigate results |
| Sorting | Sort project results |

## Authentication

TaskFlow uses JWT (JSON Web Tokens) to protect private routes.

Users must provide a valid token when accessing protected endpoints.

Example:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## User Roles

**User**
- Register and log in.
- Manage their authorized projects.
- Access protected project functionality.

**Admin**
- Access administrative functionality.
- Manage users.
- Perform administrative operations.

## Future Improvements

- API documentation using Swagger
- Unit and integration testing
- Rate limiting
- Deployment
- Logging and monitoring

## Author

**Abubakar Siddique**

GitHub: [@AbubakarSiddique966](https://github.com/AbubakarSiddique966)

---

Built as a backend development practice project to strengthen skills in Node.js, Express.js, TypeScript, MongoDB, and REST API development.
