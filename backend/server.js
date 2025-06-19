const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27020/scooter-logs';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Modelo de Usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Modelo de Log (actualizado para incluir userId)
const LogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  voltage: { type: Number, required: true },
  kmTravelled: { type: Number, required: true },
  notes: String,
  // Nuevos campos para eficiencia
  voltageStart: { type: Number, required: true },
  voltageEnd: { type: Number, required: true },
  whConsumed: { type: Number },
  efficiency: { type: Number },
  batteryCapacity: { type: Number, default: 1000 },
  weather: { type: String, enum: ['sunny', 'cloudy', 'rainy', 'windy'] },
  terrain: { type: String, enum: ['flat', 'hilly', 'mixed'] },
  riderWeight: { type: Number },
  speed: { type: Number }
});

const Log = mongoose.model('Log', LogSchema);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Rutas de autenticación
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Usuario o email ya existe' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generar token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para verificar token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ 
    message: 'Token válido',
    user: req.user 
  });
});

// Endpoint para obtener logs (protegido)
app.get('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para métricas de eficiencia (protegido)
app.get('/api/efficiency-metrics', authenticateToken, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.userId }).sort({ date: -1 });
    
    if (logs.length === 0) {
      return res.json({
        totalTrips: 0,
        totalDistance: 0,
        averageEfficiency: 0,
        bestEfficiency: 0,
        worstEfficiency: 0,
        averageDistance: 0,
        batteryHealth: 0,
        totalWhConsumed: 0,
        averageWhPerKm: 0,
        estimatedRange: 0
      });
    }

    // Calcular métricas
    const totalTrips = logs.length;
    const totalDistance = logs.reduce((sum, log) => sum + log.kmTravelled, 0);
    const totalWhConsumed = logs.reduce((sum, log) => sum + (log.whConsumed || 0), 0);
    
    // Eficiencia promedio (Wh/km)
    const averageWhPerKm = totalDistance > 0 ? totalWhConsumed / totalDistance : 0;
    
    // Eficiencias individuales
    const efficiencies = logs
      .filter(log => log.whConsumed && log.kmTravelled > 0)
      .map(log => log.whConsumed / log.kmTravelled);
    
    const averageEfficiency = efficiencies.length > 0 
      ? efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length 
      : 0;
    
    const bestEfficiency = efficiencies.length > 0 ? Math.min(...efficiencies) : 0;
    const worstEfficiency = efficiencies.length > 0 ? Math.max(...efficiencies) : 0;
    
    // Distancia promedio por viaje
    const averageDistance = totalDistance / totalTrips;
    
    // Salud de la batería
    const recentLogs = logs.slice(0, 10);
    const maxVoltageRecent = Math.max(...recentLogs.map(log => log.voltageStart));
    const maxVoltageHistorical = Math.max(...logs.map(log => log.voltageStart));
    const batteryHealth = maxVoltageHistorical > 0 
      ? (maxVoltageRecent / maxVoltageHistorical) * 100 
      : 100;
    
    // Rango estimado
    const batteryCapacity = logs[0].batteryCapacity || 1000;
    const estimatedRange = averageWhPerKm > 0 ? batteryCapacity / averageWhPerKm : 0;

    res.json({
      totalTrips,
      totalDistance: Math.round(totalDistance * 100) / 100,
      averageEfficiency: Math.round(averageEfficiency * 100) / 100,
      bestEfficiency: Math.round(bestEfficiency * 100) / 100,
      worstEfficiency: Math.round(worstEfficiency * 100) / 100,
      averageDistance: Math.round(averageDistance * 100) / 100,
      batteryHealth: Math.round(batteryHealth * 100) / 100,
      totalWhConsumed: Math.round(totalWhConsumed * 100) / 100,
      averageWhPerKm: Math.round(averageWhPerKm * 100) / 100,
      estimatedRange: Math.round(estimatedRange * 100) / 100
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para crear log (protegido)
app.post('/api/logs', authenticateToken, async (req, res) => {
  try {
    const logData = { 
      ...req.body, 
      userId: req.user.userId 
    };
    
    // Calcular Wh consumidos si tenemos voltaje inicial y final
    if (logData.voltageStart && logData.voltageEnd && logData.batteryCapacity) {
      const voltageDrop = logData.voltageStart - logData.voltageEnd;
      const voltageRatio = voltageDrop / logData.voltageStart;
      logData.whConsumed = voltageRatio * logData.batteryCapacity;
      
      // Calcular eficiencia (Wh/km)
      if (logData.kmTravelled > 0) {
        logData.efficiency = logData.whConsumed / logData.kmTravelled;
      }
    }
    
    const log = new Log(logData);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint para actualizar log (protegido)
app.put('/api/logs/:id', authenticateToken, async (req, res) => {
  try {
    const log = await Log.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint para eliminar log (protegido)
app.delete('/api/logs/:id', authenticateToken, async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!log) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
