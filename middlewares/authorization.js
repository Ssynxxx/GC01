const { Movie } = require('../models');

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') return next({ name: 'Forbidden' });
  next();
};

// Admin: bebas. Staff: hanya boleh mengolah Movie miliknya.
exports.movieOwnerOrAdmin = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) throw { name: 'NotFound', entity: 'Movie' };
    if (req.user.role !== 'Admin' && movie.authorId !== req.user.id) {
      throw { name: 'Forbidden' };
    }
    req.movie = movie;
    next();
  } catch (err) {
    next(err);
  }
};
