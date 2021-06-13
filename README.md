# photo-grid-app

## Description

Application has implemented using MERN stack with a single page frontend application complete with client-side routing. MongoDb used to saved the data and initial data has provided from the json file provided.

From the application users can view their photo grid and also create a new photo grid using pre uploaded images. 


## Installation

- Clone the repository
- Run below commands

```bash

cd <root folder of the app>

cd api
docker-compose up -d
```

- Navigate to `http://localhost:61`

## Tests

API application covered with unit tests using `Mocha` & `Chai`. To run the tests please used below command.

```bash
 npm run test
```

## Third party libraries and frameworks used

- Semantic UI components & reactstrap used for frontend components (https://semantic-ui.com/, https://reactstrap.github.io/)
- react-beautiful-dnd used for Drag and Drop image view (https://www.npmjs.com/package/react-beautiful-dnd)

