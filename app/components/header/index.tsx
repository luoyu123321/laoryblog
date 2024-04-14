
import React from 'react';
import { Flex } from 'antd';


const App: React.FC = () => {

  return (
    <Flex gap="middle" vertical>
      <Flex vertical={false}>
        <div key={1} style={baseStyle} ><span className='header-nav' >首页</span></div>
        <div key={2} style={baseStyle} ><span className='header-nav' >个人博客</span></div>
        <div key={3} style={baseStyle} ><span className='header-nav' >小工具</span></div>
        <div key={4} style={baseStyle} ><span className='header-nav' >前端导航集合</span></div>
        <div key={5} style={baseStyle} ><span className='header-nav' >留言板</span></div>
      </Flex>
    </Flex>
  );
};

export default App;


const baseStyle: React.CSSProperties = {
  width: '20%',
  height: '100%',
};