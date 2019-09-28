const seeder = require('mongoose-seed');
const path = require('path');
const config = require('config');

const data = [
  {
    model: 'Category',
    documents: [
      {
        name : "Muslim Boys Names",
        key : "muslim-boys-names",
        status : "active"
      },
      {
        name : "Muslim Girls Names",
        key : "muslim-girls-names",
        status : "active"
      },
      {
        name : "Names of Prophet Mohammad saw",
        key : "names-of-prophet-mohammad-saw",
        status : "active"
      },
      {
        name : "Female Sahabi Names",
        key : "female-sahabi-names",
        status : "active"
      },
      {
        name : "Male Sahabi Names",
        key : "male-sahabi-names",
        status : "active"
      },
      {
        name : "Prophets of Islam",
        key : "prophets-of-islam",
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
