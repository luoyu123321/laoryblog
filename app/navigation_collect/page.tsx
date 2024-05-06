'use client';
import React from 'react';

function NavigationCollect({ }) {

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <iframe
        id='NavigationCollect'
        name='NavigationCollect'
        width={'100%'}
        height={'99%'}
        src="https://homepage-navigation.laory.cn"
      // sandbox="allow-same-origin allow-scripts"  // 会禁止里面url跳转
      ></iframe>
      <span className='nav-container-back-btn' onClick={() => { window.history.back() }}> 返回上一页 </span>
    </div >
  );
}

export default NavigationCollect;