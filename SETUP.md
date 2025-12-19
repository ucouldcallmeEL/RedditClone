# Setup Guide - Step by Step Commands

## Step 1: Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

## Step 2: Set Up Backend Environment

Create a `.env` file in the `server` directory:

```bash
# In the server directory, create .env file
touch .env
```

Add the following content to `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/reddit-clone
JWT_SECRET=your-secret-key-here-change-in-production
```

**Note:** If you're using MongoDB Atlas (cloud), replace `MONGO_URI` with your Atlas connection string.

## Step 3: Install Frontend Dependencies

Open a new terminal window and navigate to the client directory:

```bash
cd client
npm install
```

## Step 4: Start MongoDB (if using local MongoDB)

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew:
brew services start mongodb-community

# Or if MongoDB is installed differently:
mongod
```

**Note:** If using MongoDB Atlas, you can skip this step.

## Step 5: Start the Backend Server

In the terminal where you installed backend dependencies:

```bash
cd server
npm run dev
```

The server should start on `http://localhost:5000`

## Step 6: Start the Frontend Development Server

In a separate terminal (where you installed frontend dependencies):

```bash
cd client
npm start
```

The React app will automatically open at `http://localhost:3000`

## Verification

1. Backend should show: "Server is running on port 5000" and "Connected to MongoDB"
2. Frontend should open in your browser at `http://localhost:3000`
3. You should see "Home Page - Coming Soon" in the browser

## Next Steps

Now you're ready to start implementing:
1. **Create Community Page** - Start with `client/src/pages/CreateCommunity/CreateCommunity.js`
2. **Create Post Page** - Then work on `client/src/pages/CreatePost/CreatePost.js`

## Troubleshooting

- **Port already in use**: Change the PORT in `server/.env` or kill the process using that port
- **MongoDB connection error**: Make sure MongoDB is running or check your connection string
- **npm install errors**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

