import mongoose from 'mongoose';

const DEFAULT_LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/rf-architects';

export const getMongoUriCandidates = (env = process.env) => {
  const configuredUri = env.MONGO_URI?.trim();
  const candidates = configuredUri ? [configuredUri] : [];

  if (!candidates.includes(DEFAULT_LOCAL_MONGO_URI)) {
    candidates.push(DEFAULT_LOCAL_MONGO_URI);
  }

  return candidates;
};

export const connectDB = async () => {
  const candidates = getMongoUriCandidates();
  let lastError = null;

  for (const uri of candidates) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastError = error;
      console.warn(`MongoDB connection attempt failed for ${uri}: ${error.message}`);
    }
  }

  console.error(`Error connecting to MongoDB. Tried: ${candidates.join(', ')}`);
  console.error(lastError?.message || 'Unknown MongoDB error');
  process.exit(1);
};
