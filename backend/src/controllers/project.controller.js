import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

// PUBLIC ROUTES

export const getPublicProjects = asyncHandler(async (req, res) => {
  const { featured, limit = 6 } = req.query;

  let filter = { isPublished: true };
  if (featured === 'true') filter.isFeatured = true;

  const projects = await Project.find(filter)
    .sort({ order: 1, createdAt: -1 })
    .limit(parseInt(limit));

  res.status(200).json(new ApiResponse(200, projects, 'Projects retrieved'));
});

export const getPublicProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const project = await Project.findOne({ slug, isPublished: true });

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Get adjacent projects for navigation
  const previousProject = await Project.findOne({
    isPublished: true,
    order: { $lt: project.order },
  })
    .sort({ order: -1 })
    .select('slug title');

  const nextProject = await Project.findOne({
    isPublished: true,
    order: { $gt: project.order },
  })
    .sort({ order: 1 })
    .select('slug title');

  res.status(200).json(
    new ApiResponse(
      200,
      {
        project,
        navigation: { previousProject, nextProject },
      },
      'Project retrieved'
    )
  );
});

// ADMIN ROUTES

export const getAdminProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const filter = {};
  if (status === 'published') filter.isPublished = true;
  else if (status === 'draft') filter.isPublished = false;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const projects = await Project.find(filter)
    .skip(skip)
    .limit(limitNum)
    .sort({ order: 1, createdAt: -1 });

  const total = await Project.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        projects,
        pagination: { total, pages: Math.ceil(total / limitNum), currentPage: pageNum },
      },
      'Admin projects retrieved'
    )
  );
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, location, year, category, concept_label, concept_subheading, description, cover_image, gallery_images, isFeatured, isPublished } = req.body;

  if (!title || !category || !cover_image || !description) {
    throw new ApiError(400, 'Title, category, cover image, and description are required');
  }

  // Get the highest order
  const lastProject = await Project.findOne().sort({ order: -1 });
  const order = (lastProject?.order || 0) + 1;

  const project = await Project.create({
    title,
    location,
    year,
    category,
    concept_label,
    concept_subheading,
    description,
    cover_image,
    gallery_images: gallery_images || [],
    order,
    isFeatured: isFeatured || false,
    isPublished: isPublished || false,
  });

  res.status(201).json(new ApiResponse(201, project, 'Project created'));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const project = await Project.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(new ApiResponse(200, project, 'Project updated'));
});

export const publishProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  project.isPublished = !project.isPublished;
  await project.save();

  res.status(200).json(
    new ApiResponse(200, project, `Project ${project.isPublished ? 'published' : 'unpublished'}`)
  );
});

export const reorderProjects = asyncHandler(async (req, res) => {
  const { order } = req.body; // Array of project IDs

  if (!Array.isArray(order)) {
    throw new ApiError(400, 'Order must be an array of project IDs');
  }

  const updatePromises = order.map((id, index) =>
    Project.findByIdAndUpdate(id, { $set: { order: index } }, { new: true })
  );

  const updated = await Promise.all(updatePromises);

  res.status(200).json(new ApiResponse(200, updated, 'Projects reordered'));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(new ApiResponse(200, {}, 'Project deleted'));
});
