const mongoose = require('mongoose');

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('Missing MONGO_URI env var. Example: mongodb://127.0.0.1:27017/cartify');
  }
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

module.exports = { connectDb };
