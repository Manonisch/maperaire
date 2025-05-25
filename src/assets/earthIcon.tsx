import { SVGProps } from "react";

export const EarthIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 741 741"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinejoin: "round",
        strokeMiterlimit: "2",
        strokeWidth: "40px",
      }}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <circle cx="370.144" cy="370.144" r="350" />
      <path d="M430.144,30.144c0,0 -70,143.333 -70,200c0,52.175 70,140 70,140c0,0 1.953,84.949 30,80c28.333,-5 125,-55 150,-90c19.471,-27.26 -11.667,-96.667 0,-120c10.75,-21.499 60,-40 60,-40" />
      <path d="M100.144,490.144c21.667,-9.965 63.333,-48.125 80,-39.792c16.667,8.334 0.027,66.525 20,89.792c20,23.299 91.667,23.333 100,50c8.333,26.667 -50,110 -50,110c0,0 -137.276,-47.033 -200,-190c-7.809,-17.799 33.692,-12.499 50,-20Z" />
      <path d="M139.483,239.422c7.646,-17.889 -0.964,-47.192 12.983,-56.901c13.947,-9.709 59.71,-21.18 70.698,-1.352c10.987,19.828 -81.799,73.943 2.974,155.535c12.244,11.784 -117.888,-24.207 -86.655,-97.282Z" />
    </svg>
  );
};
