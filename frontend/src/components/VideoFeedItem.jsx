import { useState, useRef, useEffect } from 'react';
import { Heart, Share2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StyleHub.css';

export default function VideoFeedItem({ video, isActive }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const navigate = useNavigate();

    // Handle auto-play when active
    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(e => console.log('Autoplay blocked/failed', e));
            }
        } else {
            videoRef.current.pause();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsPlaying(false);
        }
    }, [isActive]);

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
    };

    return (
        <div className="video-feed-item">
            <div className="video-wrapper" onClick={togglePlay}>
                <video
                    ref={videoRef}
                    src={video.url}
                    className="feed-video"
                    loop
                    muted={isMuted}
                    playsInline
                />
                {!isPlaying && (
                    <div className="play-overlay">
                        <div className="play-icon">▶</div>
                    </div>
                )}
                <button className="mute-btn" onClick={toggleMute}>
                    {isMuted ? '🔇' : '🔊'}
                </button>
            </div>

            <div className="feed-overlay">
                <div className="feed-info">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                </div>

                <div className="feed-actions">
                    <button className="action-btn">
                        <Heart size={28} />
                        <span>{video.likes}</span>
                    </button>
                    <button className="action-btn">
                        <Share2 size={28} />
                        <span>Share</span>
                    </button>
                    <button className="action-btn shop-btn" onClick={() => navigate(`/products/${video.productId}`)}>
                        <ShoppingBag size={24} />
                    </button>
                </div>
            </div>

            {/* Product Tag */}
            <div className="product-tag-bubble" onClick={() => navigate(`/products/${video.productId}`)}>
                <img src={video.productImage} alt="Product" />
                <div className="pt-info">
                    <span className="pt-name">Shop Look</span>
                    <span className="pt-price">₹{video.price}</span>
                </div>
                <div className="pt-arrow">→</div>
            </div>
        </div>
    );
}
