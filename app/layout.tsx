'use client'
import React, { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Flex } from 'antd';
const { Header, Content } = Layout;
import HeaderContent from './components/header';
import Loading from './components/css_cool_loading';

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [load, setLoad] = useState<boolean>(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      setLoad(false);
    }, 2000)
  }, [])

  return (
    <html lang="en">
      <body style={{ margin: 0 }} className={inter.className}>
        <AntdRegistry>
          <Flex gap="middle" wrap="wrap">
            <Layout className='main-layout' style={layoutStyle}>
              {load && <Loading />}
              <Header style={headerStyle}><HeaderContent /></Header>
              <Content style={contentStyle}>
                {children}
              </Content>
            </Layout>
          </Flex>
        </AntdRegistry>
      </body>
    </html>
  );
}



const headerStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  textAlign: 'center',
  color: 'black',
  height: '64px',
  padding: 0,
  lineHeight: '64px',
  backgroundColor: '#fff',
  boxShadow: '0px 2px 5px 3px rgba(0, 0, 0, 0.3)',
  zIndex: 1010,
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  width: '100%',
  overflow: 'auto',
  backgroundColor: '#f8fafc',
};

const layoutStyle = {
  width: '100%',
  height: '100vh',
};