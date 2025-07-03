const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Validar campos requeridos
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Usuario o email ya existe' 
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name
    });

    await user.save();

    // Generar token
    const token = generateToken(user._id, user.username);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciales inválidas' 
      });
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token
    const token = generateToken(user._id, user.username);

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token válido',
      user: req.user
    });
  } catch (err) {
    console.error('Verify token error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        scooter: user.scooter,
        settings: user.settings,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    // Validar campos requeridos
    if (!name || !username || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, usuario y email son requeridos'
      });
    }

    // Verificar si el username o email ya existe en otro usuario
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.user.id } },
        { $or: [{ email }, { username }] }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Usuario o email ya existe' 
      });
    }

    // Actualizar usuario
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, username, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        scooter: user.scooter,
        settings: user.settings,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Update scooter data
// @route   PUT /api/auth/scooter
// @access  Private
const updateScooter = async (req, res) => {
  try {
    const { brand, model, year, motorPower, batteryCapacity, maxSpeed } = req.body;

    // Validar campos requeridos (motorPower es opcional)
    if (!brand || !model || !year || !batteryCapacity || !maxSpeed) {
      return res.status(400).json({
        success: false,
        error: 'Marca, modelo, año, capacidad de batería y velocidad máxima son campos requeridos. La potencia del motor es opcional.'
      });
    }

    // Validar rangos
    if (year < 2010 || year > 2030) {
      return res.status(400).json({
        success: false,
        error: 'El año debe estar entre 2010 y 2030'
      });
    }

    if (motorPower && (motorPower < 100 || motorPower > 5000)) {
      return res.status(400).json({
        success: false,
        error: 'La potencia del motor debe estar entre 100W y 5000W'
      });
    }

    if (batteryCapacity < 100 || batteryCapacity > 10000) {
      return res.status(400).json({
        success: false,
        error: 'La capacidad de batería debe estar entre 100Wh y 10000Wh'
      });
    }

    if (maxSpeed < 10 || maxSpeed > 100) {
      return res.status(400).json({
        success: false,
        error: 'La velocidad máxima debe estar entre 10km/h y 100km/h'
      });
    }

    // Preparar datos del scooter (motorPower es opcional)
    const scooterData = { brand, model, year, batteryCapacity, maxSpeed };
    if (motorPower) {
      scooterData.motorPower = motorPower;
    }

    // Actualizar datos del scooter
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { scooter: scooterData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Datos del scooter actualizados exitosamente',
      scooter: user.scooter
    });
  } catch (err) {
    console.error('Update scooter error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    const { 
      distanceUnit, 
      speedUnit, 
      temperatureUnit, 
      batteryNotifications, 
      maintenanceNotifications, 
      shareAnonymousData,
      efficiencyGoal // Nuevo campo
    } = req.body;

    // Validar unidades
    const validDistanceUnits = ['km', 'mi'];
    const validSpeedUnits = ['kmh', 'mph'];
    const validTemperatureUnits = ['celsius', 'fahrenheit'];

    if (distanceUnit && !validDistanceUnits.includes(distanceUnit)) {
      return res.status(400).json({
        success: false,
        error: 'Unidad de distancia inválida'
      });
    }

    if (speedUnit && !validSpeedUnits.includes(speedUnit)) {
      return res.status(400).json({
        success: false,
        error: 'Unidad de velocidad inválida'
      });
    }

    if (temperatureUnit && !validTemperatureUnits.includes(temperatureUnit)) {
      return res.status(400).json({
        success: false,
        error: 'Unidad de temperatura inválida'
      });
    }

    // Preparar objeto de configuraciones para actualizar usando $set
    const updateFields = {};
    if (distanceUnit !== undefined) updateFields['settings.distanceUnit'] = distanceUnit;
    if (speedUnit !== undefined) updateFields['settings.speedUnit'] = speedUnit;
    if (temperatureUnit !== undefined) updateFields['settings.temperatureUnit'] = temperatureUnit;
    if (batteryNotifications !== undefined) updateFields['settings.batteryNotifications'] = batteryNotifications;
    if (maintenanceNotifications !== undefined) updateFields['settings.maintenanceNotifications'] = maintenanceNotifications;
    if (shareAnonymousData !== undefined) updateFields['settings.shareAnonymousData'] = shareAnonymousData;
    if (efficiencyGoal !== undefined) {
      if (efficiencyGoal === null || efficiencyGoal === '') { // Permitir borrar la meta
        updateFields['settings.efficiencyGoal'] = null;
      } else {
        const goal = Number(efficiencyGoal);
        if (isNaN(goal) || goal < 1 || goal > 1000) {
          return res.status(400).json({
            success: false,
            error: 'La meta de eficiencia debe ser un número entre 1 y 1000, o estar vacía.'
          });
        }
        updateFields['settings.efficiencyGoal'] = goal;
      }
    }

    // Si no hay campos para actualizar, devolver éxito temprano.
    if (Object.keys(updateFields).length === 0) {
      const currentUser = await User.findById(req.user.id).select('-password');
      return res.json({
        success: true,
        message: 'No se especificaron configuraciones para actualizar.',
        settings: currentUser.settings
      });
    }

    // Actualizar configuraciones
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Configuraciones actualizadas exitosamente',
      settings: user.settings
    });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  getProfile,
  updateProfile,
  updateScooter,
  updateSettings
}; 