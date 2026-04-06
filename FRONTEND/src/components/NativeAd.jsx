import React, { useEffect, useRef } from 'react';

const NativeAd = ({ id }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const script = document.createElement('script');
      script.src = `https://pantomimemailman.com/${id}/invoke.js`;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');

      const container = document.createElement('div');
      container.id = `container-${id}`;

      adRef.current.appendChild(script);
      adRef.current.appendChild(container);
    }
  }, [id]);

  return (
    <div 
      className="flex justify-center items-center my-6 overflow-hidden w-full" 
      ref={adRef} 
    />
  );
};

export default NativeAd;
