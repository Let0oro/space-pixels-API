# space-pixels-API

### General Project Description

This JavaScript backend powers a pixel art video game where users can create custom ships and engage in a pseudo-social network through scores, followers, likes, and an in-game economy. PostgreSQL is the primary database, storing user data, ships, and statistics, and it runs in a Docker container. An Excel file is used to auto-generate sample data, creating a dynamic, fully integrated gaming experience.

---

### Section 1: Docker Integration

To standardize the environment, the project runs in Docker containers, enabling fast deployment and restoration on any machine.

- **Dockerfile**: Defines environment setup, including Node.js dependencies and `pg` configuration.
- **Docker Commands**:
  - `docker build -t image_name .`: builds the backend Docker image.
  - `docker run -d --name container_name -p 5432:5432 image_name`: deploys the container on port 5432.
  - `docker-compose up`: launches multiple services defined in `docker-compose.yml`, including PostgreSQL and the Node.js server.

---

### Section 2: Seed Creation and Excel File Loading

The `ExcelJS` library imports sample data from an Excel file. Upon system restoration, a seed function populates tables with randomly generated data, facilitating fast testing and configuration during development.

- **Seeding Flow**: 
  1. On project startup, the backend checks if the database is empty.
  2. If so, it extracts data from the Excel file, generates random data, and inserts it into tables.

---

### Section 3: PostgreSQL Database Setup

PostgreSQL is configured via `pg`, enabling efficient connections and CRUD operations. Tables include `users`, `ships`, `scores`, `store`, and `interactions`, each responsible for different aspects of the game and social network.

- **`pg` Connection**: The backend establishes a connection using a connection pool, enhancing performance under multiple simultaneous requests.
- **SQL Scripts**: Queries initialize the database structure and maintain data integrity, applying constraints to prevent duplicates and ensure correct relationships.

---

### Section 4: Session Database for Cookies

User authentication and session management use a secondary database dedicated to session cookies, implementing user session persistence on the server.

- **Session Management Library**: `connect-pg-simple` stores sessions in PostgreSQL, maintaining user state and enhancing security.
- **Connection Pool Configuration**: Optimizes handling of concurrent sessions, using the previously configured `pg` connection.

---

### Section 5: Controllers and Routes

Each game module has its own controller, where business logic is defined for CRUD operations on users, ships, scores, and the store system. 

- **User and Ship Controllers**: Implement operations for registration, authentication, and storing ship data saved as color arrays in hexadecimal.
- **Store and Social Network Controller**: Manages interactions, including likes and followers, along with the in-game economy.

---

### Section 6: Middleware and Authentication

Middlewares validate user authentication before any sensitive operation. `jsonwebtoken` handles JWT authentication, allowing access to protected routes.

- **Authorization Middleware**: Verifies user roles, controlling special access like content administration.
- **Session Middleware**: Maintains active sessions using PostgreSQL-stored cookies.

---

### Section 7: Error Handling

The backend has a centralized error-handling system that sends clear, consistent responses to users and keeps a log of errors for debugging.

- **Error Middleware**: Captures exceptions and responds with specific HTTP codes.
- **Custom Error Messages**: Returns informative messages to help users understand issues, such as authentication failures, incorrect data, etc.

---

This modular structure and use of Docker and PostgreSQL make the project a scalable, solid base for this interactive social video game, enabling a secure and efficient implementation.
