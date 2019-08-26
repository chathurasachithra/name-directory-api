const seeder = require('mongoose-seed');
const path = require('path');
const config = require('config');

const data = [
  {
    model: 'Category',
    documents: [
      {
        name : "Muslim Boys Names",
        status : "active"
      },
      {
        name : "Muslim Girls Names",
        status : "active"
      },
      {
        name : "Names of Prophet Mohammad saw",
        status : "active"
      },
      {
        name : "Female Sahabi Names",
        status : "active"
      },
      {
        name : "Male Sahabi Names",
        status : "active"
      },
      {
        name : "Prophets of Islam",
        status : "active"
      }
    ],
  },
];

seeder.connect(config.DATABASE_URL, () => {
  seeder.loadModels([
    path.join(__dirname, '../models/CategoryModel'),
  ]);
  seeder.clearModels(['Category'], async () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
