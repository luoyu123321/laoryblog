
'use client';
import React from 'react';
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Flex } from 'antd';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({ }) => {
  const pathname = usePathname()

  return (
    <Flex gap="middle" vertical>
      <Flex justify='flex-end' align='center' className='header-nav' >
        <div style={baseStyle} ><Link href={'/'}><span className={pathname === '/' ? 'header-nav-active' : ''}>首页</span></Link></div>
        {navList.map((item, index) =>
          <div key={index} style={baseStyle} ><Link href={item.url} prefetch={true} ><span className={pathname.startsWith(item.url) ? 'header-nav-active' : ''}> {item.name}</span></Link></div>)
        }
      </Flex>
    </Flex>
  );
};

export default Header;

/**
 * 导航栏
 */
const navList = [{
  name: '个人博客',
  url: '/blog'
}, {
  name: '小工具',
  url: '/tools'
}, {
  name: '前端导航集合',
  url: '/navigation_collect'
}, {
  name: '留言板',
  url: '/guestbook'
}, {
  name: '请求测试',
  url: '/requesttest'
}];

const baseStyle: React.CSSProperties = {
  width: 'fit-content',
  marginRight: '1.5rem',
  height: '100%',
};