# GrocerEase
**COMP231 Summer 2025 - Team 5**
<br>GrocerEase is a web application that aggregates deals and inventory data from multiple supermarkets.

## Prerequisites

Before running the application, make sure you have the following installed:

### Required Software:
- **Node.js** (v18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **MongoDB** (v6.0 or higher)
  - Download from [mongodb.com](https://www.mongodb.com/try/download/community)

## Installation & Setup

### 1. Clone the Repository
```powershell
git clone <repository-url>
cd GrocerEase
```

### 2. Install Server Dependencies
```powershell
cd server
npm install
```

### 3. Install Client Dependencies
```powershell
cd ..\client
npm install
```

### 4. Environment Configuration
Create a `.env` file in the `server` directory with the following variables:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/GrocerEase

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# JWT Configuration (for future auth implementation)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Environment
NODE_ENV=development
```

### 5. Start MongoDB
- Start the MongoDB service on your machine

## How to Run the Application

**Run Both Servers Simultaneously**
```powershell
# Terminal 1 - Start the backend server
cd server
npm run dev

# Terminal 2 - Start the frontend client
cd client
npm run dev
```

### Access the Application

Once both servers are running:
- **Frontend**: Open your browser and navigate to `http://localhost:5173`
- **Backend API**: Available at `http://localhost:5000`

## Project Structure

```
GrocerEase/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```


## API Endpoints

The backend provides the following API endpoints:

- **GET** `/` - Welcome message and available endpoints
- **GET** `/api/search` - Search for grocery items
- **GET** `/api/item/:id` - Get specific item details
- **POST** `/api/auth/login` - User authentication
- **POST** `/api/auth/register` - User registration



