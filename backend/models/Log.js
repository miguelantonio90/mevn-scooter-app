const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  voltageStart: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  voltageEnd: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  kmTravelled: { 
    type: Number, 
    required: true,
    min: 0,
    max: 1000
  },
  batteryCapacity: { 
    type: Number, 
    default: 1000,
    min: 100,
    max: 10000
  },
  whConsumed: { 
    type: Number,
    min: 0
  },
  efficiency: { 
    type: Number,
    min: 0
  },
  weather: { 
    type: String, 
    enum: ['sunny', 'cloudy', 'rainy', 'windy'],
    default: 'sunny'
  },
  terrain: { 
    type: String, 
    enum: ['flat', 'hilly', 'mixed'],
    default: 'flat'
  },
  riderWeight: { 
    type: Number,
    min: 30,
    max: 200
  },
  speed: { 
    type: Number,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
LogSchema.index({ userId: 1, date: -1 });
LogSchema.index({ date: -1 });
LogSchema.index({ userId: 1, createdAt: -1 });

// Middleware pre-save para calcular eficiencia
LogSchema.pre('save', function(next) {
  if (this.voltageStart && this.voltageEnd && this.batteryCapacity && this.kmTravelled > 0) {
    // Calcular Wh consumidos
    const voltageDrop = this.voltageStart - this.voltageEnd;
    const voltageRatio = voltageDrop / this.voltageStart;
    this.whConsumed = voltageRatio * this.batteryCapacity;
    
    // Calcular eficiencia (Wh/km)
    this.efficiency = this.whConsumed / this.kmTravelled;
  }
  next();
});

module.exports = mongoose.model('Log', LogSchema); 