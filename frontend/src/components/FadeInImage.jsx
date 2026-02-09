import { useState } from 'react';

export default function FadeInImage({ src, alt, className, style, onClick }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`fade-in-wrapper ${className || ''}`} style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }} onClick={onClick}>
            {!loaded && (
                <div
                    className="skeleton-loader"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: 'inherit' // Inherit border radius from parent/image
                    }}
                />
            )}
            <img
                src={src}
                alt={alt}
                className={className}
                style={{
                    ...style,
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                onLoad={() => setLoaded(true)}
            />
            <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
        </div>
    );
}
