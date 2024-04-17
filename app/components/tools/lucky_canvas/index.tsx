import React, { useState, useRef } from 'react';
import { Button, Modal, Form, Input, Space, Checkbox, Radio } from 'antd';
import { LuckyWheel, LuckyGrid, SlotMachine } from '@lucky-canvas/react';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [settingModal, setSettingModal] = useState<boolean>(false);
  const [bingoPrize, setBingoPrize] = useState<string>('');
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' }
  ])
  const [prizes] = useState([
    { background: '#e9e8fe', fonts: [{ text: '0' }] },
    { background: '#b8c5f2', fonts: [{ text: '1' }] },
    { background: '#e9e8fe', fonts: [{ text: '2' }] },
    { background: '#b8c5f2', fonts: [{ text: '3' }] },
    { background: '#e9e8fe', fonts: [{ text: '4' }] },
    { background: '#b8c5f2', fonts: [{ text: '5' }] },
    { background: '#e9e8fe', fonts: [{ text: '6' }] },
    { background: '#b8c5f2', fonts: [{ text: '7' }] },
    { background: '#e9e8fe', fonts: [{ text: '8' }] },
    { background: '#b8c5f2', fonts: [{ text: '9' }] },

  ])
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%', background: '#869cfa',
      pointer: true,
      fonts: [{ text: '开始', top: '-10px' }]
    }
  ])
  const myLucky = useRef()
  return <div>
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
        <Button type="primary" onClick={() => setSettingModal(false)}>确定</Button>
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={() => setSettingModal(false)}>取消</Button>
      </div>}
    >
      <div style={{ padding: '30px' }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={{}}
          onValuesChange={() => { }}
          style={{ maxWidth: 600, maxHeight: '520px', overflow: 'auto' }}
        >
          <Form.Item label="奖品1">
            <Input style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="奖品2">
            <Input style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="奖品3">
            <Input style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="奖品4">
            <Input style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="奖品5">
            <Input style={{ width: '300px' }} />
          </Form.Item>
          <Form.Item label="奖品6">
            <Input style={{ width: '300px' }} />
          </Form.Item>
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
        myLucky.current.play()
        setTimeout(() => {
          const index = Math.random() * 6 >> 0
          myLucky.current.stop(index)
        }, 2500)
      }}
      onEnd={prize => { // 抽奖结束会触发end回调
        setIsModalOpen(true)
        setBingoPrize('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
      }}
    />
  </div>
}