const express = require('express');
const Authorization = require('../middlewares/Authorization');

const router = express.Router();

const NameController = require('../controllers/v1/NameController');
const UserController = require('../controllers/v1/UserController');

// Home page
router.get('/', async (req, res) => {
  res.render('index', { title: 'Express' });
});


router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.get('/user/profile/:id', Authorization, UserController.getProfile);

router.post('/directory-name', Authorization, NameController.create);
router.post('/directory-name/get', Authorization, NameController.getList);
router.put('/directory-name/:id', Authorization, NameController.update);
router.get('/directory-name/:id', Authorization, NameController.getById);
router.delete('/directory-name/:id', Authorization, NameController.remove);

router.post('/directory-name/get-all', NameController.getAll);
router.get('/directory-name/increase-view/:name', NameController.updateViews);

router.get('/static', Authorization, NameController.getStaticData);

module.exports = router;
