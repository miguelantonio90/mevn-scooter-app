# 🛴 Scooter Battery Tracking App

A full-stack MEVN (MongoDB, Express.js, Vue.js, Node.js) application for tracking scooter battery charge logs and monitoring battery status with user authentication and advanced analytics.

## 📋 Features

### 🔐 Authentication & User Management
- **JWT Authentication**: Secure token-based authentication
- **User Registration**: Create new user accounts with validation
- **User Login**: Secure login with email and password
- **User Profiles**: Manage personal information and scooter settings
- **Session Management**: Automatic token validation and logout

### 🔋 Battery Management
- **Real-time Battery Status**: Visual progress bar showing current battery percentage
- **Voltage Tracking**: Monitor battery voltage levels (60V-84V range)
- **Smart Battery Calculation**: Automatic percentage calculation based on voltage range
- **Color-coded Status**: Visual indicators (green/yellow/red) based on battery level
- **Efficiency Metrics**: Calculate and display battery efficiency over time

### 📊 Advanced Analytics & Dashboard
- **Interactive Charts**: Line charts for voltage and distance tracking using Chart.js
- **Efficiency Metrics**: Battery efficiency calculations and trends
- **Historical Data**: View trends over time with comprehensive analytics
- **Performance Indicators**: Average efficiency, total distance, and usage statistics
- **Responsive Charts**: Charts adapt to different screen sizes

### 📝 Log Management
- **CRUD Operations**: Create, Read, Update, Delete battery logs
- **Date Tracking**: Record logs with specific dates
- **Distance Monitoring**: Track kilometers travelled
- **Notes System**: Add optional notes to each log entry
- **Form Validation**: Input validation for voltage and distance fields
- **Auto-calculation**: Battery capacity automatically retrieved from user profile

### 🎨 Modern User Interface
- **Tailwind CSS**: Modern, responsive design system
- **Sidebar Navigation**: Always-open sidebar on desktop, collapsible on mobile
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark/Light Theme**: Clean, modern interface with proper contrast
- **Loading States**: Smooth loading indicators and error handling

### 🏗️ Backend Architecture
- **Modular Structure**: Organized into models, controllers, routes, and middleware
- **JWT Middleware**: Secure authentication for protected routes
- **Data Validation**: Comprehensive input validation and error handling
- **Default Admin User**: Automatic creation of admin user on first run
- **Sample Data**: Initial data population for testing

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
```
backend/
├── config/
│   ├── database.js      # MongoDB connection and initialization
│   ├── initData.js      # Default admin user and sample data
│   └── sampleData.js    # Sample log data
├── controllers/
│   ├── authController.js # Authentication logic
│   └── logController.js  # Log CRUD operations
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── Log.js           # Log data model
│   └── User.js          # User data model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── logs.js          # Log management routes
└── server.js            # Express server setup
```

### Frontend (Vue.js 3 + Vite + Tailwind CSS)
```
frontend/src/
├── components/
│   ├── Dashboard.vue    # Main dashboard with charts and metrics
│   ├── LogForm.vue      # Battery log creation/editing form
│   ├── LogHistory.vue   # Historical log display
│   ├── Login.vue        # User login component
│   ├── Register.vue     # User registration component
│   ├── Profile.vue      # User profile management
│   ├── Settings.vue     # Application settings
│   └── Sidebar.vue      # Navigation sidebar
├── App.vue              # Main application component
└── main.js              # Vue app entry point
```

## 🚀 Quick Start

### Prerequisites
- **Node.js v20.19.0 or higher** (see `.nvmrc` file)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mevn_scooter_app
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27020/scooter-logs
   JWT_SECRET=your-secret-key-here
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod --port 27020
   ```

6. **Run the application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Default Admin User
The application automatically creates a default admin user on first run:
- **Email**: admin@scooter.com
- **Password**: admin123

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Battery Logs
- `GET /api/logs` - Retrieve all logs for authenticated user
- `POST /api/logs` - Create a new battery log
- `PUT /api/logs/:id` - Update an existing log
- `DELETE /api/logs/:id` - Delete a log
- `GET /api/logs/efficiency` - Get efficiency metrics

### User Management
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/settings` - Update user settings

### Data Schemas

**User Schema:**
```javascript
{
  name: String,           // Required: User's full name
  email: String,          // Required: Unique email address
  password: String,       // Required: Hashed password
  motorPower: Number,     // Optional: Motor power in watts
  batteryCapacity: Number // Optional: Battery capacity in Ah
}
```

**Log Schema:**
```javascript
{
  userId: ObjectId,       // Required: Reference to user
  date: Date,             // Required: Date of the log entry
  voltage: Number,        // Required: Battery voltage (60V-84V)
  kmTravelled: Number,    // Required: Distance travelled in kilometers
  notes: String,          // Optional: Additional notes
  efficiency: Number      // Calculated: Battery efficiency percentage
}
```

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `node scripts/createAdmin.js` - Manually create admin user

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Features

#### 🔐 Authentication System
- JWT token-based authentication
- Automatic token validation
- Protected routes with middleware
- User session management

#### 📊 Dashboard Analytics
- Real-time battery efficiency metrics
- Interactive charts for voltage and distance trends
- Performance indicators and statistics
- Responsive chart components

#### 🎨 Modern UI/UX
- Tailwind CSS for modern styling
- Responsive sidebar navigation
- Always-open sidebar on desktop
- Collapsible sidebar on mobile/tablet
- Loading states and error handling

#### 🔋 Smart Battery Management
- Automatic battery percentage calculation
- Efficiency metrics calculation
- Color-coded status indicators
- Historical trend analysis

## 🎯 Usage Guide

### 1. **User Registration & Login**
   - Register with email and password
   - Login to access the dashboard
   - Update profile with scooter specifications

### 2. **Dashboard Overview**
   - View current battery status and efficiency
   - Analyze historical trends with interactive charts
   - Monitor performance metrics

### 3. **Add Battery Logs**
   - Fill in voltage and distance data
   - Add optional notes
   - Automatic efficiency calculation
   - Battery capacity from user profile

### 4. **Manage Data**
   - View all logs in chronological order
   - Edit or delete existing logs
   - Export data for analysis

### 5. **Profile Management**
   - Update personal information
   - Configure scooter specifications
   - Manage account settings

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB instance (MongoDB Atlas recommended)
2. Configure environment variables (JWT_SECRET, MONGO_URI)
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure the API base URL for production

### Environment Variables
```env
# Backend
PORT=3000
MONGO_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-secure-jwt-secret

# Frontend
VITE_API_BASE=http://your-backend-url/api
```

## 🔧 Configuration

### Node.js Version
The project requires Node.js v20.19.0 or higher. Use the `.nvmrc` file:
```bash
nvm use
```

### MongoDB Connection
Configure MongoDB connection in the backend `.env` file. The app supports both local and cloud MongoDB instances.

### JWT Configuration
Set a secure JWT secret in the backend environment variables for production use.

## 📱 Responsive Design

The application is fully responsive with different behaviors:
- **Desktop (≥1024px)**: Sidebar always open, full navigation
- **Tablet/Mobile (<1024px)**: Collapsible sidebar, mobile-optimized interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the existing issues
- Create a new issue with detailed information
- Include error messages and steps to reproduce

---

**Built with ❤️ using MEVN stack**
