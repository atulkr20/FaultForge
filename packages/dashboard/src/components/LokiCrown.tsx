import React from "react";

export const LokiCrown = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glow filter definition */}
      <defs>
        <filter id="crown-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g filter="url(#crown-glow)">
        {/* The Horns - Elegant, curved, and sharp */}
        <path
          d="M30 65C25 55 15 40 15 25C15 15 25 10 35 15C30 20 28 30 30 40C35 30 45 25 50 25C55 25 65 30 70 40C72 30 70 20 65 15C75 10 85 15 85 25C85 40 75 55 70 65"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner detail lines for tech feel */}
        <path
          d="M40 45C42 40 45 38 50 38C55 38 58 40 60 45"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Crown Base - Modern/Industrial */}
        <path
          d="M25 70H75L80 85H20L25 70Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Central Core Point */}
        <path d="M50 60L54 70H46L50 60Z" fill="currentColor" className="animate-pulse" />

        {/* Bottom Detail */}
        <path
          d="M35 78H65"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.5"
        />
      </g>
    </svg>
  );
};
