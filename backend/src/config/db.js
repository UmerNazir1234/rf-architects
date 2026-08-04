import mongoose from 'mongoose';

const DEFAULT_LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/rf-architects';

export const getMongoUriCandidates = (env = process.env) => {
  const configuredUri = env.MONGO_URI?.trim();
  const candidates = configuredUri ? [configuredUri] : [];
  const isVercelRuntime = Boolean(env.VERCEL || env.VERCEL_ENV || env.VERCEL_URL);
  const shouldUseLocalFallback = !isVercelRuntime && env.NODE_ENV !== 'production';

  if (shouldUseLocalFallback && !candidates.includes(DEFAULT_LOCAL_MONGO_URI)) {
    candidates.push(DEFAULT_LOCAL_MONGO_URI);
  }

  return candidates;
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    console.log(`MongoDB already connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  }

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
