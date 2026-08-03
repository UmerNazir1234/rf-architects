/**
 * NavMenu Seed Script
 * -------------------
 * Creates the "main-navbar" menu with:
 *   - 5 top-level category items (Furniture, Lighting, Bath Collection, Decor & Accessories, Marble Collections)
 *   - 14 collection sub-items nested under the correct parent
 *
 * Usage:
 *   node src/seeds/navMenu.seed.js
 *
 * Requires DB connection — run AFTER seeding categories and collections.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { NavMenu, NavMenuItem } from '../models/NavMenu.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';

const CATEGORY_MAP = {
  'Furniture':           ['Coffee Tables', 'Side Tables', 'Nesting Tables', 'Night Stands'],
  'Lighting':            ['Pendants', 'Pendant Chandeliers', 'Floor Lamps', 'Table Lamps', 'Candle Stands'],
  'Decor & Accessories': ['Book Holders', 'Decorative Trays'],
  'Bath Collection':     ['Vessel Sinks', 'Towel Holders', 'Towel Stands'],
  'Marble Collections':  [],
};

const CATEGORY_ORDER = [
  'Furniture',
  'Lighting',
  'Bath Collection',
  'Decor & Accessories',
  'Marble Collections',
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Remove existing main-navbar to allow idempotent re-seeding
  const existing = await NavMenu.findOne({ handle: 'main-navbar' });
  if (existing) {
    await NavMenuItem.deleteMany({ menuId: existing._id });
    await existing.deleteOne();
    console.log('🗑️  Removed existing main-navbar');
  }

  // Create the menu
  const menu = await NavMenu.create({
    handle: 'main-navbar',
    label: 'Main Navigation',
    isActive: true,
  });
  console.log('📋 Created NavMenu: main-navbar');

  // Fetch all categories and collections from DB
  const categories = await Category.find();
  const collections = await Collection.find();

  const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));
  const collByName = Object.fromEntries(collections.map((c) => [c.name, c]));

  for (let catOrder = 0; catOrder < CATEGORY_ORDER.length; catOrder++) {
    const catName = CATEGORY_ORDER[catOrder];
    const catDoc = catByName[catName];

    if (!catDoc) {
      console.warn(`⚠️  Category not found in DB: "${catName}" — skipping`);
      continue;
    }

    // Create top-level category item
    const parentItem = await NavMenuItem.create({
      menuId: menu._id,
      label: catName.toUpperCase(),
      linkType: 'category',
      targetCategory: catDoc._id,
      targetCollection: null,
      targetUrl: null,
      parentId: null,
      order: catOrder,
      isActive: true,
    });
    console.log(`  ➕ Top-level: ${catName}`);

    const subCollectionNames = CATEGORY_MAP[catName] || [];
    for (let colOrder = 0; colOrder < subCollectionNames.length; colOrder++) {
      const colName = subCollectionNames[colOrder];
      const colDoc = collByName[colName];

      if (!colDoc) {
        console.warn(`     ⚠️  Collection not found in DB: "${colName}" — creating placeholder item`);
        await NavMenuItem.create({
          menuId: menu._id,
          label: colName,
          linkType: 'none', // Will be corrected once collection is created
          targetCollection: null,
          targetCategory: null,
          targetUrl: null,
          parentId: parentItem._id,
          order: colOrder,
          isActive: false, // inactive until collection exists
        });
        continue;
      }

      await NavMenuItem.create({
        menuId: menu._id,
        label: colName,
        linkType: 'collection',
        targetCollection: colDoc._id,
        targetCategory: null,
        targetUrl: null,
        parentId: parentItem._id,
        order: colOrder,
        isActive: true,
      });
      console.log(`     ↳ ${colName}`);
    }
  }

  console.log('\n✅ NavMenu seed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
