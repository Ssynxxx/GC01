const { Movie, Genre, Sequelize } = require('../models');
const { Op } = Sequelize;
const LIMIT = 10;

module.exports = class PubController {
  // GET /pub/movies?search=&genreId=&sort=ASC|DESC&page=1
  static async listMovies(req, res, next) {
    try {
      const { search } = req.query;
      const genreId = req.query.genreId ?? req.query.filter;
      const sort = String(req.query.sort || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

      const where = {};
      if (search) where.title = { [Op.iLike]: `%${search}%` };
      if (genreId) {
        if (!/^\d+$/.test(String(genreId))) {
          return res.status(200).json({ page, totalData: 0, totalPage: 0, dataPerPage: LIMIT, data: [] });
        }
        where.genreId = Number(genreId);
      }

      const { count, rows } = await Movie.findAndCountAll({
        where,
        include: [{ model: Genre }],
        order: [['createdAt', sort], ['id', sort]],
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      });
      res.status(200).json({
        page,
        totalData: count,
        totalPage: Math.ceil(count / LIMIT),
        dataPerPage: LIMIT,
        data: rows,
      });
    } catch (err) { next(err); }
  }

  static async detailMovie(req, res, next) {
    try {
      const movie = await Movie.findByPk(req.params.id, { include: [{ model: Genre }] });
      if (!movie) throw { name: 'NotFound', entity: 'Movie' };
      res.status(200).json(movie);
    } catch (err) { next(err); }
  }

  static async listGenres(req, res, next) {
    try {
      res.status(200).json(await Genre.findAll({ order: [['id', 'ASC']] }));
    } catch (err) { next(err); }
  }
};
