import React, { useState, useRef } from 'react';
import { Play, Heart, Share2, ShoppingBag, X } from 'lucide-react';
import VideoFeedItem from '../components/VideoFeedItem';
import '../components/StyleHub.css';

// Real Fashion & Perfume Videos (Pexels)
const STYLE_VIDEOS = [
    {
        id: 1,
        url: 'https://videos.pexels.com/video-files/5636069/5636069-hd_1080_1920_25fps.mp4',
        title: 'Runway Ready',
        description: 'Steal the spotlight with our new evening collection. #FashionWeek #EveningGown',
        likes: '12.5k',
        productId: 1,
        productImage: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=500&q=80',
        price: 2499
    },
    {
        id: 2,
        url: 'https://videos.pexels.com/video-files/4936302/4936302-hd_1080_1920_25fps.mp4',
        title: 'Summer Breeze',
        description: 'Lightweight linens for your next vacation. #SummerVibes #BeachWear',
        likes: '8.2k',
        productId: 2,
        productImage: 'https://images.unsplash.com/photo-1529139574466-a302d2052505?w=500&q=80',
        price: 1899
    },
    {
        id: 3,
        url: 'https://videos.pexels.com/video-files/6329432/6329432-hd_1080_1920_25fps.mp4',
        title: 'Street Craze',
        description: 'Urban aesthetics for the modern soul. #StreetWear #CityLife',
        likes: '15k',
        productId: 3,
        productImage: 'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=500&q=80',
        price: 3299
    },
    {
        id: 4,
        url: 'https://videos.pexels.com/video-files/4625624/4625624-hd_1080_1920_30fps.mp4',
        title: 'Signature Scent',
        description: 'Discover the new fragrance that defines you. #LuxuryPerfume #ScentOfLife',
        likes: '22k',
        productId: 4,
        productImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80',
        price: 4999
    }
];

export default function StyleHub() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    const handleScroll = () => {
        if (containerRef.current) {
            const scrollPosition = containerRef.current.scrollTop;
            const height = containerRef.current.clientHeight;

            if (height > 0) {
                const index = Math.round(scrollPosition / height);
                if (index !== activeIndex) {
                    setActiveIndex(index);
                }
            }
        }
    };

    return (
        <div className="style-hub-container" ref={containerRef} onScroll={handleScroll}>
            {STYLE_VIDEOS.map((video, index) => (
                <VideoFeedItem
                    key={video.id}
                    video={video}
                    isActive={index === activeIndex}
                />
            ))}
        </div>
    );
}
