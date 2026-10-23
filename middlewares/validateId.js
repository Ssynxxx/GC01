// id non-numerik dianggap data tidak ditemukan (404)
module.exports = (req, res, next, value) => {
  if (!/^\d+$/.test(value) || Number(value) > 2147483647) return next({ name: 'NotFound' });
  next();
};
