//@ts-ignore
import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, Space, Checkbox, Radio, notification } from 'antd';
import { LuckyWheel, LuckyGrid, SlotMachine } from '@lucky-canvas/react';

const COLORS = ['#DD4E15', '#F9B508', '#FDE429', '#76BA0A', '#008C9D', '#5AB2EB', '#7487D5'];

export default function LuckCanvas() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [settingModal, setSettingModal] = useState<boolean>(false);
  const [bingoPrize, setBingoPrize] = useState<string>('');

  const [api, contextHolder] = notification.useNotification();

  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' }
  ])
  const [prizes, setPrizes] = useState([
    { background: COLORS[0], fonts: [{ text: '0', top: 30 }] },
    { background: COLORS[1], fonts: [{ text: '1', top: 30 }] },
    { background: COLORS[2], fonts: [{ text: '2', top: 30 }] },
    { background: COLORS[3], fonts: [{ text: '3', top: 30 }] },
    { background: COLORS[4], fonts: [{ text: '4', top: 30 }] },
    { background: COLORS[5], fonts: [{ text: '5', top: 30 }] },
  ])
  const [settingPrizes, setSettingPrizes] = useState<string[] | undefined[]>(['0', '1', '2', '3', '4', '5']);
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%', background: '#869cfa',
      pointer: true,
      fonts: [{ text: '开始', top: '-10px' }]
    }
  ])
  const myLucky = useRef<any>()

  /**
   * 添加奖项时滚到最底部
   */
  useEffect(() => {
    const ele = document.getElementsByClassName('model-prize-form');
    if (ele?.length) {
      ele[0].scrollTop = ele[0].scrollHeight;
    }
  }, [settingPrizes])

  /**
   * 删除奖项
   */
  const deletePrize = () => {
    if (settingPrizes.length <= 2) {
      api.info({
        message: `提示`,
        description:
          '最少需要两个奖品',
        placement: 'top',
        duration: 1.5,
      });
      return
    }
    setSettingPrizes(settingPrizes.slice(0, settingPrizes.length - 1))
  }

  const confirmPrize = () => {
    if (settingPrizes.some(item => !item)) {
      api.info({
        message: `提示`,
        description:
          '请将未填写的奖项删除哦',
        placement: 'top',
        duration: 1.5,
      });
      return
    }
    const prizesList = settingPrizes.map((item, index) => {
      return {
        background: COLORS[index % 7],
        fonts: [{ text: item, top: 30 }]
      }
    })
    setPrizes(prizesList);
    setSettingModal(false)
  };


  return <div>
    {contextHolder}
    <Radio.Group>
      <Radio.Button value="small">大转盘抽奖</Radio.Button>
      <Radio.Button value="default">九宫格抽奖</Radio.Button>
      <Radio.Button value="large">老虎机抽奖</Radio.Button>
    </Radio.Group>
    <Button type="primary" onClick={() => { setSettingModal(true) }}>
      设置奖项
    </Button>

    <Modal
      title="抽奖结果"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={<div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={() => setIsModalOpen(false)}>确定</Button>
      </div>}
    >
      <div style={{ textAlign: 'center', fontSize: '30px', lineHeight: '100px', minHeight: '100px' }}>
        {bingoPrize}
      </div>
    </Modal>

    {/* 设置奖项弹框 */}
    <Modal
      title="设置奖项"
      open={settingModal}
      onCancel={() => setSettingModal(false)}
      footer={<div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={() => setSettingPrizes(settingPrizes.concat([undefined]))}>增加奖品</Button>
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={deletePrize}>删除奖品</Button>
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={confirmPrize}>确认</Button>
      </div>}
    >
      <div style={{ padding: '30px 30px 0' }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          className='model-prize-form'
          onValuesChange={(_, allValues) => { setSettingPrizes(Object.values(allValues)) }}
          style={{ maxWidth: 600, height: '350px', overflow: 'auto' }}
        >
          {settingPrizes.map((item, index) => {
            return <Form.Item key={index} name={`jiangpin${index + 1}`} label={`奖品${index + 1}`}>
              <Input style={{ width: '300px' }} maxLength={25} />
            </Form.Item>
          })}
        </Form>
      </div>
    </Modal>

    {/* 大转盘抽奖 */}
    <LuckyWheel
      ref={myLucky}
      width="600px"
      height="600px"
      blocks={blocks}
      prizes={prizes}
      buttons={buttons}
      onStart={() => { // 点击抽奖按钮会触发star回调
        setBingoPrize('');
        myLucky.current?.play()
        setTimeout(() => {
          const index = Math.random() * 6 >> 0
          myLucky.current?.stop(index)
        }, 2500)
      }}
      onEnd={prize => { // 抽奖结束会触发end回调
        setIsModalOpen(true)
        setBingoPrize('恭喜你抽到奖品： ' + prize.fonts[0].text)
      }}
    />
  </div>
}