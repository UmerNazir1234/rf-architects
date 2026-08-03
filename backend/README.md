# RF Architects Backend

A complete Express.js + MongoDB backend for the RF Architects interior/exterior design studio website. This API provides a strict MVC-patterned backend with role-based authentication, content management, and image handling via Cloudinary.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (superadmin, editor, viewer)
- **Content Management**: Full CRUD operations for products, collections, projects, testimonials, FAQs, and more
- **Public & Admin Routes**: Separate endpoints for frontend (published content only) and dashboard (full management)
- **Image Management**: Cloudinary integration for image uploads and deletions
- **Contact Management**: Contact form submissions with email notifications and lead tracking
- **Security**: bcrypt password hashing, helmet protection, CORS, rate limiting, input validation
- **Database**: MongoDB with Mongoose ODM for robust schema management

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database and Cloudinary configuration
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Route handlers and business logic
│   ├── routes/           # API endpoint definitions
│   ├── middlewares/      # Custom middleware (auth, validation, etc.)
│   ├── services/         # Business logic services (mailer, Cloudinary)
│   ├── utils/            # Helper functions and utilities
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secrets
   - Cloudinary credentials
   - Email configuration (SMTP)
   - CORS origins

4. **Start the server**
   ```bash
   # Development (with nodemon)
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/rf-architects

# Authentication
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Cloudinary (Image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_ORIGIN=http://localhost:3000
DASHBOARD_ORIGIN=http://localhost:3001

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@rfarchitects.com
```

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /login` - User login (public)
- `POST /logout` - User logout (protected)
- `GET /me` - Get current user (protected)
- `POST /refresh` - Refresh JWT token (public)

### Categories (`/api/v1/categories`)
- `GET /` - Get all categories (public)
- `POST /` - Create category (protected, editor+)
- `PUT /:id` - Update category (protected, editor+)
- `DELETE /:id` - Delete category (protected, superadmin)

### Collections (`/api/v1/collections`)
- `GET /` - Get all collections (public)
- `GET /:slug` - Get collection by slug with products (public)
- `GET /admin` - Get all collections admin view (protected)
- `POST /` - Create collection (protected, editor+)
- `PUT /:id` - Update collection (protected, editor+)
- `DELETE /:id` - Delete collection (protected, superadmin)

### Products (`/api/v1/products`)
- `GET /` - Get published products (public, paginated, filterable)
- `GET /:slug` - Get product by slug (public)
- `GET /:slug/related` - Get related products (public)
- `GET /admin` - Get all products including drafts (protected)
- `POST /` - Create product (protected, editor+)
- `PUT /:id` - Update product (protected, editor+)
- `PATCH /:id/publish` - Toggle product publish status (protected, editor+)
- `PATCH /:id/stock` - Update stock status (protected, editor+)
- `DELETE /:id` - Delete product (protected, superadmin)
- `POST /bulk` - Bulk operations (protected, editor+)
- `POST /:id/duplicate` - Duplicate product (protected, editor+)

### Projects (`/api/v1/projects`)
- `GET /` - Get published projects (public, filterable)
- `GET /:slug` - Get project by slug with navigation (public)
- `GET /admin` - Get all projects (protected)
- `POST /` - Create project (protected, editor+)
- `PUT /:id` - Update project (protected, editor+)
- `PATCH /:id/publish` - Toggle publish status (protected, editor+)
- `PATCH /reorder` - Reorder projects (protected, editor+)
- `DELETE /:id` - Delete project (protected, superadmin)

### Testimonials (`/api/v1/testimonials`)
- `GET /` - Get published testimonials (public)
- `GET /admin` - Get all testimonials (protected)
- `POST /` - Create testimonial (protected, editor+)
- `PUT /:id` - Update testimonial (protected, editor+)
- `PATCH /:id/publish` - Toggle publish status (protected, editor+)
- `DELETE /:id` - Delete testimonial (protected, superadmin)

### FAQs (`/api/v1/faqs`)
- `GET /` - Get published FAQs (public)
- `GET /admin` - Get all FAQs (protected)
- `POST /` - Create FAQ (protected, editor+)
- `PUT /:id` - Update FAQ (protected, editor+)
- `PATCH /:id/publish` - Toggle publish status (protected, editor+)
- `PATCH /reorder` - Reorder FAQs (protected, editor+)
- `DELETE /:id` - Delete FAQ (protected, superadmin)

### Site Stats (`/api/v1/site-stats`)
- `GET /` - Get all site stats (public)
- `PUT /:key` - Update stat value (protected, editor+)

### Contact Leads (`/api/v1/leads`)
- `POST /` - Submit contact form (public, rate-limited)
- `GET /` - Get contact leads (protected, editor+)
- `GET /:id` - Get lead by ID (protected, editor+)
- `PATCH /:id/status` - Update lead status (protected, editor+)
- `DELETE /:id` - Delete lead (protected, superadmin)
- `GET /export` - Export leads as CSV (protected, editor+)

### Users (`/api/v1/users`) - superadmin only
- `GET /` - Get all users (protected, superadmin)
- `POST /` - Invite user (protected, superadmin)
- `PUT /:id` - Update user (protected, superadmin)
- `DELETE /:id` - Delete user (protected, superadmin)

### Settings (`/api/v1/settings`)
- `GET /` - Get settings (public)
- `PUT /` - Update settings (protected, superadmin)

### Uploads (`/api/v1/uploads`)
- `POST /image` - Upload image to Cloudinary (protected, editor+)
- `DELETE /image` - Delete image from Cloudinary (protected, editor+)

## Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Authentication

1. **Login**: POST to `/api/v1/auth/login` with email and password
2. **JWT Token**: Received as httpOnly cookie `accessToken`
3. **Token Refresh**: Use `/api/v1/auth/refresh` with `refreshToken` cookie
4. **Protected Routes**: Include token in `Authorization: Bearer <token>` header or cookies

## Role-Based Access Control

- **superadmin**: Full access - can create, edit, delete everything, manage users
- **editor**: Can create and edit content, cannot delete or manage users
- **viewer**: Read-only access to admin dashboards

## Rate Limiting

- Contact form: 5 requests per 10 minutes per IP
- Login: 10 attempts per 15 minutes per IP

## Error Handling

The API uses consistent error codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Technologies Used

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: helmet, bcryptjs, cors
- **Image Handling**: Cloudinary, multer
- **Validation**: express-validator
- **Email**: Nodemailer
- **Utilities**: dotenv, morgan, slug

## Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run in production
npm start
```

## License

ISC

## Support

For issues or questions, please contact the development team or open an issue in the repository.
