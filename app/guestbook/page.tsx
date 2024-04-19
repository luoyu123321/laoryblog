"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import { Button, Alert, Input, Card, message, Spin } from 'antd';
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
    console.log(11111111)
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
    getData();
  }, [])

  /**
   * 获取留言数据
   */
  const getData = () => {
    setGetLoading(true);
    fetch('/api/guestbook', {
      method: 'GET',
      headers: {
        'Cache-Control': 'max-age=120',
      },
    })
      .then(res => res.json())
      .then(({ guestbook = [] }) => {
        setGuestBookList(guestbook);
      })
      .catch(err => {
        <Alert message={err.message} type="error" />
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
        <Alert message={err.message} type="error" />
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
        <Input showCount style={{ width: '250px', marginRight: '10px' }} value={inputName} onChange={(e) => setInputName(e.target.value)} maxLength={10} placeholder="如何称呼您" prefix={<UserOutlined />} />
        <Input showCount style={{ width: '300px' }} value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} maxLength={30} placeholder="请输入联系方式，不会泄漏" prefix={<MailOutlined />} />
        <div>
          <TextArea showCount style={{ width: '560px', marginTop: '10px' }} value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} maxLength={200} rows={4} placeholder="您说两句" />
        </div>
        <Button style={{ width: '560px', marginTop: '20px' }} type="primary" onClick={add}>add</Button>
      </div>
    </Spin>
    <div className="requestTest-card-container" >
      {(getloading || postloading) && <Card type="inner" title={<span>name</span>} style={{ width: '100%' }} className="requestTest-card" loading={true}></Card>}
      {guestBookList.map(item => <Card
        key={item.id}
        type="inner"
        style={{ width: '100%' }}
        className="requestTest-card"
        title={<div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'normal' }} >
          <span>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.name}</span>
            <span style={{ marginLeft: '10px', fontSize: '12px', color: '#8f8f8f' }} >{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
          </span>
          <span>{item.email.length > 8 ? `${item.email.slice(0, 2)}***${item.email.slice(-4)}` :
            item.email.length > 4 ? `${item.email.slice(0, 1)}***${item.email.slice(-3)}` : `***`}</span>
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