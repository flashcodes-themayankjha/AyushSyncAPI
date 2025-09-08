
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SplashScreen = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
      <DotLottieReact
        src="https://lottie.host/2e516593-d759-4bfc-a439-d53f3ab0f5e4/ts8pGZtstD.lottie"
        loop
        autoplay
        style={{ width: '300px', height: '300px' }}
      />
    </div>
  );
};

export default SplashScreen;
