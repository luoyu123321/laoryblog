
import React from 'react';
import { Flex } from 'antd';

interface HeaderProps {
  select: string,
  setSelect: (select: string) => void
}

const Header: React.FC<HeaderProps> = ({ select, setSelect }) => {

  return (
    <Flex gap="middle" vertical>
      <Flex justify='flex-end' align='center' className='header-nav' >
        <div key={1} style={baseStyle} ><span onClick={() => setSelect('home')} className={select === 'home' ? 'header-nav-active' : ''}>首页</span></div>
        <div key={2} style={baseStyle} ><span onClick={() => setSelect('blog')} className={select === 'blog' ? 'header-nav-active' : ''} >个人博客</span></div>
        <div key={3} style={baseStyle} ><span onClick={() => setSelect('tools')} className={select === 'tools' ? 'header-nav-active' : ''} >小工具</span></div>
        <div key={4} style={baseStyle} ><span onClick={() => setSelect('nav')} className={select === 'nav' ? 'header-nav-active' : ''} >前端导航集合</span></div>
        <div key={5} style={baseStyle} ><span onClick={() => setSelect('guestbook')} className={select === 'guestbook' ? 'header-nav-active' : ''} >留言板</span></div>
        <div key={6} style={baseStyle} ><span onClick={() => setSelect('questtest')} className={select === 'questtest' ? 'header-nav-active' : ''} >请求测试</span></div>
      </Flex>
    </Flex>
  );
};

export default Header;


const baseStyle: React.CSSProperties = {
  width: 'fit-content',
  marginRight: '50px',
  height: '100%',
};