import slug from 'slug';

export const generateSlug = (text) => {
  return slug(text, { lower: true });
};

export const ensureUniqueSlug = async (model, baseSlug, excludeId = null) => {
  let newSlug = baseSlug;
  let counter = 1;

  // Check if slug already exists
  while (true) {
    const query = { slug: newSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existing = await model.findOne(query);
    if (!existing) {
      break;
    }
    
    // Add counter suffix
    newSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return newSlug;
};
