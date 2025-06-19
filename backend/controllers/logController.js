const Log = require('../models/Log');

// @desc    Get all logs for user
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('userId', 'name username');

    res.json({
      success: true,
      count: logs.length,
      logs: logs
    });
  } catch (err) {
    console.error('Get logs error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Get single log
// @route   GET /api/logs/:id
// @access  Private
const getLog = async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'name username');

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log no encontrado'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (err) {
    console.error('Get log error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Create new log
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res) => {
  try {
    const logData = { 
      ...req.body, 
      userId: req.user._id 
    };
    
    const log = new Log(logData);
    await log.save();

    res.status(201).json({
      success: true,
      message: 'Log creado exitosamente',
      data: log
    });
  } catch (err) {
    console.error('Create log error:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Update log
// @route   PUT /api/logs/:id
// @access  Private
const updateLog = async (req, res) => {
  try {
    const log = await Log.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Log actualizado exitosamente',
      data: log
    });
  } catch (err) {
    console.error('Update log error:', err);
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Delete log
// @route   DELETE /api/logs/:id
// @access  Private
const deleteLog = async (req, res) => {
  try {
    const log = await Log.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Log no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Log eliminado exitosamente'
    });
  } catch (err) {
    console.error('Delete log error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// @desc    Get efficiency metrics
// @route   GET /api/efficiency-metrics
// @access  Private
const getEfficiencyMetrics = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user._id }).sort({ date: -1 });
    
    if (logs.length === 0) {
      return res.json({
        success: true,
        data: {
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
        }
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
      success: true,
      data: {
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
      }
    });
  } catch (err) {
    console.error('Get efficiency metrics error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  getLogs,
  getLog,
  createLog,
  updateLog,
  deleteLog,
  getEfficiencyMetrics
}; 