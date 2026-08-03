// "use client";

// import { useState } from "react";
// import Navigation from "@/components/navigation";
// import CollectionPage from "@/components/collection-page";

// interface CollectionPageRouteProps {
//   params: {
//     category: string;
//   };
// }

// export default function CollectionPageRoute({
//   params,
// }: CollectionPageRouteProps) {
//   const [selectedCategory, setSelectedCategory] = useState(params.category);

//   return (
//     <div className="min-h-screen bg-white">
//       <Navigation onCategorySelect={setSelectedCategory} />
//       <CollectionPage category={selectedCategory} />
//     </div>
//   );
// }
