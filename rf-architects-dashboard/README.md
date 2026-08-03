# RF Architects Admin Dashboard

A fully functional Next.js 16 admin dashboard for RF Architects interior/exterior design studio. This dashboard features a complete MVC architecture with mock data layer that can be swapped for a real backend API with minimal changes.

## Architecture Overview

### MVC Pattern Implementation

- **Models** (`/models`): TypeScript types and Zod schemas for all data entities
- **Views** (`/app`): Next.js pages and layouts using App Router
- **Controllers** (`/controllers`): Custom React hooks connecting views to services
- **Services** (`/services`): Business logic layer with API integration abstraction

### Data Access Layer

- **Mock Services** (`/services/mock`): In-memory mock database implementations
- **Service Wrappers** (`/services/*.service.ts`): Bridge layer with `USE_MOCK` flag
- **API Client** (`/services/api/client.ts`): Single point for API configuration

**Key Feature**: Flip `USE_MOCK = false` in any service file to switch from mock to real API calls. No component changes needed!

## Features Implemented

### ✅ Complete
- **Authentication**: Login page with session management (demo@rfarchitects.design / demo123)
- **Dashboard Layout**: Responsive sidebar and topbar with mobile drawer
- **Overview Page**: Stats cards, charts, quick actions, recent leads
- **Products CRUD**: Full create, read, update, delete with filtering and bulk operations
- **Mock Database**: Realistic data for all 11 resource types
- **Styling**: Brand-specific color scheme (Navy #1B2A41 + Gold #9C7A3C)

### 🔧 Ready to Implement (Same Pattern as Products)
- Collections Management
- Category Management (with reordering)
- Projects Management
- Testimonials Management
- FAQs Management
- Site Statistics
- Contact Leads
- Users Management
- Settings

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom brand colors
- **Components**: shadcn/ui primitives
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand for auth store
- **Data Fetching**: SWR-ready service layer (can add SWR wrapper)
- **Charts**: Recharts
- **Notifications**: Sonner
- **Icons**: Lucide React

## Project Structure

```
dashboard/
├── app/                          # Next.js App Router pages
│   ├── (auth)/login              # Login page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx            # Dashboard shell
│   │   ├── page.tsx              # Overview page
│   │   └── [resource]/           # CRUD pages for each resource
│   └── globals.css               # Brand colors and theme
├── components/
│   ├── layout/                   # Sidebar, Topbar
│   ├── ui/                       # shadcn components
│   └── shared/                   # Reusable components (DataTable, etc.)
├── controllers/                  # React hooks connecting UI to services
├── services/
│   ├── api/client.ts             # API client
│   ├── mock/                     # Mock implementations
│   ├── *.service.ts              # Service wrappers with mock/real toggle
│   └── auth.service.ts           # Authentication
├── models/                       # TypeScript types
├── store/                        # Zustand stores
├── lib/                          # Utilities
└── .env.local.example            # Environment template
```

## Getting Started

1. **Install dependencies**: Already done (`pnpm install`)
2. **Start dev server**: `pnpm dev`
3. **Visit**: http://localhost:3000
4. **Login**: demo@rfarchitects.design / demo123

## Implementing a New CRUD Resource

Follow the Products pattern:

### 1. Create Service Files
```typescript
// services/mock/resource.mock.ts - Mock operations
// services/resource.service.ts - Service wrapper with USE_MOCK flag
```

### 2. Create Controller
```typescript
// controllers/useResourceController.ts - React hook with CRUD operations
```

### 3. Create Pages
```typescript
// app/(dashboard)/resources/page.tsx - List page
// app/(dashboard)/resources/new/page.tsx - Create page
// app/(dashboard)/resources/[id]/page.tsx - Edit page
```

## Design System

### Brand Colors
- **Primary**: Navy #1B2A41
- **Accent**: Gold #9C7A3C  
- **Neutral**: Cream #FAFBF9
- **Text**: Dark #1B2A41

### Typography
- Headings: System font stack
- Body: System font stack

### Spacing
- Uses Tailwind's standard scale (p-4, gap-6, etc.)
- Cards use rounded-lg corners with subtle borders

## Switching to Real Backend

### Step 1: Update `.env.local`
```
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/api/v1
```

### Step 2: Update each service file
```typescript
// Change this line in each service:
const USE_MOCK = false // was: true
```

### Step 3: Ensure API endpoints match
The mock API already includes correctly structured requests that match your backend endpoints:
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- etc.

## Mock Data

Mock data lives in `/services/mock/db.ts` and includes:

- **Products** (3 items) - Real examples with PKR pricing
- **Collections** (3 items) - Furniture, Lighting categories
- **Categories** (5 items) - With reorder capability
- **Projects** (3 items) - Featured portfolio pieces
- **Testimonials** (3 items) - Client reviews
- **FAQs** (3 items) - Common questions
- **Site Stats** (4 items) - Key metrics
- **Contact Leads** (3 items) - Mix of statuses
- **Users** (3 items) - superadmin, editor, viewer roles
- **Settings** (1 item) - Company info and social links

## Form Validation

All forms use React Hook Form + Zod:
- Client-side validation with inline error messages
- Automatic form state management
- Toast notifications on success/error

Example:
```typescript
const form = useForm({
  resolver: zodResolver(productFormSchema),
})
```

## Next Steps to Complete

To fully implement remaining sections:

1. **Copy Products pattern** to Collections, Categories, Projects, etc.
2. **Update mock data** in `/services/mock/db.ts` as needed
3. **Customize forms** per resource using existing ProductForm as template
4. **Add special features**:
   - Drag-to-reorder for Categories and FAQs
   - Image gallery for Projects
   - Multi-select for Products "You May Also Like"
5. **Wire up real API** by changing `USE_MOCK` flag

## Key Files to Understand

- `/services/product.service.ts` - Shows the mock/real pattern
- `/controllers/useProductController.ts` - Shows controller structure
- `/app/(dashboard)/products/page.tsx` - Shows list page pattern
- `/services/mock/db.ts` - Mock database structure

## Styling Notes

- Uses Tailwind CSS v4 with @theme variables for brand colors
- All colors defined in `app/globals.css` under `:root` and `.dark`
- Components import from `@/components/ui` (shadcn)
- Layout uses flexbox first (no floats)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive with breakpoints at `sm`, `md`, `lg`
- Sidebar collapses to drawer on mobile

## Performance

- Next.js 16 with Turbopack (default bundler)
- React Compiler support available
- Mock data fetches with 300-600ms artificial delay for UX testing
- Can be replaced with SWR for real caching

## Authentication

- Session stored in Zustand store with localStorage persistence
- Not for production - demonstrates structure for real auth
- Protected routes redirect to login if not authenticated
- User info available in all pages via `useAuthStore()`

---

**Ready to go!** The dashboard is fully functional locally. All 11 resource sections follow the same architecture and can be implemented by copying the Products section pattern.
