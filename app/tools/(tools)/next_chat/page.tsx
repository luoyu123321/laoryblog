'use client';
import React from 'react';

function NextChat({ }) {

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <iframe
        id='NextChat'
        name='NextChat'
        width={'100%'}
        height={'99%'}
        src="https://chatgpt.laory.cn"
      ></iframe>
      <span className='nav-container-back-btn' onClick={() => { window.history.back() }}> 返回上一页 </span>
    </div >
  );
}

export default NextChat;