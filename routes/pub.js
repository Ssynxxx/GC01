const router = require('express').Router();
const PubController = require('../controllers/pubController');
const validateId = require('../middlewares/validateId');

router.param('id', validateId);
router.get('/movies', PubController.listMovies);
router.get('/movies/:id', PubController.detailMovie);
router.get('/genres', PubController.listGenres);

module.exports = router;
