import React from 'react';
import preloader from '../preloader.gif';

function Loader() {
  const preloaderStyle = {
    background: `url(${preloader}) no-repeat center`,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={{backgroundColor:'white'}}>
      <div style={preloaderStyle}>

      </div>
    </div>
  );
}

export default Loader;