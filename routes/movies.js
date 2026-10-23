const router = require('express').Router();
const MovieController = require('../controllers/movieController');
const { movieOwnerOrAdmin } = require('../middlewares/authorization');
const validateId = require('../middlewares/validateId');
const upload = require('../middlewares/upload');

router.param('id', validateId);
router.post('/', MovieController.create);
router.get('/', MovieController.list);
router.get('/:id', MovieController.detail);
router.put('/:id', movieOwnerOrAdmin, MovieController.update);
router.delete('/:id', movieOwnerOrAdmin, MovieController.destroy);
router.patch('/:id/imgUrl', movieOwnerOrAdmin, upload.single('imgUrl'), MovieController.updateImage);

module.exports = router;
