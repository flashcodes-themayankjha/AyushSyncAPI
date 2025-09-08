import React from 'react';

const Spot = ({ className, style }) => {
  return <div className={`absolute rounded-full ${className}`} style={style}></div>;
};

export default Spot;
