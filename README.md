# Event Planner App (era1)

## **Purpose**
This is a full-stack event planning application that allows users to
- create and manage events,
- join events,
- comment on events

## **Project Structure**
- **user-service**: Built using Node.js with Express and PostgreSQL. Manages user authentication (register, login). Provides token verification for event-service via JWT.

- **event-service**: Built using Node.js with Express and MongoDB. Manages events, including creation, update, delete, commenting and participation.

- **frontend**: Built using React. Providing UI interface interacting with both user-service for authentication and event-service for event management.

## **Installation and Running**

### **Prerequisites**
- Node.js and npm installed
- Docker (for running PostgreSQL and MongoDB)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/mertovun/era1.git
cd era1
```

### **Step 2: Set Up the User Service**

1. **Install dependencies:**
   ```bash
   cd user-service
   npm install
   ```

2. **Set up the environment variables in `.env`:**
   ```
   POSTGRES_USER=admin
   POSTGRES_PASSWORD=admin123
   POSTGRES_DB=user_service_db
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   JWT_SECRET=secret_key
   ```

3. **Run the User Service:**
   ```bash
   npm run start
   ```

### **Step 3: Set Up the Event Service**

1. **Install dependencies:**
   ```bash
   cd event-service
   npm install
   ```

2. **Run the Event Service:**
   ```bash
   npm run start
   ```

### **Step 3: Set Up the React Frontend**

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the Client App:**
   ```bash
   npm run start
   ```

---

## **API Endpoints**

### **User Service (Authentication)**

- **Register**:
  - `POST /auth/register`
  - Request Body: `{ "username": "string", "email": "string", "password": "string" }`
  
- **Login**:
  - `POST /auth/login`
  - Request Body: `{ "email": "string", "password": "string" }`

- **Verify Token**:
  - `GET /auth/verify`
  - Requires Bearer Token in the Authorization header.

### **Event Service (Requires Bearer Token)**

- **Create Event**:
  - `POST /events`
  - Request Body: `{ "title": "string", "description": "string", "date": "ISODate" }`
  
- **Get All Events**:
  - `GET /events`

- **Join Event**:
  - `POST /events/:id/join`
  
- **Unjoin Event**:
  - `POST /events/:id/unjoin`

- **Post Comment**:
  - `POST /events/:id/comments`
  - Request Body: `{ "text": "string" }`

- **Update Event**:
  - `PUT /events/:id`
  - Request Body: `{ "title": "string", "description": "string", "date": "ISODate" }`

- **Delete Event**:
  - `DELETE /events/:id`

---

## **Running Tests**

You can use the **REST Client** extension in **VS Code** to test the endpoints. 

Example requests are included in the `user.rest` and `event.rest` files in the test folder.

---
