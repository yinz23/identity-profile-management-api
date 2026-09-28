# Identity & Profile Management API

## About

This project is an Identity and Profile Management system for a university environment.

Users can maintain three types of identities:

- Preferred
- Academic
- Legal

Role-based permissions control which identities can be viewed:

| Role | Can View |
|---|---|
| Student | Preferred |
| Lecturer | Preferred, Academic |
| Administrator | Preferred, Academic, Legal |

The application uses React for the frontend, Node.js and Express for the backend, and MySQL for the database.


## Requirements

Make sure the following are installed:

- Node.js and npm
- MySQL Server
- MySQL Workbench or MySQL Shell


## Installation

### Backend

From the main project folder:

```bash
npm install
```

If required, install the backend dependencies:

```bash
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
```

### Frontend

Navigate to the frontend folder:

```bash
cd frontend
npm install
```


## Database Setup

Create the database:

```sql
CREATE DATABASE identity_management;
USE identity_management;
```

Create the tables:

```sql
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE identities (
    identity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    identity_type ENUM('preferred', 'academic', 'legal') NOT NULL,
    identity_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, identity_type)
);

CREATE TABLE permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    identity_type ENUM('preferred', 'academic', 'legal') NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE,
    UNIQUE (role_id, identity_type)
);
```

Add the roles and permissions:

```sql
INSERT INTO roles (role_name)
VALUES ('student'), ('lecturer'), ('administrator');

INSERT INTO permissions (role_id, identity_type)
VALUES
(1, 'preferred'),
(2, 'preferred'),
(2, 'academic'),
(3, 'preferred'),
(3, 'academic'),
(3, 'legal');
```


## Environment Variables

Create a `.env` file in the main project folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=identity_management
JWT_SECRET=YOUR_SECRET_KEY
PORT=5000
```

Replace the MySQL password and JWT secret with your own values.


## Running the Application

Make sure MySQL is running.

### Backend

From the main project folder:

```bash
node src/server.js
```

The backend runs at:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite in the browser.


## Creating a User

The frontend provides login but not registration. Test users can be created using Postman.

Send:

```text
POST http://localhost:5000/api/users/register
```

Example student account:

```json
{
    "username": "studentTest",
    "email": "studentTest@example.com",
    "password": "password",
    "roleId": 1
}
```

Role IDs:

- `1` = Student
- `2` = Lecturer
- `3` = Administrator

After registration, use the username and password to log in through the frontend.


## Main Features

- User login and JWT authentication
- Password hashing using bcrypt
- Create, edit and delete identities
- View own identities
- Role-based contextual identity viewing
- Student, Lecturer and Administrator permissions
- Duplicate identity prevention
- Protection against unauthorized identity modification


## Main API Endpoints

```text
POST   /api/users/register
POST   /api/users/login

GET    /api/identity/me
GET    /api/identity/:id
POST   /api/identity
PUT    /api/identity/:id
DELETE /api/identity/:id
```

Protected identity endpoints require a valid JWT Bearer token.