const router = require('express').Router();
const UserController = require('../controllers/userController');
const authentication = require('../middlewares/authentication');
const { adminOnly } = require('../middlewares/authorization');

router.get('/', (req, res) => res.status(200).json({ message: 'loginfirst' }));
router.post('/login', UserController.login);
router.use('/pub', require('./pub'));

router.use(authentication);
router.post('/add-user', adminOnly, UserController.addUser);
router.use('/movies', require('./movies'));
router.use('/genres', require('./genres'));

module.exports = router;
