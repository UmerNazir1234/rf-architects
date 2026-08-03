// Placeholder images for the mega menu
const PLACEHOLDER_IMAGES = {
  bathtub:
    "https://res.cloudinary.com/dzmrdbwqh/image/upload/v1764856442/RF%20Architects%20Images/D29F004B-C2B9-47B9-858F-771F0F57618F_oqmko3.jpg",
  sideTable:
    "https://res.cloudinary.com/dzmrdbwqh/image/upload/v1764858867/RF%20Architects%20Images/Metamorphic-side-table-grey_it9p8m.webp",
};

export interface SubLink {
  label: string;
  href: string;
}

export interface CategoryLink {
  label: string;
  href: string;
  subLinks: SubLink[];
}

export interface FeaturedProduct {
  collection: string;
  name: string;
  image: string;
  href: string;
}

export interface MegaMenuCategory {
  label: string;
  href: string;
  categories: CategoryLink[];
  featured: FeaturedProduct[];
  shopAllLabel?: string;
  shopAllHref?: string;
}

export interface NavItem {
  label: string;
  href: string;
  megaMenu?: MegaMenuCategory;
}

export const navigationData: NavItem[] = [
  {
    label: "FURNITURE",
    href: "/furniture",
    megaMenu: {
      label: "FURNITURE",
      href: "/furniture",
      categories: [
        {
          label: "DINING",
          href: "/furniture/dining",
          subLinks: [
            {
              label: "Marble Dining Tables",
              href: "/furniture/dining/marble-dining-tables",
            },
            {
              label: "Dining Table Tops",
              href: "/furniture/dining/dining-table-tops",
            },
          ],
        },
        {
          label: "LIVING",
          href: "/furniture/living",
          subLinks: [
            {
              label: "Marble Coffee Tables",
              href: "/furniture/living/marble-coffee-tables",
            },
            { label: "Side Tables", href: "/furniture/living/side-tables" },
            {
              label: "Console Tables",
              href: "/furniture/living/console-tables",
            },
            {
              label: "Nesting Tables",
              href: "/furniture/living/nesting-tables",
            },
          ],
        },
        {
          label: "BEDROOM",
          href: "/furniture/bedroom",
          subLinks: [
            {
              label: "Bedside Tables",
              href: "/furniture/bedroom/bedside-tables",
            },
            {
              label: "Accent Tables",
              href: "/furniture/bedroom/accent-tables",
            },
          ],
        },
        {
          label: "STATEMENT FURNITURE",
          href: "/furniture/statement",
          subLinks: [
            {
              label: "Centerpiece Tables",
              href: "/furniture/statement/centerpiece-tables",
            },
            {
              label: "Sculptural Tables",
              href: "/furniture/statement/sculptural-tables",
            },
            {
              label: "Limited Edition Pieces",
              href: "/furniture/statement/limited-edition",
            },
          ],
        },
      ],
      featured: [
        {
          collection: "RF SIGNATURE®",
          name: "MARBLE COFFEE TABLE",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/furniture/living/marble-coffee-tables",
        },
        {
          collection: "RF SIGNATURE®",
          name: "CONSOLE TABLE",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/furniture/living/console-tables",
        },
      ],
      shopAllLabel: "SHOP ALL FURNITURE",
      shopAllHref: "/furniture",
    },
  },
  {
    label: "LIGHTING",
    href: "/lighting",
    megaMenu: {
      label: "LIGHTING",
      href: "/lighting",
      categories: [
        {
          label: "TABLE LIGHTING",
          href: "/lighting/table-lighting",
          subLinks: [
            {
              label: "Marble Table Lamps",
              href: "/lighting/table-lighting/marble-table-lamps",
            },
            {
              label: "Bedside Lamps",
              href: "/lighting/table-lighting/bedside-lamps",
            },
          ],
        },
        {
          label: "DECORATIVE LIGHTING",
          href: "/lighting/decorative",
          subLinks: [
            {
              label: "Candle Stands",
              href: "/lighting/decorative/candle-stands",
            },
            {
              label: "Candle Holders",
              href: "/lighting/decorative/candle-holders",
            },
            {
              label: "Ambient Marble Lights",
              href: "/lighting/decorative/ambient-marble-lights",
            },
          ],
        },
      ],
      featured: [
        {
          collection: "RF SIGNATURE®",
          name: "MARBLE TABLE LAMP",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/lighting/table-lighting/marble-table-lamps",
        },
        {
          collection: "RF SIGNATURE®",
          name: "CANDLE STAND",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/lighting/decorative/candle-stands",
        },
      ],
      shopAllLabel: "SHOP ALL LIGHTING",
      shopAllHref: "/lighting",
    },
  },
  {
    label: "BATH COLLECTION",
    href: "/bath-collection",
    megaMenu: {
      label: "BATH COLLECTION",
      href: "/bath-collection",
      categories: [
        {
          label: "SANITARY WARE",
          href: "/bath-collection/sanitary-ware",
          subLinks: [
            {
              label: "Marble Wash Basins / Sinks",
              href: "/bath-collection/sanitary-ware/marble-wash-basins",
            },
            {
              label: "Marble Bathtubs",
              href: "/bath-collection/sanitary-ware/marble-bathtubs",
            },
          ],
        },
        {
          label: "BATH FURNITURE",
          href: "/bath-collection/bath-furniture",
          subLinks: [
            {
              label: "Vanity Tops",
              href: "/bath-collection/bath-furniture/vanity-tops",
            },
            {
              label: "Side Tables for Bath",
              href: "/bath-collection/bath-furniture/side-tables",
            },
            {
              label: "Stool Tables",
              href: "/bath-collection/bath-furniture/stool-tables",
            },
          ],
        },
        {
          label: "BATH ACCESSORIES",
          href: "/bath-collection/bath-accessories",
          subLinks: [
            {
              label: "Soap Holders",
              href: "/bath-collection/bath-accessories/soap-holders",
            },
            {
              label: "Toothbrush Holders",
              href: "/bath-collection/bath-accessories/toothbrush-holders",
            },
            {
              label: "Tray Tables",
              href: "/bath-collection/bath-accessories/tray-tables",
            },
          ],
        },
      ],
      featured: [
        {
          collection: "RF SIGNATURE®",
          name: "STONE BATHTUB",
          image: PLACEHOLDER_IMAGES.bathtub,
          href: "/bath-collection/sanitary-ware/marble-bathtubs",
        },
        {
          collection: "RF SIGNATURE®",
          name: "MARBLE WASH BASIN",
          image: PLACEHOLDER_IMAGES.bathtub,
          href: "/bath-collection/sanitary-ware/marble-wash-basins",
        },
      ],
      shopAllLabel: "SHOP ALL BATH",
      shopAllHref: "/bath-collection",
    },
  },
  {
    label: "DECOR & ACCESSORIES",
    href: "/decor-accessories",
    megaMenu: {
      label: "DECOR & ACCESSORIES",
      href: "/decor-accessories",
      categories: [
        {
          label: "TABLETOP DECOR",
          href: "/decor-accessories/tabletop-decor",
          subLinks: [
            {
              label: "Book Holders",
              href: "/decor-accessories/tabletop-decor/book-holders",
            },
            {
              label: "Cutlery Holders",
              href: "/decor-accessories/tabletop-decor/cutlery-holders",
            },
            {
              label: "Tray Plates",
              href: "/decor-accessories/tabletop-decor/tray-plates",
            },
          ],
        },
        {
          label: "DECOR OBJECTS",
          href: "/decor-accessories/decor-objects",
          subLinks: [
            {
              label: "Marble Pots",
              href: "/decor-accessories/decor-objects/marble-pots",
            },
            { label: "Vases", href: "/decor-accessories/decor-objects/vases" },
            {
              label: "Sculptural Decor Pieces",
              href: "/decor-accessories/decor-objects/sculptural-decor",
            },
          ],
        },
        {
          label: "LIFESTYLE ACCESSORIES",
          href: "/decor-accessories/lifestyle",
          subLinks: [
            {
              label: "Candle Holders",
              href: "/decor-accessories/lifestyle/candle-holders",
            },
            {
              label: "Storage Accessories",
              href: "/decor-accessories/lifestyle/storage-accessories",
            },
          ],
        },
      ],
      featured: [
        {
          collection: "RF SIGNATURE®",
          name: "MARBLE VASE",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/decor-accessories/decor-objects/vases",
        },
        {
          collection: "RF SIGNATURE®",
          name: "TRAY PLATE",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/decor-accessories/tabletop-decor/tray-plates",
        },
      ],
      shopAllLabel: "SHOP ALL DECOR",
      shopAllHref: "/decor-accessories",
    },
  },
  {
    label: "MARBLE COLLECTIONS",
    href: "/marble-collections",
    megaMenu: {
      label: "MARBLE COLLECTIONS",
      href: "/marble-collections",
      categories: [
        {
          label: "BY MARBLE TYPE",
          href: "/marble-collections/by-type",
          subLinks: [
            {
              label: "Carrara Collection",
              href: "/marble-collections/by-type/carrara",
            },
            {
              label: "Calacatta Collection",
              href: "/marble-collections/by-type/calacatta",
            },
            {
              label: "Emperador Collection",
              href: "/marble-collections/by-type/emperador",
            },
            {
              label: "Pakistani Marble Collection",
              href: "/marble-collections/by-type/pakistani",
            },
          ],
        },
        {
          label: "BY FINISH",
          href: "/marble-collections/by-finish",
          subLinks: [
            {
              label: "Polished Marble",
              href: "/marble-collections/by-finish/polished",
            },
            {
              label: "Honed Marble",
              href: "/marble-collections/by-finish/honed",
            },
            {
              label: "Textured / Matte Marble",
              href: "/marble-collections/by-finish/textured-matte",
            },
          ],
        },
        {
          label: "SIGNATURE SERIES",
          href: "/marble-collections/signature-series",
          subLinks: [
            {
              label: "RF Signature Marble Series",
              href: "/marble-collections/signature-series/rf-signature",
            },
            {
              label: "Custom One-of-One Pieces",
              href: "/marble-collections/signature-series/custom",
            },
          ],
        },
      ],
      featured: [
        {
          collection: "CARRARA®",
          name: "COLLECTION",
          image: PLACEHOLDER_IMAGES.bathtub,
          href: "/marble-collections/by-type/carrara",
        },
        {
          collection: "CALACATTA®",
          name: "COLLECTION",
          image: PLACEHOLDER_IMAGES.sideTable,
          href: "/marble-collections/by-type/calacatta",
        },
      ],
      shopAllLabel: "SHOP ALL COLLECTIONS",
      shopAllHref: "/marble-collections",
    },
  },
];
