# RedditClone
This project is meant to be a clone for the Reddit website.

## Project Structure

```
RedditClone/
├── frontend/        # React frontend
├── backend/         # Express backend
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/reddit-clone
JWT_SECRET=your-secret-key-here
```

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The React app will open at `http://localhost:3000`

## Development

- Backend runs on: `http://localhost:5000`
- Frontend runs on: `http://localhost:3000`

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
