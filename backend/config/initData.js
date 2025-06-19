const bcrypt = require('bcryptjs');
const User = require('../models/User');
const createSampleLogs = require('./sampleData');

const initializeDefaultData = async () => {
  try {
    // Verificar si ya existe el usuario admin
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!existingAdmin) {
      // Crear usuario administrador por defecto
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin', salt);
      
      const adminUser = new User({
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        name: 'Administrador',
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: admin');
      
      // Crear datos de ejemplo para el nuevo usuario
      await createSampleLogs();
    } else {
      console.log('ℹ️  Usuario administrador ya existe');
      
      // Verificar si necesita datos de ejemplo
      await createSampleLogs();
    }
    
    // Verificar si hay otros usuarios
    const userCount = await User.countDocuments();
    console.log(`👥 Total de usuarios en el sistema: ${userCount}`);
    
  } catch (err) {
    console.error('❌ Error al inicializar datos por defecto:', err);
  }
};

module.exports = initializeDefaultData; 