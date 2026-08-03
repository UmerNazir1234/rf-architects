import type {
  Product,
  Collection,
  Category,
  Project,
  FAQ,
  SiteStat,
  User,
  Settings,
  NavMenu,
  NavMenuItem,
} from "@/models/index"

export const mockDb = {
  products: [
    {
      id: "prod-1",
      name: "Cultural Crest Table",
      slug: "cultural-crest-table",
      sku: "CCT-001",
      price: 44000,
      compareAtPrice: 48000,
      category: "cat-1",
      collection: "coll-1",
      images: [
        {
          url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=450&fit=crop",
          publicId: "cct-1",
          position: 0,
          isFeatured: true,
        },
        {
          url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&h=450&fit=crop",
          publicId: "cct-2",
          position: 1,
          isFeatured: false,
        },
      ],
      description: "Elegant coffee table with cultural design elements and solid wood construction.",
      dimensions: "120cm x 60cm x 45cm",
      materials: ["Walnut wood", "Brass accents"],
      careInstructions: "Use soft cloth for cleaning. Avoid direct sunlight.",
      assemblyInfo: "Requires professional assembly",
      terms: "1 year warranty",
      inStock: true,
      stockNote: "",
      hasVariants: false,
      options: [],
      variants: [],
      isActive: true,
      relatedProducts: ["prod-3"],
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
    },
    {
      id: "prod-2",
      name: "Balder White Marble Dining Set",
      slug: "balder-white-marble-dining-set",
      sku: "BWM-002",
      price: 61500,
      compareAtPrice: null,
      category: "cat-1",
      collection: "coll-2",
      images: [
        {
          url: "https://images.unsplash.com/photo-1577142211694-69a6ba63b102?w=600&h=450&fit=crop",
          publicId: "bwm-1",
          position: 0,
          isFeatured: true,
        },
      ],
      description: "Stunning marble dining set with elegant white finish and modern design.",
      dimensions: "180cm x 100cm x 75cm",
      materials: ["White marble top", "Wooden base"],
      careInstructions: "Clean with pH-neutral cleaner",
      assemblyInfo: "Professional installation recommended",
      terms: "2 year warranty",
      inStock: true,
      stockNote: "",
      hasVariants: true,
      options: [
        { name: "Size", values: ["6-Seater", "8-Seater"] },
      ],
      variants: [
        { sku: "BWM-002-6", price: 61500, inStock: true, isActive: true, attributes: { Size: "6-Seater" } },
        { sku: "BWM-002-8", price: 78000, inStock: true, isActive: true, attributes: { Size: "8-Seater" } },
      ],
      isActive: true,
      relatedProducts: [],
      createdAt: new Date("2025-01-10"),
      updatedAt: new Date("2025-01-10"),
    },
    {
      id: "prod-3",
      name: "Flintwood Coffee Table",
      slug: "flintwood-coffee-table",
      sku: "FCT-003",
      price: 83000,
      compareAtPrice: null,
      category: "cat-1",
      collection: "coll-1",
      images: [
        {
          url: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?w=600&h=450&fit=crop",
          publicId: "fct-1",
          position: 0,
          isFeatured: true,
        },
      ],
      description: "Premium coffee table with flint stone inlays and hand-crafted details.",
      dimensions: "140cm x 80cm x 50cm",
      materials: ["Solid oak", "Flint stone"],
      careInstructions: "Treat with wood oil quarterly",
      assemblyInfo: "Self-assembly available",
      terms: "3 year warranty",
      inStock: false,
      stockNote: "Back order - arriving next month",
      hasVariants: false,
      options: [],
      variants: [],
      isActive: true,
      relatedProducts: ["prod-1"],
      createdAt: new Date("2025-01-08"),
      updatedAt: new Date("2025-01-12"),
    },
  ] as Product[],

  categories: [
    { id: "cat-1", name: "Furniture", slug: "furniture", order: 1, createdAt: new Date() },
    { id: "cat-2", name: "Lighting", slug: "lighting", order: 2, createdAt: new Date() },
    { id: "cat-3", name: "Bath Collection", slug: "bath-collection", order: 3, createdAt: new Date() },
    { id: "cat-4", name: "Decor & Accessories", slug: "decor-accessories", order: 4, createdAt: new Date() },
    { id: "cat-5", name: "Marble Collections", slug: "marble-collections", order: 5, createdAt: new Date() },
  ] as Category[],

  // All 14 real collections nested under the 5 categories
  collections: [
    // Furniture collections (4)
    { id: "coll-1", name: "Coffee Tables", slug: "coffee-tables", category: "cat-1", coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop", description: "Curated collection of premium coffee tables", type: "manual", productIds: ["prod-1", "prod-3"], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-2", name: "Side Tables", slug: "side-tables", category: "cat-1", coverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop", description: "Elegant side tables for modern interiors", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-3", name: "Nesting Tables", slug: "nesting-tables", category: "cat-1", coverImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&h=300&fit=crop", description: "Space-saving nesting tables", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-4", name: "Night Stands", slug: "night-stands", category: "cat-1", coverImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=300&fit=crop", description: "Luxury bedside night stands", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },

    // Lighting collections (5)
    { id: "coll-5", name: "Pendants", slug: "pendants", category: "cat-2", coverImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop", description: "Minimalist and modern pendant lights", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-6", name: "Pendant Chandeliers", slug: "pendant-chandeliers", category: "cat-2", coverImage: "https://images.unsplash.com/photo-1513506003901-1e6c229e2d15?w=400&h=300&fit=crop", description: "Statement chandeliers for grand spaces", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-7", name: "Floor Lamps", slug: "floor-lamps", category: "cat-2", coverImage: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=400&h=300&fit=crop", description: "Architectural floor lamps", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-8", name: "Table Lamps", slug: "table-lamps", category: "cat-2", coverImage: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=400&h=300&fit=crop", description: "Ambient table lamps", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-9", name: "Candle Stands", slug: "candle-stands", category: "cat-2", coverImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=300&fit=crop", description: "Hand-crafted marble and brass candle stands", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },

    // Decor & Accessories collections (2)
    { id: "coll-10", name: "Book Holders", slug: "book-holders", category: "cat-4", coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", description: "Sculptural marble book holders", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-11", name: "Decorative Trays", slug: "decorative-trays", category: "cat-4", coverImage: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop", description: "Catchall and serving decorative trays", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },

    // Bath Collection collections (3)
    { id: "coll-12", name: "Vessel Sinks", slug: "vessel-sinks", category: "cat-3", coverImage: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop", description: "Hand-carved natural stone vessel sinks", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-13", name: "Towel Holders", slug: "towel-holders", category: "cat-3", coverImage: "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop", description: "Wall-mounted luxury towel holders", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "coll-14", name: "Towel Stands", slug: "towel-stands", category: "cat-3", coverImage: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300&fit=crop", description: "Freestanding bathroom towel stands", type: "manual", productIds: [], isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ] as Collection[],

  navMenus: [
    { id: "menu-1", handle: "main-navbar", label: "Main Navigation", isActive: true },
  ] as NavMenu[],

  navMenuItems: [
    // Top-level categories
    { id: "item-1", menuId: "menu-1", label: "FURNITURE", linkType: "category", targetCategory: "cat-1", href: "/shop?category=furniture", parentId: null, order: 0, isActive: true },
    { id: "item-2", menuId: "menu-1", label: "LIGHTING", linkType: "category", targetCategory: "cat-2", href: "/shop?category=lighting", parentId: null, order: 1, isActive: true },
    { id: "item-3", menuId: "menu-1", label: "BATH COLLECTION", linkType: "category", targetCategory: "cat-3", href: "/shop?category=bath-collection", parentId: null, order: 2, isActive: true },
    { id: "item-4", menuId: "menu-1", label: "DECOR & ACCESSORIES", linkType: "category", targetCategory: "cat-4", href: "/shop?category=decor-accessories", parentId: null, order: 3, isActive: true },
    { id: "item-5", menuId: "menu-1", label: "MARBLE COLLECTIONS", linkType: "category", targetCategory: "cat-5", href: "/shop?category=marble-collections", parentId: null, order: 4, isActive: true },

    // Furniture sub-collections
    { id: "item-1-1", menuId: "menu-1", label: "Coffee Tables", linkType: "collection", targetCollection: "coll-1", href: "/collections/coffee-tables", parentId: "item-1", order: 0, isActive: true },
    { id: "item-1-2", menuId: "menu-1", label: "Side Tables", linkType: "collection", targetCollection: "coll-2", href: "/collections/side-tables", parentId: "item-1", order: 1, isActive: true },
    { id: "item-1-3", menuId: "menu-1", label: "Nesting Tables", linkType: "collection", targetCollection: "coll-3", href: "/collections/nesting-tables", parentId: "item-1", order: 2, isActive: true },
    { id: "item-1-4", menuId: "menu-1", label: "Night Stands", linkType: "collection", targetCollection: "coll-4", href: "/collections/night-stands", parentId: "item-1", order: 3, isActive: true },

    // Lighting sub-collections
    { id: "item-2-1", menuId: "menu-1", label: "Pendants", linkType: "collection", targetCollection: "coll-5", href: "/collections/pendants", parentId: "item-2", order: 0, isActive: true },
    { id: "item-2-2", menuId: "menu-1", label: "Pendant Chandeliers", linkType: "collection", targetCollection: "coll-6", href: "/collections/pendant-chandeliers", parentId: "item-2", order: 1, isActive: true },
    { id: "item-2-3", menuId: "menu-1", label: "Floor Lamps", linkType: "collection", targetCollection: "coll-7", href: "/collections/floor-lamps", parentId: "item-2", order: 2, isActive: true },
    { id: "item-2-4", menuId: "menu-1", label: "Table Lamps", linkType: "collection", targetCollection: "coll-8", href: "/collections/table-lamps", parentId: "item-2", order: 3, isActive: true },
    { id: "item-2-5", menuId: "menu-1", label: "Candle Stands", linkType: "collection", targetCollection: "coll-9", href: "/collections/candle-stands", parentId: "item-2", order: 4, isActive: true },

    // Decor & Accessories sub-collections
    { id: "item-4-1", menuId: "menu-1", label: "Book Holders", linkType: "collection", targetCollection: "coll-10", href: "/collections/book-holders", parentId: "item-4", order: 0, isActive: true },
    { id: "item-4-2", menuId: "menu-1", label: "Decorative Trays", linkType: "collection", targetCollection: "coll-11", href: "/collections/decorative-trays", parentId: "item-4", order: 1, isActive: true },

    // Bath Collection sub-collections
    { id: "item-3-1", menuId: "menu-1", label: "Vessel Sinks", linkType: "collection", targetCollection: "coll-12", href: "/collections/vessel-sinks", parentId: "item-3", order: 0, isActive: true },
    { id: "item-3-2", menuId: "menu-1", label: "Towel Holders", linkType: "collection", targetCollection: "coll-13", href: "/collections/towel-holders", parentId: "item-3", order: 1, isActive: true },
    { id: "item-3-3", menuId: "menu-1", label: "Towel Stands", linkType: "collection", targetCollection: "coll-14", href: "/collections/towel-stands", parentId: "item-3", order: 2, isActive: true },
  ] as NavMenuItem[],

  projects: [
    {
      id: "proj-1",
      title: "Sweden Melody",
      slug: "sweden-melody",
      location: "Paris, France",
      year: 2019,
      category: "Interior",
      conceptHeading: "Scandinavian Minimalism",
      conceptDescription: "A masterpiece combining Swedish simplicity with French elegance.",
      coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      gallery: [],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date("2019-01-15"),
      updatedAt: new Date("2025-01-10"),
    },
  ] as Project[],

  faqs: [] as FAQ[],
  siteStats: [] as SiteStat[],
  users: [] as User[],
  settings: {} as Settings,
}
