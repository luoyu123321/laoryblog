"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import { Button, Input, Card, message, Spin, Flex } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

import moment from 'moment';

const { TextArea } = Input;

interface guestbookProps {
}

const Guestbook: FC<guestbookProps> = ({ }) => {

  const [guestBookList, setGuestBookList] = useState<{ id: number, name: string, email: string, ip: any, message: string, createdAt: string }[]>([]);
  const [inputName, setInputName] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [getloading, setGetLoading] = useState<boolean>(false);
  const [postloading, setPostLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const ipRef = useRef<string>('');

  useEffect(() => {
    // 获取当前操作人ip
    fetch('https://ipinfo.io/json', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=30',
      },
    })
      .then(response => response.json())
      .then(data => {
        ipRef.current = data;
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // 优化初始化数据获取，当前页面缓存数据，如果存在则直接使用缓存数据
    const cachedData = sessionStorage.getItem('cachedGuestBook');
    if (cachedData?.length > 0) {
      setGuestBookList(JSON.parse(cachedData));
    } else {
      getData();
    };
  }, [])


  /**
   * 获取留言数据
   */
  const getData = () => {
    setGetLoading(true);
    fetch('/api/guestbook', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(({ guestbook = [] }) => {
        const cachedData = guestbook.map(item=>{
          return {
            ...item,
            email:item.email.length > 8 ? `${item.email.slice(0, 2)}***${item.email.slice(-4)}` :
            item.email.length > 4 ? `${item.email.slice(0, 1)}***${item.email.slice(-3)}` : `***`,
          }
        })
        setGuestBookList(cachedData);
        sessionStorage.setItem('cachedGuestBook', JSON.stringify(cachedData));
      })
      .catch(err => {
        messageApi.open({
          type: 'error',
          content: err.message,
          duration: 2,
          style: {
            fontSize: '18px',
            marginTop: '20vh',
          },
        });
      })
      .finally(() => setGetLoading(false))
  }

  /**
   * 添加留言数据
   */
  const add = () => {
    if (!inputName) {
      messageApi.open({
        type: 'warning',
        content: '请输入阁下大名',
        duration: 2,
        style: {
          fontSize: '18px',
          marginTop: '20vh',
        },
      });
      return;
    }
    if (!inputMessage) {
      messageApi.open({
        type: 'warning',
        content: '请输入留言再提交',
        duration: 2,
        style: {
          fontSize: '18px',
          marginTop: '20vh',
        },
      });
      return;
    }
    setPostLoading(true);
    fetch('/api/guestbook', {
      method: 'POST',
      body: JSON.stringify({
        name: inputName,
        email: inputEmail,
        message: inputMessage,
        ip: ipRef.current,
      })
    })
      .then(() => {
        getData();
        resetData();
        messageApi.open({
          type: 'success',
          content: '添加成功',
          duration: 1.5,
          style: {
            fontSize: '18px',
            marginTop: '20vh',
          },
        });
      })
      .catch(err => {
        messageApi.open({
          type: 'error',
          content: err.message,
          duration: 2,
          style: {
            fontSize: '18px',
            marginTop: '20vh',
          },
        });
      })
      .finally(() => setPostLoading(false))
  }

  const resetData = () => {
    setInputName('');
    setInputEmail('');
    setInputMessage('');
  }

  return <div>
    <Spin spinning={postloading}>
      <div style={{ margin: '20px 0' }} >
        <Flex justify='center' align='center' wrap="wrap" gap='10px'>
        <Input showCount className="guestbook-search"  value={inputName} onChange={(e) => setInputName(e.target.value)} maxLength={10} placeholder="如何称呼您" prefix={<UserOutlined />} />
        <Input showCount className="guestbook-search"  value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} maxLength={30} placeholder="请输入联系方式，不会泄漏" prefix={<MailOutlined />} />
        </Flex>
        <div>
          <TextArea className="guestbook-search-textarea" showCount value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} maxLength={200} rows={4} placeholder="您说两句" />
        </div>
        <Button className="guestbook-search-btn" type="primary" onClick={add}>add</Button>
      </div>
    </Spin>
    <div className="guestbook-card-container" >
      {(getloading || postloading) && <Card type="inner" title={<span>name</span>} style={{ width: '100%' }} className="guestbook-card" loading={true}></Card>}
      {guestBookList.map(item => <Card
        key={item.id}
        type="inner"
        style={{ width: '100%' }}
        className="guestbook-card"
        title={<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal' }} >
          <span>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</span>
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#8f8f8f' }} >{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          </span>
          {/* <span>{item.email}</span> */}
          <span>{'IP：' + item.ip?.city}</span>
        </div>}
      >
        <div>{item.message}</div>
      </Card>)
      }
    </div >
    {contextHolder}
  </div >
}

export default Guestbook