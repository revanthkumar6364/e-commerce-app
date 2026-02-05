import './logo.css';

export default function Logo() {
  return (
    <div className="logo-container">
      <svg
        className="logo-svg"
        viewBox="0 0 280 70"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Premium Gradients & Filters */}
        <defs>
          {/* Animated Gradient */}
          <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="gradient-stop-1">
              <animate attributeName="stop-color" values="#ff3f6c;#ff905a;#ff3f6c" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" className="gradient-stop-2">
              <animate attributeName="stop-color" values="#ff905a;#ffd700;#ff905a" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" className="gradient-stop-3">
              <animate attributeName="stop-color" values="#ff3f6c;#ff905a;#ff3f6c" dur="3s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Shimmer Gradient */}
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
            <stop offset="100%" stopColor="transparent" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="2s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Premium Shadow */}
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Decorative Circle Background */}
        <circle cx="30" cy="35" r="32" fill="url(#premiumGradient)" opacity="0.1" className="pulse-circle">
          <animate attributeName="r" values="30;34;30" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Premium Shopping Bag Icon */}
        <g transform="translate(8, 15)" className="logo-icon" filter="url(#glow)">
          {/* Bag body with gradient */}
          <rect x="10" y="18" width="24" height="28" rx="3"
            fill="url(#premiumGradient)"
            opacity="0.95"
            className="bag-body">
            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
          </rect>

          {/* Bag handle */}
          <path
            d="M 16 18 Q 16 8, 22 8 Q 28 8, 28 18"
            stroke="url(#premiumGradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="bag-handle"
          />

          {/* Star accent */}
          <path d="M 22 25 L 23 27 L 25 27 L 23.5 28.5 L 24 30 L 22 29 L 20 30 L 20.5 28.5 L 19 27 L 21 27 Z"
            fill="#ffffff"
            opacity="0.6"
            className="star-sparkle">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
          </path>

          {/* Shimmer overlay */}
          <rect x="10" y="18" width="24" height="28" rx="3"
            fill="url(#shimmer)"
            className="shimmer-overlay" />
        </g>

        {/* Text - URBAN VIBE with Premium Styling */}
        <g className="logo-text-group">
          <text
            x="60"
            y="38"
            fontFamily="'Poppins', 'Inter', 'Segoe UI', Arial, sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="#1a1a2e"
            letterSpacing="-1"
            className="text-urban"
          >
            URBAN
          </text>
          <text
            x="155"
            y="38"
            fontFamily="'Poppins', 'Inter', 'Segoe UI', Arial, sans-serif"
            fontSize="26"
            fontWeight="900"
            fill="url(#premiumGradient)"
            letterSpacing="-1"
            filter="url(#glow)"
            className="text-vibe"
          >
            VIBE
          </text>

          {/* Premium Badge */}
          <g transform="translate(240, 18)">
            <circle cx="0" cy="0" r="10" fill="url(#premiumGradient)" opacity="0.2" />
            <circle cx="0" cy="0" r="8" fill="url(#premiumGradient)">
              <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="0" y="4"
              fontFamily="Arial"
              fontSize="10"
              fontWeight="900"
              fill="white"
              textAnchor="middle">
              ✦
            </text>
          </g>

          {/* Tagline with animation */}
          <text
            x="60"
            y="52"
            fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
            fontSize="9"
            fontWeight="600"
            letterSpacing="2"
            className="tagline"
          >
            <tspan fill="#94969f">LUXURY</tspan>
            <tspan fill="#ff3f6c" dx="5">•</tspan>
            <tspan fill="#94969f" dx="5">FASHION</tspan>
            <tspan fill="#ff3f6c" dx="5">•</tspan>
            <tspan fill="#94969f" dx="5">STYLE</tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}
