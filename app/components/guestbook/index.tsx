"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import { Button, Alert, Input, Card, message } from 'antd';
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
  const [getloading, setGetLoading] = useState<boolean>(true);
  const [postloading, setPostLoading] = useState<boolean>(false);

  const ipRef = useRef<string>('');

  useEffect(() => {
    // 获取当前操作人ip
    fetch('https://ipinfo.io/json')
      .then(response => response.json())
      .then(data => {
        ipRef.current = data;
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // fetch('http://ip-api.com/json/')
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('IP地址: ' + data.query);
    //     console.log('国家: ' + data.country);
    //     console.log('地区: ' + data.regionName);
    //     console.log('城市: ' + data.city);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
    getData();
  }, [])

  /**
   * 获取留言数据
   */
  const getData = () => {
    setGetLoading(true);
    fetch('/api/guestbook', {
      method: 'GET'
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
      return <Alert message={'请输入阁下大名'} type="error" />
    }
    if (!inputMessage) {
      return <Alert message={'请输入留言'} type="error" />
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
    <div style={{ margin: '20px 0' }} >
      <Input showCount style={{ width: '250px', marginRight: '10px' }} value={inputName} onChange={(e) => setInputName(e.target.value)} maxLength={10} placeholder="请输入您的名号" prefix={<UserOutlined />} />
      <Input showCount style={{ width: '300px' }} value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} maxLength={30} placeholder="请输入联系方式" prefix={<MailOutlined />} />
      <div>
        <TextArea showCount style={{ width: '560px', marginTop: '10px' }} onChange={(e) => setInputMessage(e.target.value)} maxLength={200} rows={4} placeholder="说两句呗" />
      </div>
      <Button style={{ width: '560px', marginTop: '20px' }} type="primary" onClick={add}>add</Button>
    </div>
    <div className="requestTest-card-container" >
      {(getloading || postloading) && <Card type="inner" title={<span>Card title</span>} style={{ width: '100%' }} className="requestTest-card" loading={true}></Card>}
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
          <span>{item.email}</span>
          <span>{'IP：' + item.ip?.city}</span>
        </div>}
      >
        <div>{item.message}</div>
      </Card>)
      }
    </div >
  </div >
}

export default Guestbook