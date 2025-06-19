# 🛴 Scooter Battery Tracking App

A full-stack MEVN (MongoDB, Express.js, Vue.js, Node.js) application for tracking scooter battery charge logs and monitoring battery status.

## 📋 Features

### 🔋 Battery Management
- **Real-time Battery Status**: Visual progress bar showing current battery percentage
- **Voltage Tracking**: Monitor battery voltage levels (60V-84V range)
- **Smart Battery Calculation**: Automatic percentage calculation based on voltage range
- **Color-coded Status**: Visual indicators (green/yellow/red) based on battery level

### 📊 Data Visualization
- **Interactive Charts**: Line charts for voltage and distance tracking
- **Historical Data**: View trends over time with Chart.js integration
- **Responsive Design**: Charts adapt to different screen sizes

### 📝 Log Management
- **CRUD Operations**: Create, Read, Update, Delete battery logs
- **Date Tracking**: Record logs with specific dates
- **Distance Monitoring**: Track kilometers travelled
- **Notes System**: Add optional notes to each log entry
- **Form Validation**: Input validation for voltage and distance fields

### 🎨 User Interface
- **Modern UI**: Clean, responsive design with Bootstrap 4
- **Intuitive Forms**: Easy-to-use input forms with proper validation
- **Real-time Updates**: Instant UI updates when data changes
- **Mobile-Friendly**: Responsive design works on all devices

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Full CRUD operations for battery logs
- **MongoDB Integration**: Mongoose ODM for data persistence
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and validation

### Frontend (Vue.js 3 + Vite)
- **Vue 3 Composition API**: Modern reactive framework
- **Vite Build Tool**: Fast development and build process
- **Chart.js Integration**: Professional data visualization
- **Bootstrap Styling**: Responsive UI components

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
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
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE=http://localhost:3000/api
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

## 📚 API Endpoints

### Battery Logs
- `GET /api/logs` - Retrieve all logs (sorted by date descending)
- `POST /api/logs` - Create a new battery log
- `PUT /api/logs/:id` - Update an existing log
- `DELETE /api/logs/:id` - Delete a log

### Data Schema
```javascript
{
  date: Date,           // Required: Date of the log entry
  voltage: Number,      // Required: Battery voltage (60V-84V)
  kmTravelled: Number,  // Required: Distance travelled in kilometers
  notes: String         // Optional: Additional notes
}
```

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (if configured)

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build

### Project Structure
```
mevn_scooter_app/
├── backend/
│   ├── package.json
│   ├── server.js          # Express server with API endpoints
│   └── package-lock.json
├── frontend/
│   ├── package.json
│   ├── vite.config.js     # Vite configuration
│   ├── index.html         # Entry HTML file
│   └── src/
│       ├── main.js        # Vue app entry point
│       └── App.vue        # Main Vue component
└── README.md
```

## 🔧 Configuration

### MongoDB Connection
The app connects to MongoDB on port 27020 by default. You can change this by setting the `MONGO_URI` environment variable.

### API Base URL
The frontend connects to the backend API. Configure the base URL using the `VITE_API_BASE` environment variable.

### Battery Voltage Range
The battery percentage calculation assumes a voltage range of 60V-84V. This can be modified in the `batteryPercent` computed property in `App.vue`.

## 🎯 Usage

1. **Add a Battery Log**
   - Fill in the date, voltage, and kilometers travelled
   - Add optional notes
   - Click "Add Log"

2. **Monitor Battery Status**
   - View the battery percentage bar at the top
   - Check the current voltage reading
   - Monitor color-coded status indicators

3. **Analyze Trends**
   - View voltage trends over time
   - Track distance travelled patterns
   - Use interactive charts for detailed analysis

4. **Manage Logs**
   - Edit existing logs by clicking "Edit"
   - Delete logs with confirmation
   - View all historical data in chronological order

## 🚀 Deployment

### Backend Deployment
1. Set up a MongoDB instance (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure the API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
- Check the existing issues
- Create a new issue with detailed information
- Include error messages and steps to reproduce

---

**Built with ❤️ using MEVN stack**
