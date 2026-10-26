const { Genre } = require('../models');

module.exports = class GenreController {
  static async create(req, res, next) {
    try {
      const genre = await Genre.create({ name: req.body.name });
      res.status(201).json(genre);
    } catch (err) { next(err); }
  }
  static async list(req, res, next) {
    try {
      res.status(200).json(await Genre.findAll({ order: [['id', 'ASC']] }));
    } catch (err) { next(err); }
  }
  static async update(req, res, next) {
    try {
      const genre = await Genre.findByPk(req.params.id);
      if (!genre) throw { name: 'NotFound', entity: 'Genre' };
      await genre.update({ name: req.body.name ?? null });
      res.status(200).json(genre);
    } catch (err) { next(err); }
  }
  static async destroy(req, res, next) {
    try {
      const genre = await Genre.findByPk(req.params.id);
      if (!genre) throw { name: 'NotFound', entity: 'Genre' };
      await genre.destroy();
      res.status(200).json({ message: 'Genre success to delete' });
    } catch (err) { next(err); }
  }
};
