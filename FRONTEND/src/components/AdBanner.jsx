import React, { useEffect, useRef } from 'react';

const AdBanner = ({ id, width, height, format = 'iframe', className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const script = document.createElement('script');
      const confScript = document.createElement('script');
      
      confScript.innerHTML = `
        atOptions = {
          'key' : '${id}',
          'format' : '${format}',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      
      script.src = `//pantomimemailman.com/${id}/invoke.js`;
      script.async = true;

      adRef.current.appendChild(confScript);
      adRef.current.appendChild(script);
    }
  }, [id, width, height, format]);

  return (
    <div 
      className={`flex justify-center items-center my-4 overflow-hidden ${className}`} 
      ref={adRef} 
      style={{ minHeight: height, minWidth: width }}
    />
  );
};

export default AdBanner;
