const { Movie, Genre, User } = require('../models');
const { uploadImage } = require('../helpers/imagekit');

const include = [
  { model: User, attributes: { exclude: ['password'] } },
  { model: Genre },
];

module.exports = class MovieController {
  static async create(req, res, next) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;
      const movie = await Movie.create({
        title, synopsis, trailerUrl, imgUrl, rating, genreId, authorId: req.user.id,
      });
      res.status(201).json(movie);
    } catch (err) { next(err); }
  }

  static async list(req, res, next) {
    try {
      res.status(200).json(await Movie.findAll({ include, order: [['id', 'ASC']] }));
    } catch (err) { next(err); }
  }

  static async detail(req, res, next) {
    try {
      const movie = await Movie.findByPk(req.params.id, { include });
      if (!movie) throw { name: 'NotFound', entity: 'Movie' };
      res.status(200).json(movie);
    } catch (err) { next(err); }
  }

  static async update(req, res, next) {
    try {
      const { title, synopsis, trailerUrl, imgUrl, rating, genreId } = req.body;
      // field wajib yang tidak dikirim -> null agar kena validasi (400)
      const data = { title: title ?? null, synopsis: synopsis ?? null, genreId: genreId ?? null };
      if (trailerUrl !== undefined) data.trailerUrl = trailerUrl;
      if (imgUrl !== undefined) data.imgUrl = imgUrl;
      if (rating !== undefined) data.rating = rating;
      await req.movie.update(data);
      res.status(200).json(req.movie);
    } catch (err) { next(err); }
  }

  static async destroy(req, res, next) {
    try {
      await req.movie.destroy();
      res.status(200).json({ message: 'Movie success to delete' });
    } catch (err) { next(err); }
  }

  static async updateImage(req, res, next) {
    try {
      if (!req.file) throw { name: 'BadRequest', message: 'Image file is required' };
      const url = await uploadImage(req.file);
      await req.movie.update({ imgUrl: url });
      res.status(200).json({ message: 'Image Movie success to update' });
    } catch (err) { next(err); }
  }
};
