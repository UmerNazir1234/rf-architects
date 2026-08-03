/* Migration script: resolve collection slugs/names to ObjectId on Product documents

Usage:
  NODE_ENV=development node backend/scripts/migrateCollections.js

Make sure your backend is stopped and environment variables (DB URI) are available.
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../src/models/Product.js';
import Collection from '../src/models/Collection.js';

dotenv.config({ path: '.env' });

async function connect() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL || process.env.DATABASE_URL;
  if (!uri) {
    console.error('No MongoDB URI found in environment (MONGO_URI / MONGO_URL / DATABASE_URL)');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}

async function resolveCollectionId(ref) {
  if (!ref) return null;
  if (mongoose.Types.ObjectId.isValid(ref)) {
    const c = await Collection.findById(ref);
    return c ? c._id : null;
  }
  const c = await Collection.findOne({ $or: [{ slug: ref }, { name: { $regex: new RegExp(`^${ref}$`, 'i') } }] });
  return c ? c._id : null;
}

async function migrate() {
  await connect();
  console.log('Connected to DB');

  const cursor = Product.find({}).cursor();
  let updated = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    let changed = false;

    // Resolve singular collection
    if (doc.collection && !mongoose.Types.ObjectId.isValid(doc.collection)) {
      const resolved = await resolveCollectionId(doc.collection);
      if (resolved) {
        doc.collection = resolved;
        changed = true;
      }
    }

    // Resolve collections array entries
    if (Array.isArray(doc.collections) && doc.collections.length > 0) {
      const resolvedArr = [];
      for (const item of doc.collections) {
        if (!item) continue;
        if (mongoose.Types.ObjectId.isValid(item)) {
          resolvedArr.push(item);
        } else {
          const r = await resolveCollectionId(item);
          if (r) resolvedArr.push(r);
        }
      }

      const uniq = [...new Set(resolvedArr.map((x) => x.toString()))];
      if (uniq.length > 0 && uniq.join(',') !== doc.collections.map((c) => c.toString()).join(',')) {
        doc.collections = uniq;
        doc.collection = uniq[0] || doc.collection;
        changed = true;
      }
    }

    if (changed) {
      await doc.save();
      updated++;
      console.log('Updated product', doc._id.toString());
    }
  }

  console.log('Migration complete. Updated', updated, 'products');
  process.exit(0);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
