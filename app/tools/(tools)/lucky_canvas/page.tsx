//@ts-ignore
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Form, Input, Space, Flex, Radio, notification } from 'antd';
import { LuckyWheel, LuckyGrid, SlotMachine } from '@lucky-canvas/react';

const COLORS = ['#DD4E15', '#F9B508', '#FDE429', '#76BA0A', '#008C9D', '#5AB2EB', '#7487D5'];

export default function LuckCanvas() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [luckyType, setLuckyType] = useState<string>('luckyWheel');
  const [settingModal, setSettingModal] = useState<boolean>(false);
  const [bingoPrize, setBingoPrize] = useState<string>('');

  const [probability, setProbability] = useState<number>(100); // 中奖概率

  const [api, contextHolder] = notification.useNotification();

  const [settingPrizes, setSettingPrizes] = useState<string[] | undefined[]>(['0', '1', '2', '3', '4', '5']);
  const [settingZCPrizes, setSettingZCPrizes] = useState<string[] | undefined[]>(['0', '1', '2', '3', '4', '5']);

  const [blocks] = useState([
    { padding: '10px', background: '#869cfa'},
  ])
  const [prizes, setPrizes] = useState([
    { background: COLORS[0], fonts: [{ text: '0', top: 30 }] },
    { background: COLORS[1], fonts: [{ text: '1', top: 30 }] },
    { background: COLORS[2], fonts: [{ text: '2', top: 30 }] },
    { background: COLORS[3], fonts: [{ text: '3', top: 30 }] },
    { background: COLORS[4], fonts: [{ text: '4', top: 30 }] },
    { background: COLORS[5], fonts: [{ text: '5', top: 30 }] },
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

  const [gridBlocks] = useState([
    { padding: '15px', background: '#869cfa' },
    { padding: '15px', background: '#afc8ff' },
    { padding: '15px', background: '#e9e8fe' },
  ])

  const [gridPrizes, setGridPrizes] = useState([
    { x: 0, y: 0, background: COLORS[0], fonts: [{ text: '0', top: '40%', fontSize: '0.6rem' }], },
    { x: 1, y: 0, background: COLORS[1], fonts: [{ text: '1', top: '40%' }], },
    { x: 2, y: 0, background: COLORS[2], fonts: [{ text: '2', top: '40%' }], },
    { x: 2, y: 1, background: COLORS[3], fonts: [{ text: '3', top: '40%' }], },
    { x: 2, y: 2, background: COLORS[4], fonts: [{ text: '4', top: '40%' }], },
    { x: 1, y: 2, background: COLORS[5], fonts: [{ text: '5', top: '40%' }], },
    { x: 0, y: 2, background: COLORS[6], fonts: [{ text: '6', top: '40%' }], },
    { x: 0, y: 1, fonts: [{ text: '7', top: '40%' }], },
  ])
  const [gridButtons] = useState([
    {
      x: 1, y: 1,
      background: '#9c9dd8',
      fonts: [{ text: '开始', top: '35%', fontSize: '1.1rem' }],
    },
  ])

  const [slotMachineBlocks] = useState([
    { padding: '30px', background: '#617df2', borderRadius: '50px' },
    { padding: '25px', background: '#869cfa', borderRadius: '30px' },
    { padding: '20px', background: '#afc8ff', borderRadius: '30px' },
    { padding: '15px', background: '#e9e8fe', borderRadius: '30px',
    imgs: [{
      src: '/slot-bg.jpg',
      width: '100%',
      height: '100%'
    }]  },
  ])

  const [slotMachinePrizes, setSlotMachinePrizes] = useState([
    { background: COLORS[0], fonts: [{ text: '0', top: '35%' }], borderRadius: '10px', },
    { background: COLORS[1], fonts: [{ text: '1', top: '35%' }], borderRadius: '20px', },
    { background: COLORS[2], fonts: [{ text: '2', top: '35%' }], borderRadius: Infinity, },
    { background: COLORS[3], fonts: [{ text: '3', top: '35%' }], borderRadius: '30px', },
    { background: COLORS[4], fonts: [{ text: '4', top: '35%' }], borderRadius: '40px', },
    { background: COLORS[5], fonts: [{ text: '5', top: '35%' }], borderRadius: 'Infinity', },
    { background: COLORS[6], fonts: [{ text: '6', top: '35%' }], borderRadius: '50px', },
    { fonts: [{ text: '7', top: '35%' }], },
  ])
  const [slotMachineButtons] = useState([
    {
      x: 1, y: 1,
      background: '#9c9dd8',
      fonts: [{ text: '开始', top: '45%' }],
    },
  ])
  const luckyWheelRef = useRef<any>()
  const luckyGridRef = useRef<any>()
  const slotMachineRef = useRef<any>()

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
    // if (settingPrizes.some(item => !item)) {
    //   api.info({
    //     message: `提示`,
    //     description:
    //       '请将未填写的奖项删除哦',
    //     placement: 'top',
    //     duration: 1.5,
    //   });
    //   return
    // }
    if (luckyType === 'luckyWheel') {
      const prizesList = settingPrizes.map((item, index) => {
        return {
          background: COLORS[index % 7],
          fonts: [{ text: item ? item : '无奖品', top: 30, fontSize: '0.8rem' }]
        }
      })
      setPrizes(prizesList);
    } else if (luckyType === 'luckyGrid') {
      const prizesList = settingPrizes.map((item, index) => {
        return {
          ...gridPrizes[index],
          fonts: [{ text: item ? item : '无奖品', top: '35%', fontSize: '0.8rem' }]
        }
      })
      setGridPrizes(prizesList);
    } else {
      const prizesList = settingPrizes.map((item, index) => {
        return {
          background: COLORS[index % 7],
          fonts: [{ text: item ? item : '无奖品', top: '35%', fontSize: '0.8rem' }],
          borderRadius: `${index % 5 * 25}px`,
        }
      })
      setSlotMachinePrizes(prizesList);
    }
    setSettingModal(false)
  };

  const startGame = () => {
    setBingoPrize('');
    slotMachineRef.current?.play()
    const index = Math.random() * slotMachinePrizes.length >> 0;
    let res = [];
    const isBingo = Math.random() * 100 >> 0;
    if (isBingo < probability) {
      res = [index, index, index]
    } else {
      res = [index, index - 1, index + 1]
    }
    const timeout = setTimeout(() => {
      slotMachineRef.current?.stop(res)
      clearTimeout(timeout)
    }, 2500);
  };

  useEffect(() => {
    console.log('settingPrizes', settingPrizes)
  }, [settingPrizes])



  return <div style={{ marginTop: '30px', fontSize: '20px' }}>
    {contextHolder}
    <Radio.Group style={{ marginBottom: '20px' }} size='large' value={luckyType} onChange={(e) => setLuckyType(e.target.value)}>
      <Radio.Button checked value="luckyWheel" onClick={() => setSettingPrizes(settingZCPrizes)} >大转盘抽奖</Radio.Button>
      <Radio.Button value="luckyGrid" onClick={() => {
        if (settingPrizes.length >= 8) {
          setSettingPrizes(settingPrizes.slice(0, 8));
        } else {
          setSettingPrizes(settingPrizes.concat(new Array(8 - settingPrizes.length).fill(undefined)));
        }
      }}>九宫格抽奖</Radio.Button>
      <Radio.Button value="slotMachine" onClick={() => setSettingPrizes(settingZCPrizes)}>老虎机抽奖</Radio.Button>
    </Radio.Group>

    {/* 抽奖结果 */}
    <Modal
      title="抽奖结果"
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={<div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={() => setIsModalOpen(false)}>确定</Button>
      </div>}
    >
      <div style={{ textAlign: 'center', fontSize: '20px', lineHeight: '100px', minHeight: '100px' }}>
        {bingoPrize}
      </div>
    </Modal>

    {/* 设置奖项弹框 */}
    <Modal
      title="设置奖项"
      open={settingModal}
      onCancel={() => setSettingModal(false)}
      footer={luckyType !== 'luckyGrid' ? <div style={{ textAlign: 'center' }}>
        <Button type="primary" onClick={() => setSettingPrizes(settingPrizes.concat([undefined]))}>增加奖品</Button>
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={deletePrize}>删除奖品</Button>
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={confirmPrize}>确认</Button>
      </div> : <div style={{ textAlign: 'center' }}>
        <Button type="primary" style={{ marginLeft: '15px' }} onClick={confirmPrize}>确认</Button>
      </div>}
    >
      <div style={{ padding: '20px 30px 0' }}>
        {luckyType === 'luckyGrid' && <p style={{ color: 'red', textAlign: 'center' }}>九宫格只能设置八个奖品，不满八个可以空着或重复写</p>}
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          className='model-prize-form'
          onValuesChange={(_, allValues) => { setSettingPrizes(Object.values(allValues)); setSettingZCPrizes(Object.values(allValues)) }}
          style={{ maxWidth: 600, height: '350px', overflow: 'auto' }}
        >
          {settingPrizes.map((item, index) => {
            return <Form.Item key={index} name={`jiangpin${index + 1}`} label={`奖品${index + 1}`}>
              <Input style={{ width: '300px' }} maxLength={25} />
            </Form.Item>
          })}
        </Form>
        {luckyType === 'slotMachine' && <Form.Item name={`jiangpingailv`} label={`中奖概率`}>
          <Input value={probability} onChange={(e) => { setProbability(Number(e.target.value)) }} style={{ width: '300px' }} placeholder='请填1-100之间的整数' />
        </Form.Item>}
      </div>
    </Modal>

    {/* 大转盘抽奖 */}
    {luckyType === 'luckyWheel' && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LuckyWheel
        ref={luckyWheelRef}
        width="22rem"
        height="22rem"
        blocks={blocks}
        prizes={prizes}
        buttons={buttons}
        onStart={() => { // 点击抽奖按钮会触发star回调
          setBingoPrize('');
          luckyWheelRef.current?.play()
          setTimeout(() => {
            const index = Math.random() * prizes.length >> 0
            console.log('index', index)
            luckyWheelRef.current?.stop(index)
          }, 2500)
        }}
        onEnd={prize => { // 抽奖结束会触发end回调
          setIsModalOpen(true)
          if (prize.fonts[0].text === '无奖品') {
            setBingoPrize('可惜了！没中奖( ⊙ o ⊙ )')
          } else {
            setBingoPrize('恭喜你抽到奖品： ' + prize.fonts[0].text)
          }
        }}
      />
    </div>}

    {/* 九宫格抽奖 */}
    {luckyType === 'luckyGrid' && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LuckyGrid
        ref={luckyGridRef}
        width="22rem"
        height="22rem"
        rows="3"
        cols="3"
        blocks={gridBlocks}
        prizes={gridPrizes}
        buttons={gridButtons}
        defaultStyle={
          {
            background: '#b8c5f2',
            fontSize: '1rem',
            borderRadius: '30px'
          }
        }
        onStart={() => { // 点击抽奖按钮会触发star回调
          setBingoPrize('');
          luckyGridRef.current?.play()
          setTimeout(() => {
            const index = Math.random() * gridPrizes.length >> 0
            luckyGridRef.current?.stop(index)
          }, 2500)
        }}
        onEnd={prize => { // 抽奖结束会触发end回调
          setIsModalOpen(true)
          if (prize.fonts[0].text === '无奖品') {
            setBingoPrize('可惜了！没中奖( ⊙ o ⊙ )')
          } else {
            setBingoPrize('恭喜你抽到奖品： ' + prize.fonts[0].text)
          }
        }}
      />
    </div>
    }

    {/* 老虎机抽奖 */}
    {luckyType === 'slotMachine' && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <SlotMachine
        ref={slotMachineRef}
        width="28rem"
        height="21rem"
        blocks={slotMachineBlocks}
        prizes={slotMachinePrizes}
        buttons={slotMachineButtons}
        slots={[
          { order: Array.from({ length: slotMachinePrizes.length }, (v, i) => i), speed: 6, direction: 1 },
          { order: Array.from({ length: slotMachinePrizes.length }, (v, i) => i).slice(1, slotMachinePrizes.length).concat([0]), speed: 14, direction: -1 },
          { order: Array.from({ length: slotMachinePrizes.length }, (v, i) => i).slice(2, slotMachinePrizes.length).concat([0, 1]), speed: 9, direction: 1 },
        ]}
        defaultStyle={{
          background: '#bac5ee',
          fontColor: '#333'
        }}
        defaultConfig={{
          rowSpacing: '30px',
          colSpacing: '10px'
        }}
        onEnd={prize => { // 抽奖结束会触发end回调
          console.log('prize', prize)
          setIsModalOpen(true)
          if (prize) {
            setBingoPrize('恭喜你抽到奖品： ' + prize?.fonts[0]?.text)
          } else {
            setBingoPrize('很遗憾，没有抽到奖品!')
          }
        }}
      />

    </div>}

    <Flex gap="small" align="center" vertical style={{ margin: '20px 0' }}>
      {luckyType === 'slotMachine' && <Button type="primary" size='large' style={{ width: '200px', marginTop: '20px' }} onClick={startGame}>开始游戏</Button>}
      <Button type="primary" size='large' style={{ width: '200px' }} onClick={() => { setSettingModal(true) }}>设置奖项</Button>
    </Flex>
  </div>
}