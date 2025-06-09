"use client";

import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface LogoProps {
  bodyColour?: string;
  eyeColour?: string;
  hoverBodyColour?: string;
  hoverEyeColour?: string;
  animate?: boolean;
  className?: string;
  size?: number;
}

export default function Logo({
  bodyColour = "#3ebdc7",
  eyeColour,
  hoverBodyColour = "#3ebdc7",
  hoverEyeColour,
  animate = false,
  className,
  size = 48,
}: LogoProps) {
  const finalEyeColour = eyeColour || "var(--color-eyes)";
  const finalHoverEyeColour = hoverEyeColour || "var(--color-eyes)";
  return (
    <svg
      className={twMerge(
        clsx(
          "logo-container",
          animate
            ? "transition-all duration-300 ease-in-out hover:scale-105"
            : ""
        ),
        className
      )}
      width={size}
      height={(size * 595) / 500}
      viewBox="0 0 500 595"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <style>
        {`
          .logo-body { fill: ${bodyColour}; transition: fill 0.3s ease; }
          .logo-eyes { fill: ${finalEyeColour}; transition: fill 0.3s ease; }
          .logo-container:hover .logo-body { fill: ${hoverBodyColour}; }
          .logo-container:hover .logo-eyes { fill: ${finalHoverEyeColour}; }
        `}
      </style>
      <g>
        <g id="body">
          <path
            className="logo-body"
            d="M439.77,205.64v-73.88c0-38.66-31.34-70-70-70H131.19c-38.66,0-70,31.34-70,70v73.88c0,38.66,31.34,70,70,70h238.58
            C408.43,275.64,439.77,244.3,439.77,205.64z M479.6,405.31c-10.88,19.26-30.93,42.06-52.31,67.32
            c-21.38,25.26-69.61,62.17-101.44,81.89c-31.83,19.71-80.63,33.71-100.52,38.41c-19.89,4.69-24.72-14.36-17.89-20.81
            c6.82-6.45,27.58-29.57,41.77-49.51c14.19-19.93,17.42-39.09,17.8-46.82c0.37-7.72-0.12-11.63-13.67-11.99
            c-13.55-0.36-131.09-1.97-131.09-1.97c-66.27,0-120-53.73-120-120V121.85c0-66.27,53.73-120,120-120h255.51
            c66.27,0,120,53.73,120,120v219.99C497.75,365.15,491.11,386.9,479.6,405.31"
          />
        </g>
        <g id="eyes">
          <circle className="logo-eyes" cx="154.79" cy="170.19" r="40" />
          <circle className="logo-eyes" cx="344.43" cy="170.19" r="40" />
        </g>
      </g>
    </svg>
  );
}
