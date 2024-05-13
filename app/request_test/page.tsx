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
  const [getloading, setGetLoading] = useState<boolean>(false);
  const [postloading, setPostLoading] = useState<boolean>(false);

  useEffect(() => {
    // 优化初始化数据获取，当前页面缓存数据，如果存在则直接使用缓存数据
    const cachedData = sessionStorage.getItem('cachedRequestTest');
    if (cachedData?.length > 0) {
      setUserData(JSON.parse(cachedData));
    } else {
      getData();
    };
  }, [])

  const getData = () => {
    setGetLoading(true);
    fetch('/api/register', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(({ user }) => {
        setUserData(user);
        sessionStorage.setItem('cachedRequestTest', JSON.stringify(user));
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

    <div>todolist</div>
    <p>1、搭建next项目的博客编写</p>
    <p>2、首页展示大模型对话框试用(已完成)</p>
    <p>3、小工具待完善，显示各种工具的展示，点开进入详情，gpt也可以放在小工具（已完成）</p>
    <p>4、tailwind使用学习--(小完成，放弃使用)</p>
    <p>5、抽奖待完善----（已完成）</p>
    <p>6、预加载优化待学习完善（主要是服务端渲染，请求服务端处理）</p>
    <p>7、缓存敏感数据处理问题---（已完成）</p>
  </div>
}

export default RequestTest