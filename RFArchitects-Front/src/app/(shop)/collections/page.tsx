import { collections as mockCollections } from "@/lib/collections";
import Link from "next/link";

export const dynamic = 'force-static';

export default function Collections() {
    const activeCollections = mockCollections;

    return (
        <div className="min-h-screen bg-white">

            <div className="px-6 py-12 border-b border-gray-200">
                <h1 className="text-4xl font-light mb-4">Collections</h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    Browse our curated collections by category.
                </p>
            </div>

            <div className="px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeCollections.map((collection: any) => (
                        <Link
                            key={collection.slug}
                            href={`/collections/${collection.slug}`}
                            className="group block"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-4">
                                <img
                                    src={collection.coverImage || collection.image || "/placeholder.svg"}
                                    alt={collection.name}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                                {collection.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                View Collection &rarr;
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}
