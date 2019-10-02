const seeder = require('mongoose-seed');
const path = require('path');
const config = require('config');
const bcrypt = require('bcrypt');

seeder.connect(config.DATABASE_URL, () => {
  seeder.loadModels([
    path.join(__dirname, '../models/UserModel'),
  ]);
  seeder.clearModels(['User'], async () => {
    const data = [
      {
        model: 'User',
        documents: [
          {
            status: 'active',
            avatar: '',
            type: 'super_admin',
            firstName: 'Chathura',
            lastName: 'Fernando',
            email: 'superadmin@gmail.com',
            password: await bcrypt.hash('superadmin123', 2),
            passwordResetRequestTime: null,
            passwordResetToken: null,
          },
          {
            status: 'active',
            avatar: '',
            type: 'super_admin',
            firstName: 'Amith',
            lastName: 'Ranasinghe',
            email: 'amith-ranasinghe@gmail.com',
            password: await bcrypt.hash('amithadmin123', 2),
            passwordResetRequestTime: null,
            passwordResetToken: null,
          },
        ],
      },
    ];
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
