"use client"
import React, { useEffect, useState } from 'react';
import { Layout, Flex } from 'antd';
const { Header, Content } = Layout;
import HeaderContent from './header';
import RequestTest from './requestTest';
import NavigationCollect from './navigation_collect';

const App: React.FC = () => {

  const [select, setSelect] = useState<string>('nav');
  const [windowHeights, setWindowHeights] = useState<number>(1320);

  useEffect(() => {
    setWindowHeights(window.innerHeight);
    window.onresize = () => {
      setWindowHeights(window.innerHeight)
    };
  }, [])


  return (
    <Flex gap="middle" wrap="wrap">
      <Layout className='main-layout' style={layoutStyle}>
        <Header style={headerStyle}><HeaderContent select={select} setSelect={setSelect} /></Header>
        <Content style={{ ...contentStyle, height: windowHeights - 64 }}>
          {select === 'nav' && <NavigationCollect />}
          {select === 'questtest' && <RequestTest />}
        </Content>
      </Layout>
    </Flex>
  );
}

export default App;

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
  color: '#fff',
  backgroundColor: '#f8fafc',
};

const layoutStyle = {
};