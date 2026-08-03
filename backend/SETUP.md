# RF Architects Backend - Setup Guide

This guide walks you through setting up the RF Architects backend from scratch.

## Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud instance - MongoDB Atlas recommended)
- Cloudinary account (for image uploads)
- SMTP email service (Gmail, SendGrid, Mailgun, etc.)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

#### Option A: Local MongoDB
```bash
# Start MongoDB locally
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/rf-architects`

### 3. Setup Cloudinary

1. Create a free account at https://cloudinary.com
2. Go to Dashboard
3. Note your:
   - Cloud Name
   - API Key
   - API Secret

### 4. Setup Email Service

#### Option A: Gmail
1. Enable 2-Step Verification
2. Generate an App Password
3. Use your email and app password in `.env`

#### Option B: SendGrid or Mailgun
- Create account and note API credentials
- Update SMTP settings accordingly

### 5. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` and fill in all values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rf-architects

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Origins
FRONTEND_ORIGIN=http://localhost:3000
DASHBOARD_ORIGIN=http://localhost:3001

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@rfarchitects.com
```

### 6. Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:5000`

Check health: `http://localhost:5000/health`

## Initial Data Setup

Once the server is running, you'll need to create:

1. **First Admin User** - Create via MongoDB directly or via API
2. **Site Stats** - Initialize the 4 site statistics
3. **Settings** - Configure company information

### Create First Admin User (via MongoDB)

```bash
# Connect to MongoDB and run:
db.users.insertOne({
  name: "Admin",
  email: "admin@rfarchitects.com",
  passwordHash: "hashed_password", // Use bcrypt to hash a password
  role: "superadmin",
  isActive: true,
  lastLoginAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use a MongoDB GUI tool like MongoDB Compass.

### Initialize Site Stats (via API)

After creating admin user, login and create site stats:

```bash
curl -X PUT http://localhost:5000/api/v1/site-stats/years \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"value": 25, "label": "Years Experience", "sublabel": "in design"}'

curl -X PUT http://localhost:5000/api/v1/site-stats/projectsLaunched \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"value": 500, "label": "Projects Launched"}'

curl -X PUT http://localhost:5000/api/v1/site-stats/clientsSatisfied \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"value": 300, "label": "Clients Satisfied"}'

curl -X PUT http://localhost:5000/api/v1/site-stats/projectsInProgress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"value": 15, "label": "Projects In Progress"}'
```

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.js         # MongoDB connection
│   │   └── cloudinary.js # Cloudinary setup
│   ├── models/           # Mongoose schemas (10 models)
│   ├── controllers/      # Business logic (11 controllers)
│   ├── routes/           # API endpoint definitions (13 route files)
│   ├── middlewares/      # Auth, validation, error handling
│   ├── services/         # External services (email, Cloudinary)
│   ├── utils/            # Helper functions
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── .env                  # Environment variables (create from .example)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
├── README.md             # Full documentation
└── SETUP.md              # This file
```

## Database Schema

The backend includes 10 Mongoose models:

1. **User** - Admin users with roles
2. **Category** - Product/Project categories
3. **Collection** - Product collections
4. **Product** - Design products
5. **Project** - Portfolio projects
6. **Testimonial** - Client testimonials
7. **Faq** - FAQ entries
8. **SiteStat** - Homepage statistics
9. **ContactLead** - Contact form submissions
10. **Settings** - Global site settings

All models include automatic timestamps and slug generation (where applicable).

## Common Tasks

### Create a Category

```bash
curl -X POST http://localhost:5000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Living Room"}'
```

### Create a Product

```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Modern Sofa",
    "price": 1200,
    "category": "CATEGORY_ID",
    "description": "Beautiful modern sofa",
    "images": ["url1", "url2"],
    "sku": "SOFA-001"
  }'
```

### Upload an Image

```bash
curl -X POST http://localhost:5000/api/v1/uploads/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

### Submit Contact Form

```bash
curl -X POST http://localhost:5000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I am interested in your services"
  }'
```

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` in `.env`
- Check MongoDB is running (if local)
- For MongoDB Atlas, whitelist your IP address
- Ensure credentials are correct

### Cloudinary Upload Fails
- Verify `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET`
- Check file size (max 5MB)
- Ensure file is an image format

### Email Not Sending
- Verify SMTP credentials
- For Gmail: ensure App Password is used (not regular password)
- Check firewall/antivirus blocking SMTP port
- Verify `ADMIN_EMAIL` is configured

### JWT Authentication Issues
- Ensure `JWT_SECRET` is set and matches across refreshes
- Check token expiration: `JWT_EXPIRES_IN`
- Verify cookie parsing middleware is enabled

## Production Deployment

### Before Deploying:

1. **Change Secrets**
   - Generate strong JWT secrets
   - Use `openssl rand -base64 32` to generate

2. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use production MongoDB URI
   - Configure real email service
   - Update CORS origins

3. **Security**
   - Use HTTPS everywhere
   - Set secure cookie flags
   - Implement rate limiting on all endpoints
   - Setup backup strategy for database

4. **Logging**
   - Setup centralized logging (e.g., Sentry)
   - Monitor error rates

### Deploy to Services

The backend can be deployed to:
- **Vercel** (serverless)
- **Heroku** (PaaS)
- **AWS** (EC2, Lambda)
- **DigitalOcean** (VPS)
- **Railway** (PaaS)

Each requires configuration of environment variables and database access.

## API Testing

Use tools like:
- **Postman** - GUI for API testing
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension
- **cURL** - Command line

Import/test the endpoints documented in `README.md`.

## Support & Documentation

- Full API documentation: See `README.md`
- Mongoose documentation: https://mongoosejs.com
- Express.js guide: https://expressjs.com
- Cloudinary docs: https://cloudinary.com/documentation
- JWT info: https://jwt.io

## Next Steps

1. ✅ Setup backend (this guide)
2. ⏭️ Create frontend (Next.js/React)
3. ⏭️ Build admin dashboard
4. ⏭️ Integrate both frontends with this API
5. ⏭️ Deploy to production

Happy building! 🚀
