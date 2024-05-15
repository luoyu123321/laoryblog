'use client';
import React, { Suspense } from 'react';

function ProgrammerInn({ }) {

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* <Suspense fallback={<Loading />}> */}
      <iframe
        id='ProgrammerInn'
        name='ProgrammerInn'
        width={'100%'}
        height={'99%'}
        src="https://cxy521.com/"
        sandbox="allow-forms allow-scripts"
      ></iframe>
      {/* </Suspense> */}
      <span className='nav-container-back-btn' onClick={() => { window.history.back() }}> 返回上一页 </span>
    </div >
  );
}

export default ProgrammerInn;