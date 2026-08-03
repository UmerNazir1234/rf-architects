import './config/env.js';
import app from './app.js';
import { connectDB } from './config/db.js';
import User from './models/User.js';

const PORT = process.env.PORT === '5000' ? 5005 : (process.env.PORT || 5005);

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully');

    // Seed Super Admin if necessary
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminName = process.env.SUPER_ADMIN_NAME || 'Super Admin';

    if (superAdminEmail && superAdminPassword) {
      let superAdmin = await User.findOne({ email: superAdminEmail });
      if (!superAdmin) {
        await User.create({
          name: superAdminName,
          email: superAdminEmail,
          passwordHash: superAdminPassword,
          role: 'superadmin',
          isActive: true,
        });
        console.log(`Super Admin account seeded with email: ${superAdminEmail}`);
      } else {
        // Optionally update the role just in case it got changed
        if (superAdmin.role !== 'superadmin') {
          superAdmin.role = 'superadmin';
          await superAdmin.save();
        }
      }
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
