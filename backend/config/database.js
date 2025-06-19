const mongoose = require('mongoose');
const initializeDefaultData = require('./initData');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27020/scooter-logs';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    
    // Inicializar datos por defecto después de conectar
    await initializeDefaultData();
    
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 