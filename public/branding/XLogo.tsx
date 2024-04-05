import { cn } from "@/lib/helper";
import React from "react";

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      className={cn(className)}
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_385_80"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="17"
        height="16"
      >
        <path d="M0.791016 0H16.791V16H0.791016V0Z" fill="white" />
      </mask>
      <g mask="url(#mask0_385_80)">
        <path
          d="M13.391 0.75H15.8447L10.4847 6.89171L16.791 15.2506H11.8539L7.98416 10.182L3.5613 15.2506H1.1053L6.83787 8.67914L0.791016 0.751143H5.85387L9.34645 5.38314L13.391 0.75ZM12.5282 13.7786H13.8882L5.11102 2.14543H3.65273L12.5282 13.7786Z"
          fill="#6039B5"
        />
      </g>
    </svg>
  );
}

export default XLogo;
