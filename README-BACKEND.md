# MindVista Backend Server Setup

This guide will help you set up and run the backend server for the MindVista Psychology Web App.

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Setup Instructions

### 1. Install Node.js Dependencies

First, install the required dependencies for the backend server:

```bash
npm install express cors
npm install -D nodemon
```

Or if you prefer to use the package file:

```bash
npm install --save express cors
npm install --save-dev nodemon
```

### 2. Start the Backend Server

You have two options to start the server:

#### Option A: Using Node.js directly
```bash
node server.js
```

#### Option B: Using nodemon (recommended for development)
```bash
npx nodemon server.js
```

### 3. Verify the Server is Running

Once the server starts, you should see:
```
Server running on http://localhost:3000
Available routes:
  GET    /api/doctors
  POST   /api/doctors
  PUT    /api/doctors/:id
  DELETE /api/doctors/:id
  GET    /api/health
```

You can test the server by opening your browser and visiting:
- `http://localhost:3000/api/health` - Health check
- `http://localhost:3000/api/doctors` - List all doctors

### 4. Start the Frontend

In a **separate terminal window**, navigate to your project directory and start the frontend:

```bash
npm run dev
```

This will start the React frontend on `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints

The backend server provides the following API endpoints:

- **GET /api/doctors** - Fetch all doctors
- **POST /api/doctors** - Create a new doctor
- **PUT /api/doctors/:id** - Update an existing doctor
- **DELETE /api/doctors/:id** - Delete a doctor
- **GET /api/health** - Health check

## Example API Usage

### Create a New Doctor
```bash
curl -X POST http://localhost:3000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "specialization": "Psychiatry",
    "phone": "+1 (555) 123-4567",
    "experience": "10 years",
    "patients": 150,
    "rating": 4.5,
    "available": true
  }'
```

### Get All Doctors
```bash
curl http://localhost:3000/api/doctors
```

## Troubleshooting

### Port Already in Use
If you get an error that port 3000 is already in use, you can:
1. Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`
2. Or modify the PORT variable in `server.js` to use a different port

### CORS Issues
The server is configured to allow CORS from any origin. If you encounter CORS issues, make sure:
1. The backend server is running
2. The frontend is making requests to the correct URL (`http://localhost:3000`)

### API 404 Errors
If you get 404 errors:
1. Make sure the backend server is running
2. Check that the frontend is making requests to the correct endpoints
3. Verify the API base URL in `src/instance/index.jsx`

## Next Steps

This is a basic in-memory storage solution. For production, you should:
1. Replace the in-memory storage with a proper database (MongoDB, PostgreSQL, etc.)
2. Add authentication and authorization
3. Add data validation and sanitization
4. Implement proper error handling
5. Add logging and monitoring 