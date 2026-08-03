export interface Project {
  id: string;
  title: string;
  location: string;
  year: string;
  category: string;
  description: string;
  coverImage: string;
  images: string[];
  aspect: string;
}

export const projects: Project[] = [
  {
    id: "sweden-melody",
    title: "Sweden Melody",
    location: "Paris, France",
    year: "2019",
    category: "Interior Design",
    description:
      "A harmonious blend of Scandinavian minimalism and Parisian elegance. This project focuses on creating a serene environment using natural light, soft textures, and a muted color palette. The space is designed to promote relaxation and well-being, with carefully curated furniture and decor that reflect a modern yet timeless aesthetic.",
    coverImage: "/assets/project-1.jpg",
    images: [
      "/assets/project-1.jpg",
      "/assets/project-2.jpg",
      "/assets/project-3.jpg",
    ],
    aspect: "aspect-[1278/1400]",
  },
  {
    id: "modern-mix",
    title: "Modern Mix",
    location: "Madrid, Spain",
    year: "2025",
    category: "Residential",
    description:
      "An eclectic mix of modern design elements and traditional Spanish architecture. This project features bold colors, geometric patterns, and a fusion of materials that create a vibrant and dynamic living space. The design celebrates individuality and creativity, offering a unique visual experience in every room.",
    coverImage: "/assets/project-2.jpg",
    images: [
      "/assets/project-2.jpg",
      "/assets/project-3.jpg",
      "/assets/project-1.jpg",
    ],
    aspect: "aspect-[1278/1500]",
  },
  {
    id: "airy-cave",
    title: "Airy Cave",
    location: "Amsterdam, Netherlands",
    year: "2023",
    category: "Commercial",
    description:
      "Transforming a compact space into an open and airy environment. This project utilizes clever spatial planning and lighting techniques to maximize the perception of space. The design concept revolves around the idea of a 'cave' that is bright, welcoming, and functional, providing a cozy retreat within the bustling city.",
    coverImage: "/assets/project-3.jpg",
    images: [
      "/assets/project-3.jpg",
      "/assets/project-1.jpg",
      "/assets/project-2.jpg",
    ],
    aspect: "aspect-[1278/1300]",
  },
  {
    id: "wood-harmony",
    title: "Wood Harmony",
    location: "Copenhagen, Denmark",
    year: "2020",
    category: "Interior Design",
    description:
      "A celebration of wood as a primary material. This project showcases the warmth and versatility of timber in modern architecture. From structural elements to bespoke furniture, wood is used to create a cohesive and inviting atmosphere that connects the interior with the natural world.",
    coverImage: "/assets/project-2.jpg",
    images: [
      "/assets/project-2.jpg",
      "/assets/project-3.jpg",
      "/assets/project-1.jpg",
    ],
    aspect: "aspect-[1278/1400]",
  },
  {
    id: "light-symphony",
    title: "Light Symphony",
    location: "Milan, Italy",
    year: "2022",
    category: "Lighting Design",
    description:
      "An exploration of light and shadow. This project focuses on how lighting can transform a space, creating different moods and highlighting architectural features. The design incorporates both natural and artificial light sources to orchestrate a visual symphony that evolves throughout the day.",
    coverImage: "/assets/project-3.jpg",
    images: [
      "/assets/project-3.jpg",
      "/assets/project-2.jpg",
      "/assets/project-1.jpg",
    ],
    aspect: "aspect-[1278/1500]",
  },
  {
    id: "urban-zen",
    title: "Urban Zen",
    location: "Oslo, Norway",
    year: "2024",
    category: "Residential",
    description:
      "Finding peace in the urban jungle. This project creates a tranquil sanctuary amidst the noise of the city. Minimalist design, soundproofing, and the integration of indoor plants contribute to a sense of calm and balance, offering a respite from the fast-paced urban lifestyle.",
    coverImage: "/assets/project-1.jpg",
    images: [
      "/assets/project-1.jpg",
      "/assets/project-3.jpg",
      "/assets/project-2.jpg",
    ],
    aspect: "aspect-[1278/1300]",
  },
];
