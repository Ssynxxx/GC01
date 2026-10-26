const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {}
  const required = (label) => ({
    notNull: { msg: `${label} is required` },
    notEmpty: { msg: `${label} is required` },
  });
  Movie.init(
    {
      title: { type: DataTypes.STRING, allowNull: false, validate: required('Title') },
      synopsis: { type: DataTypes.TEXT, allowNull: false, validate: required('Synopsis') },
      trailerUrl: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      rating: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: { msg: 'Rating must be an integer' },
          min: { args: [1], msg: 'Minimum rating is 1' },
        },
      },
      genreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'Genre is required' } },
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notNull: { msg: 'Author is required' } },
      },
    },
    { sequelize, modelName: 'Movie' }
  );
  return Movie;
};
