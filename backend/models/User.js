const mongoose = require('mongoose');

// Esquema para los datos del scooter
const ScooterSchema = new mongoose.Schema({
  brand: {
    type: String,
    trim: true,
    maxlength: 50
  },
  model: {
    type: String,
    trim: true,
    maxlength: 100
  },
  year: {
    type: Number,
    min: 2010,
    max: 2030
  },
  motorPower: {
    type: Number,
    min: 100,
    max: 5000,
    required: false
  },
  batteryCapacity: {
    type: Number,
    min: 100,
    max: 10000
  },
  maxSpeed: {
    type: Number,
    min: 10,
    max: 100
  }
}, { _id: false });

// Esquema para configuraciones del usuario
const SettingsSchema = new mongoose.Schema({
  distanceUnit: {
    type: String,
    enum: ['km', 'mi'],
    default: 'km'
  },
  speedUnit: {
    type: String,
    enum: ['kmh', 'mph'],
    default: 'kmh'
  },
  temperatureUnit: {
    type: String,
    enum: ['celsius', 'fahrenheit'],
    default: 'celsius'
  },
  batteryNotifications: {
    type: Boolean,
    default: true
  },
  maintenanceNotifications: {
    type: Boolean,
    default: true
  },
  shareAnonymousData: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  scooter: {
    type: ScooterSchema,
    default: {}
  },
  settings: {
    type: SettingsSchema,
    default: {}
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema); 