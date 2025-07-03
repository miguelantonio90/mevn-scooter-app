const express = require('express');
const router = express.Router();
const { 
  getLogs, 
  getLog, 
  createLog, 
  updateLog, 
  deleteLog, 
  getEfficiencyMetrics 
} = require('../controllers/logController');
const { authenticateToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);

// @route   GET /api/logs
// @desc    Get all logs for user
// @access  Private
router.get('/', getLogs);

// @route   GET /api/logs/metrics/efficiency
// @desc    Get efficiency metrics
// @access  Private
router.get('/metrics/efficiency', getEfficiencyMetrics);

// @route   GET /api/logs/:id
// @desc    Get single log
// @access  Private
router.get('/:id', getLog);

// @route   POST /api/logs
// @desc    Create new log
// @access  Private
router.post('/', createLog);

// @route   PUT /api/logs/:id
// @desc    Update log
// @access  Private
router.put('/:id', updateLog);

// @route   DELETE /api/logs/:id
// @desc    Delete log
// @access  Private
router.delete('/:id', deleteLog);

// @route   GET /api/logs/export
// @desc    Export all logs for the authenticated user
// @access  Private
router.get('/export', auth, logController.exportUserLogs);

module.exports = router; 