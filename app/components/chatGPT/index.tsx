'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link'
import axios from 'axios';
import './index.css';

const ChatGPT = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [content, setContent] = useState<{ msg: string, isAnswer?: boolean }[]>([
    { msg: '你好，快和我聊个天吧', isAnswer: true },
    { msg: '有什么问题都可以问我哦', isAnswer: true },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, displayText, loading]);

  const sendQuestion = async () => {
    if (!inputMsg) return messageApi.info('请输入问题');
    let msgList = [...content, { msg: inputMsg, isAnswer: false }];
    setContent(msgList);
    setInputMsg('');
    setLoading(true);
    try {
      // 是否快速展示回答标识
      let isFastShow = false;
      // 请求开始时间
      let startTime = new Date().getTime();
      const { data: answer } = await axios.post('/api/chatgpt', { message: inputMsg });
      // 请求使用时间
      let useTime = new Date().getTime() - startTime;
      // 如果请求事件超过十秒秒，则快速展示回答
      isFastShow = useTime > 15000;
      outputAnswer(answer, isFastShow, () => setContent(msgList.concat({ msg: answer, isAnswer: true })))

    } catch (error) {
      messageApi.error('对话建立失败，请重试！');
    } finally {
      setLoading(false);
    }
  }

  /**
   * 
   * @param text 回答文本
   * @param isFastShow 是否快速展示
   * @param callback 回调方法
   */
  const outputAnswer = (text, isFastShow, callback) => {
    let index = 0;
    let addNbr = 1;
    addNbr = Math.round(text.length / 200) || 1;
    // 如果是快速展示结果，就按照一秒输出完，四十次输出完，否则按照正常速度输出
    if (isFastShow) {
      addNbr = text.length / 40 > 1 ? Math.round(text.length / 40) : 1;
    }
    // 如果是快速展示结果，25ms输出一次，否则按照结果长短，分段控制展示速度
    const times = isFastShow ? 25 : text.length < 2000 ? 50 : 30;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + addNbr));
        index += addNbr;
      } else {
        setDisplayText('');
        clearInterval(timer);
        callback()
      }
    }, times);
    if (index > 4000) {
      setDisplayText('');
      clearInterval(timer);
      callback()
    }
  }

  const enterSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  }

  return (
    <div>
      <div className='home-hot-title'>小工具推荐试用</div>
      <div className='chat-box' >
        {contextHolder}
        <header className='chat-box-header'>Your chatGPT</header>
        <div ref={contentRef} className='chat-box-content'>
          {
            content.map((item, index) =>
              <div key={index} className={`chat-box-content-item ${item.isAnswer ? 'chat-box-content-item-answer' : 'chat-box-content-item-question'}`}>
                <p>{item.msg}</p>
              </div>)
          }
          {loading && <div className={`chat-box-content-item chat-box-content-item-answer`}>
            <p><LoadingOutlined style={{ fontSize: '18px', color: '#08c' }} /></p>
          </div>}
          {displayText && <div className={`chat-box-content-item chat-box-content-item-answer`}>
            <p>{displayText}</p>
          </div>}

        </div>
        <footer className='chat-box-footer'>
          <div className='chat-box-footer-content'>
            <textarea ref={textareaRef} className='chat-box-footer-content-input' placeholder='请输入内容，  Enter 发送，Shift + Enter 换行' value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={enterSend} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: "center" }}>
              <Link href={'/tools'}><Button size='small' type="primary" style={{ marginRight: '15px' }} >体验完整版</Button></Link>
              <Button type="primary" onClick={() => {
                sendQuestion()
              }}>发送</Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
export default ChatGPT

