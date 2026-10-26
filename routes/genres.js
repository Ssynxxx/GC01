const router = require('express').Router();
const GenreController = require('../controllers/genreController');
const validateId = require('../middlewares/validateId');

router.param('id', validateId);
router.post('/', GenreController.create);
router.get('/', GenreController.list);
router.put('/:id', GenreController.update);
router.delete('/:id', GenreController.destroy);

module.exports = router;
