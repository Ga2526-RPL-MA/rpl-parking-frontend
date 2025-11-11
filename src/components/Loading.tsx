"use client";

import { ThreeCircles } from "react-loader-spinner";

function LoadingAnimation() {
  return (
    <div className="flex h-screen w-full items-center justify-center py-16 sm:py-20">
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#155dfc"
        ariaLabel="three-circles-loading"
        wrapperClass="size-24 md:28 xl:32"
      />
    </div>
  );
}

export default LoadingAnimation;
