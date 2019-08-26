const seeder = require('mongoose-seed');
const path = require('path');
const config = require('config');

const data = [
  {
    model: 'Language',
    documents: [
      {
        name : "Arabic",
        status : "active"
      },
      {
        name : "Urdu",
        status : "active"
      },
      {
        name : "Hindi",
        status : "active"
      },
      {
        name : "Bangla",
        status : "active"
      },
    ],
  },
];

seeder.connect(config.DATABASE_URL, () => {
  seeder.loadModels([
    path.join(__dirname, '../models/LanguageModel'),
  ]);
  seeder.clearModels(['Language'], async () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
