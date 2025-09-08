import React from "react";
import "@lottiefiles/lottie-player"; // Needed to use the custom element

const HeroLottie = () => (
  <div>
    <lottie-player
      src="https://lottie.host/8de47178-8b47-43e5-87a0-605a23f917d5/8cxiwRFirL.json"
      background="transparent"
      speed="0.5"
      style={{ width: "500px", height: "500px" }}
      loop
      autoplay
      direction="1"
      mode="normal"
    ></lottie-player>
  </div>
);

export default HeroLottie;

