
'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DownOutlined } from '@ant-design/icons';
import { Flex, Dropdown, Space } from 'antd';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({ }) => {

  const [isInit, setIsInit] = useState<boolean>(true)
  const [showNbr, setShowNbr] = useState<number>(0)
  const [items, setItems] = useState<any[]>(navList.map((item, index) => {
    return {
      key: index,
      label: <Link href={item.url} prefetch={true} >{item.name}</Link>,
      url: item.url
    }
  }))

  const pathname = usePathname()

  useEffect(() => {
    const width = window.innerWidth;
    const nbr =
      width < 300 ? 0 :
        width < 400 ? 1 :
          width < 500 ? 2 :
            width < 600 ? 4 : 10;
    setShowNbr(nbr)
    setItems(items.slice(nbr, 100))
    setIsInit(false)
  }, [])


  return (
    <Flex gap="middle" vertical>
      <Flex justify='center' wrap="wrap" gap="40px" align='center' className='header-nav' >
        <div><Link href={'/'}><span className={pathname === '/' ? 'header-nav-active' : ''}>首页</span></Link></div>
        {navList.slice(0, showNbr).map((item, index) =>
          <div key={index}><Link href={item.url} prefetch={true} ><span className={pathname.startsWith(item.url) ? 'header-nav-active' : ''}> {item.name}</span></Link></div>)
        }

        {(showNbr < 10 && !isInit) && <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <span style={{ fontSize: '16px' }} className={items.some(item => pathname.startsWith(item.url)) ? 'header-nav-active' : ''}>
                更多
              </span>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>}
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
  url: '/request_test'
}];
