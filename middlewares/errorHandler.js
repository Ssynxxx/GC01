module.exports = (err, req, res, next) => {
  let status = 500;
  let body = { message: 'Internal Server Error' };

  switch (err.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError': {
      const errors = err.errors.map((e) => e.message);
      status = 400;
      body = { message: errors[0], errors };
      break;
    }
    case 'SequelizeForeignKeyConstraintError':
      status = 400;
      body = { message: err.table === 'Movies' && err.index?.includes('genreId')
        ? 'Genre not found' : 'Data is related to other data or reference not found' };
      break;
    case 'SequelizeDatabaseError':
      if (err.parent?.code === '22P02') { status = 400; body = { message: 'Invalid input' }; }
      break;
    case 'BadRequest':
      status = 400; body = { message: err.message || 'Bad request' }; break;
    case 'MulterError':
      status = 400; body = { message: err.message }; break;
    case 'LoginInvalid':
      status = 401; body = { message: 'Invalid email or password' }; break;
    case 'Unauthenticated':
    case 'JsonWebTokenError':
    case 'TokenExpiredError':
      status = 401; body = { message: 'Invalid token' }; break;
    case 'Forbidden':
      status = 403; body = { message: 'You are not authorized' }; break;
    case 'NotFound':
      status = 404; body = { message: `${err.entity || 'Data'} not found` }; break;
    default:
      if (process.env.NODE_ENV !== 'test') console.log(err);
  }
  res.status(status).json(body);
};
