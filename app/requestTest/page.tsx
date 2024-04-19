"use client";
import React, { FC, useEffect, useState } from "react";
import { Button, Alert, Input, Card } from 'antd';
import { UserOutlined, WechatOutlined } from '@ant-design/icons';

import moment from 'moment';

interface mainProps {
}

const RequestTest: FC<mainProps> = ({ }) => {

  const [userData, setUserData] = useState<{ id: number, name: string, email: string, createdAt: string }[]>([]);
  const [inputName, setInputName] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<string>('');
  const [num, setNum] = useState<number>(1);
  const [getloading, setGetLoading] = useState<boolean>(false);
  const [postloading, setPostLoading] = useState<boolean>(false);

  useEffect(() => {
    getData();
  }, [])

  const getData = () => {
    setGetLoading(true);
    fetch('/api/register', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(({ user }) => {
        setNum(user.length + 1);
        setUserData(user);
      })
      .catch(err => {
        <Alert message={err.message} type="error" />
      })
      .finally(() => setGetLoading(false))
  }

  const add = () => {
    if (!inputName) {
      return <Alert message={'请输入姓名'} type="error" />
    }
    if (!inputEmail) {
      return <Alert message={'请输入联系方式'} type="error" />
    }
    setPostLoading(true);
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: inputName,
        email: inputEmail
      })
    })
      .then(() => {
        getData()
      })
      .catch(err => {
        <Alert message={err.message} type="error" />
      })
      .finally(() => setPostLoading(false))
  }

  return <div>
    <div style={{ margin: '20px 0' }} >
      <Input style={{ width: '250px', marginRight: '10px' }} value={inputName} onChange={(e) => setInputName(e.target.value)} maxLength={10} placeholder="请输入姓名" prefix={<UserOutlined />} />
      <Input style={{ width: '250px', marginRight: '10px' }} value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} maxLength={30} placeholder="请输入联系方式" prefix={<WechatOutlined />} />
      <Button type="primary" onClick={add}>add</Button>
    </div>
    <div className="requestTest-card-container" >
      {(getloading || postloading) && <Card style={{ width: 300, height: 170, margin: '16px 10px ' }} className="requestTest-card" loading={true}></Card>}
      {userData.map(item => <Card key={item.id} style={{ width: 300, height: 170, margin: '16px 10px ' }} className="requestTest-card">
        <div>{`姓名：${item.name}`}</div>
        <div>{`联系方式：${item.email}`}</div>
        <div>{`更新时间：${moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}`}</div>
      </Card>)}
    </div>
  </div>
}

export default RequestTest