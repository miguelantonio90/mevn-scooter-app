const Log = require('../models/Log');
const User = require('../models/User');

const createSampleLogs = async () => {
  try {
    // Buscar el usuario administrador
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!adminUser) {
      console.log('⚠️  Usuario administrador no encontrado, creando logs de ejemplo...');
      return;
    }
    
    // Verificar si ya existen logs para este usuario
    const existingLogs = await Log.countDocuments({ userId: adminUser._id });
    
    if (existingLogs > 0) {
      console.log(`ℹ️  Ya existen ${existingLogs} logs para el usuario administrador`);
      return;
    }
    
    // Crear logs de ejemplo
    const sampleLogs = [
      {
        userId: adminUser._id,
        date: new Date('2024-01-15'),
        voltageStart: 84.2,
        voltageEnd: 76.8,
        kmTravelled: 12.5,
        batteryCapacity: 1000,
        weather: 'sunny',
        terrain: 'flat',
        riderWeight: 75,
        speed: 25,
        notes: 'Primer viaje de prueba - excelente rendimiento'
      },
      {
        userId: adminUser._id,
        date: new Date('2024-01-16'),
        voltageStart: 84.0,
        voltageEnd: 72.5,
        kmTravelled: 18.2,
        batteryCapacity: 1000,
        weather: 'cloudy',
        terrain: 'hilly',
        riderWeight: 75,
        speed: 22,
        notes: 'Viaje por zona montañosa - mayor consumo'
      },
      {
        userId: adminUser._id,
        date: new Date('2024-01-17'),
        voltageStart: 84.1,
        voltageEnd: 78.3,
        kmTravelled: 10.8,
        batteryCapacity: 1000,
        weather: 'rainy',
        terrain: 'mixed',
        riderWeight: 75,
        speed: 20,
        notes: 'Lluvia ligera - terreno mixto'
      },
      {
        userId: adminUser._id,
        date: new Date('2024-01-18'),
        voltageStart: 84.3,
        voltageEnd: 74.1,
        kmTravelled: 15.7,
        batteryCapacity: 1000,
        weather: 'sunny',
        terrain: 'flat',
        riderWeight: 75,
        speed: 28,
        notes: 'Día soleado - velocidad constante'
      },
      {
        userId: adminUser._id,
        date: new Date('2024-01-19'),
        voltageStart: 84.0,
        voltageEnd: 71.2,
        kmTravelled: 20.1,
        batteryCapacity: 1000,
        weather: 'windy',
        terrain: 'hilly',
        riderWeight: 75,
        speed: 18,
        notes: 'Viento fuerte - terreno montañoso'
      }
    ];
    
    await Log.insertMany(sampleLogs);
    console.log('✅ Datos de ejemplo creados exitosamente');
    console.log(`📊 Se crearon ${sampleLogs.length} logs de ejemplo`);
    
  } catch (err) {
    console.error('❌ Error al crear datos de ejemplo:', err);
  }
};

module.exports = createSampleLogs; 