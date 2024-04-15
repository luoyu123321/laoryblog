"use client"
import React from 'react';
import { Layout, Flex } from 'antd';
const { Header, Footer, Content } = Layout;
import HeaderContent from './header';
import CenterContent from './requestTest';

const App: React.FC = () => (
  <Flex gap="middle" wrap="wrap">
    <Layout className='main-layout' style={layoutStyle}>
      <Header style={headerStyle}><HeaderContent /></Header>
      <Content style={contentStyle}><CenterContent /></Content>
    </Layout>
  </Flex>
);

export default App;

const headerStyle: React.CSSProperties = {
  
  position: 'sticky',
  top: 0,
  textAlign: 'center',
  color: 'black',
  height: '6vh',
  padding: 0,
  lineHeight: '64px',
  backgroundColor: '#fff',
  boxShadow: '0px 2px 5px 3px rgba(0, 0, 0, 0.3)',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  height: '94vh',
  overflow:'auto',
  color: '#fff',
  backgroundColor: '#d3e3fd',
};

const layoutStyle = {
};