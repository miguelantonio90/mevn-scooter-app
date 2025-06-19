const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27020/scooter-logs';

const createAdminUser = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe el usuario admin
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  El usuario administrador ya existe');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: admin');
      process.exit(0);
    }

    // Crear usuario administrador
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
    console.log('🆔 ID:', adminUser._id);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al crear usuario administrador:', err);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser; 