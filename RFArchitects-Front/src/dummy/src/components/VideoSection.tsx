import { useState } from "react";
import { Play } from "lucide-react";

// Import multiple videos from assets
const videos = [
    {
        id: 1,
        title: "Modern Living Space",
        subtitle: "Contemporary Design",
        videoSrc: "/src/assets/videos/WhatsApp Video 2025-12-01 at 15.28.36_2fa48077.mp4"
    },
    {
        id: 2,
        title: "Elegant Dining",
        subtitle: "Luxury Interiors",
        videoSrc: "/src/assets/videos/WhatsApp Video 2025-12-01 at 15.28.35_be3c1088.mp4"
    },
    {
        id: 3,
        title: "Cozy Bedroom",
        subtitle: "Comfort & Style",
        videoSrc: "/src/assets/videos/WhatsApp Video 2025-12-01 at 15.28.34_80ebc08a.mp4"
    }
];

export default function VideoSection() {
    const [activeVideo, setActiveVideo] = useState<number | null>(null);

    return (
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6 bg-white">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-light text-gray-900 mb-4">
                        HEAR FROM THE COMMUNITY
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Check out our wall of love where <span className="text-black font-medium">RF Architects</span> community members share highlights of their homes.
                    </p>
                </div>

                {/* Video Grid - Larger aspect ratio */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg bg-gray-100 aspect-[4/3]"
                            onClick={() => setActiveVideo(video.id)}
                        >
                            {/* Clean Background - No Image */}
                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100" />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                    <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
                                </div>
                            </div>

                            {/* Text Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                                <h3 className="text-xl font-bold uppercase tracking-wide text-white">{video.title}</h3>
                                <p className="text-sm text-gray-200">{video.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Video Modal */}
                {activeVideo && (
                    <div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setActiveVideo(null)}
                    >
                        <div className="relative w-full max-w-4xl aspect-video">
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="absolute -top-12 right-0 text-white text-4xl hover:text-gray-300"
                            >
                                ×
                            </button>
                            <video
                                src={videos.find(v => v.id === activeVideo)?.videoSrc}
                                controls
                                autoPlay
                                className="w-full h-full rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
