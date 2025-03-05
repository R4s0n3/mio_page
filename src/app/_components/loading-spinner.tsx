'use client'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingSpinner = () => {
  return (
    <div className='w-full flex justify-center items-center aspect-video'>
    <DotLottieReact
      src="/data.json"
      loop
      autoplay
      />
      </div>
  );
};
export default LoadingSpinner