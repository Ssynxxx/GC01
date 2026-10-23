const ImageKit = require('imagekit');
let client;
const getClient = () => {
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return client;
};
// mengembalikan URL gambar hasil upload
exports.uploadImage = async (file) => {
  const result = await getClient().upload({
    file: file.buffer.toString('base64'),
    fileName: file.originalname,
    folder: '/movies',
  });
  return result.url;
};
