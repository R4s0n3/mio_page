"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LoadingSpinner = () => {
  return (
    <div className="flex aspect-video w-full items-center justify-center">
      <DotLottieReact src="/data.json" loop autoplay />
    </div>
  );
};
export default LoadingSpinner;
