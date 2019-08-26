const seeder = require('mongoose-seed');
const path = require('path');
const config = require('config');

const data = [
  {
    model: 'Name',
    documents: [
      {
        name : "Jabba",
        meaning : "Promise and Covenant",
        gender : "male",
        views : "254255",
        similar_names : "Jubba, Banda",
        status : "active",
        languages : [
          {
            language_id : "5d5910006e12b400292ebbb9",
            word : "واد"
          }
        ]
      }
    ],
  },
];

seeder.connect(config.DATABASE_URL, () => {
  seeder.loadModels([
    path.join(__dirname, '../models/NameModel'),
  ]);
  seeder.clearModels(['Name'], async () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
