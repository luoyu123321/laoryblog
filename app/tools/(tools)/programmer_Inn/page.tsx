'use client';
import React from 'react';

function ProgrammerInn({ }) {

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <iframe
        id='ProgrammerInn'
        name='ProgrammerInn'
        width={'100%'}
        height={'99%'}
        src="http://cxy521.com/"
      ></iframe>
      <span className='nav-container-back-btn' onClick={() => { window.history.back() }}> 返回上一页 </span>
    </div >
  );
}

export default ProgrammerInn;