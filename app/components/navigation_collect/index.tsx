import React, { useEffect } from 'react';

function NavigationCollect() {

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <iframe
        id='NavigationCollect'
        name='NavigationCollect'
        width={'100%'}
        height={'99%'}
        src="https://robin901118.gitee.io/homepage_navigation/"
        sandbox="allow-same-origin allow-scripts"
      ></iframe>
      <a href="/" className='nav-container-back-btn' onClick={() => {
        history.pushState(null, null, window.location.href);
        window.history.back();
      }}> 返回上一页 </a>
    </div>
  );
}

export default NavigationCollect;