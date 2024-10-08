import React, { useEffect, useState, useRef, ReactElement, use } from 'react';
import { Button, Input, Flex, Modal, Table, InputNumber, Spin, ConfigProvider, Space, Alert } from 'antd';
import { MinusOutlined, PlusOutlined, CheckOutlined, ForwardOutlined, SyncOutlined } from '@ant-design/icons';
import { dialogError, message, goEasy } from '@/app/utils';

import axios from 'axios';
import moment from 'moment';

const ButtonGroup = Button.Group;

const {
  connectGoEasy,
  goeasyDisconnect,
  goeasyHistory,
  subscribe,
  unsubscribe,
  updateChannel,
} = goEasy;

interface counterProps {
  goAdd: () => void;
}

/**
 * 记录工具模块
 */
const Counter: React.FC<counterProps> = ({ goAdd }): ReactElement => {

  const [isGoAdd, setIsGoAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reconnecting, setReconnecting] = useState<boolean>(false); // 是否正在重连
  const [isModalOpen, setIsModalOpen] = useState<string>('');
  const [isOpenSettleModal, setIsOpenSettleModal] = useState<boolean>(false); // 结算弹框
  const [groupNameInput, setGroupNameInput] = useState<string>('');
  const [editInfoList, setEditInfoList] = useState<any[]>([]); // 记录信息，包含所有记录项及记录值
  const [tableData, setTableData] = useState<any[]>([]); // 记录信息表格展示，包含所有记录项及记录值
  const [title, setTitle] = useState<string>('');
  const [settle, setSettle] = useState<{ [key: string]: any }>({});
  const [goEasyInfoList, setGoEasyInfoList] = useState<{ [key: string]: any }>({}); // 长连接最新数据缓存
  const [goEasyHistoryInfoList, setGoEasyHistoryInfoList] = useState<{ [key: string]: any }>({}); // 长连接重新连接数据缓存
  let goEasyChannel = useRef<string>(''); // goeasy创建长连接名
  let goEasyChannelceshi = useRef<any[]>([]); // 缓存
  let isFirstInit = useRef<boolean>(true); // 是否首次初始化

  useEffect(() => {
    const groupName = localStorage.getItem('counterGroupName');
    const title = sessionStorage.getItem('counterTitle');
    const typeList = JSON.parse(sessionStorage.getItem('counterTypeList') || '[]');
    /* 初始化连接goeasy长连接 */
    connectGoEasy(() => connectGoEasySuccess(), () => setReconnecting(true));
    setGroupNameInput(groupName || '');
    /* 如果本地有集合名和标题说明进入过标题，直接初始化 */
    if (groupName && title && typeList.length) {
      initInfo({ isCounter: false });
      /* 如果集合已经初始化过，则直接订阅长连接消息  */
      const channel = groupName + title;
      subscribe({ channel, onMessage: subscribeMsg });
      goEasyChannel.current = channel;
    } else if (groupName && typeList.length && !title) {
      /* 如果选择过集合，但未进入标题，选择标题 */
      message.success('已自动进入上次集合：' + groupName)
      setIsModalOpen('title');
    } else if (groupName) {
      /* 如果使用过集合，自动进入上次集合，选择标题 */
      groupNameOk(groupName, true);
    } else {
      setIsModalOpen('groupName');
    }
    return () => {
      /* 页面关闭卸载关闭goeasy长连接 */
      goeasyDisconnect();
    }
  }, []);

  /**
   * 连接goeasy成功回调
   */
  let reconnectTip = useRef<any>(null);
  const connectGoEasySuccess = () => {
    /* 获取长连接历史数据 */
    // goeasyHistory({ channel: goEasyChannel.current, onSuccess: goeasyHistoryOk })
    /* 如果非初始化，重连一秒后如果没有新数据提示，则提示已是最新数据 */
    if (!isFirstInit.current) {
      reconnectTip.current = setTimeout(() => {
        message.success('已是最新数据');
        clearTimeout(reconnectTip.current);
      }, 1000);
    }
    isFirstInit.current = false;
    /* 关闭重连提示 */
    setReconnecting(false);
  };

  /**
   * 获取长连接历史数据，用于断网重新连接后恢复最新数据
   */
  // const goeasyHistoryOk = (value) => {
  //   console.log('goeasyHistoryOk', value);
  //   setGoEasyHistoryInfoList(value);
  // }

  /**
   * 订阅接收goeasy长连接消息，更新最新数据
   */
  const subscribeMsg = (value) => {
    setGoEasyInfoList(value);
  }

  /**
   * 监听最新数据缓存更新
   */
  useEffect(() => {
    /* 如果缓存为空，说明本人只是初始化还没操作过，也要更新 */
    if (goEasyChannelceshi.current?.length === 0 ||
      /* 如果缓存有数据，对比缓存和最新数据，有差异则更新 */
      goEasyInfoList?.infoList?.some(item =>
        goEasyChannelceshi.current?.some(itm => item.text === itm.text && item.value !== itm.value)
      )) {
      goEasySetVal(goEasyInfoList)
      reconnectTip.current && clearTimeout(reconnectTip.current);
    }
  }, [goEasyInfoList])

  /* 断线重连直接更新数据 */
  // useEffect(() => {
  //   /* 不知为何这样没问题，goEasyHistoryInfo有问题 */
  //   goEasySetVal(goEasyInfoList)
  // }, [goEasyHistoryInfoList])

  /**
   * 最新数据与当前数据对比，有差异则更新渲染
   */
  const goEasySetVal = (value) => {
    const { infoList, latestTableData } = value;

    /* 如果有数据，更新记录信息 */
    if (infoList?.length > 0) {
      message.success('数据已同步')
      setEditInfoList(infoList);
      /* 如果最新一条日志数据id不同，更新日志数据 */
      latestTableData?.id !== tableData[0]?.id && initInfo({ isGoEasyUpdate: true })
    }
  };

  /**
   * 
   * @param isCounter 是否是记录操作
   */
  const initInfo = ({ isCounter = true, isGoEasyUpdate = false }) => {
    const groupName = localStorage.getItem('counterGroupName');
    const title = sessionStorage.getItem('counterTitle');
    const typeList = JSON.parse(sessionStorage.getItem('counterTypeList') || '[]');
    getEditInfo({ groupName, title, typeList, isTitleOk: false, isCounter, isGoEasyUpdate });
  }

  /**
   *  获取当前记录信息
   */
  const getEditInfo = async ({ groupName, title, typeList, isTitleOk = true, isCounter = false, isGoEasyUpdate = false }) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/counterQuery', {
        opttyp: 'title',
        groupName,
        title,
      })
      setTableData(res.data.counter.map((item) => { return { ...item, createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') } }))
      /* 如果是长连接更新日志，到此就结束了 */
      if (isGoEasyUpdate) return;
      if (!isCounter) {
        if (res.data.counter.length === 0 && isTitleOk) {
          message.warning('标题不存在或无记录信息,已自动创建', 3)
          setEditInfoList(typeList.map((item) => { return { text: item, value: 0 } }));
        } else {
          setEditInfoList(typeList.map((item) => { return { text: item, value: res.data.counter.filter((itm) => itm.type === item)[0]?.accumulate || 0 } }));
        }
      } else {
        /* 如果是计数操作，更新goeasy长连接消息，更新多端数据同步 */
        if (res.data.counter.length > 0) {
          const infoList = typeList.map((item) => { return { text: item, value: res.data.counter.filter((itm) => itm.type === item)[0]?.accumulate || 0 } });
          goEasyChannelceshi.current = infoList
          updateChannel({
            channel: groupName + title, message: JSON.stringify({
              infoList,
              latestTableData: res.data.counter[0] // 最新一条日志数据，用于对比是否更新
            })
          });
        }
      }

      setIsModalOpen('');
    } catch (error) {
      dialogError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 选择集合确认按钮
   */
  const groupNameOk = async (value, isInit = false) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/counterQuery', {
        opttyp: 'groupName',
        groupName: value,
      })
      if (res.data.counter.length === 0) {
        setIsGoAdd(true);
        return
      }
      sessionStorage.setItem('counterTitle', '');
      localStorage.setItem('counterGroupName', value);
      sessionStorage.setItem('counterTypeList', JSON.stringify(res.data?.counter[0]?.typeList || '[]'));
      isInit && message.success('已自动进入上次集合：' + value)
      setIsModalOpen('title');
    } catch (error) {
      dialogError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 进入标题确认按钮，查询并初始化记录信息
   */
  const titleOk = async () => {
    const groupName = localStorage.getItem('counterGroupName');
    const typeList = JSON.parse(sessionStorage.getItem('counterTypeList') || '[]');
    const fintitle = title || moment(new Date()).format('YYYYMMDD')
    sessionStorage.setItem('counterTitle', fintitle);
    getEditInfo({ groupName, typeList, title: fintitle })
    /* 新操作页创建后，先取消原先订阅 */
    unsubscribe({ channel: goEasyChannel.current });
    /* 再重新订阅新操作会话 */
    subscribe({ channel: groupName + fintitle, onMessage: subscribeMsg });
    goEasyChannel.current = groupName + fintitle;
  };

  const enterTitle = () => {
    const groupname = localStorage.getItem('counterGroupName');
    const typeList = JSON.parse(sessionStorage.getItem('counterTypeList') || '[]');
    if (!groupname || !typeList.length) {
      message.warning('还没有选择记录集，请先选择集')
      return;
    }
    setIsModalOpen('title');
  }

  /**
   * 结算计算金额
   */
  const settleMoney = (value) => {
    // 获取所有金额
    const moneyList = value.split('+');
    // 使用reduce方法计算数组中所有数字的和，排除非数字的值
    const totalSum = moneyList.reduce((accumulator, currentValue) => {
      if (!isNaN(currentValue)) {
        return Number(accumulator) + Number(currentValue);
      } else {
        return Number(accumulator);
      }
    }, 0);
    const a = totalSum / 30 * (15 + editInfoList[1].value - editInfoList[0].value)
    const b = totalSum / 30 * (15 + editInfoList[0].value - editInfoList[1].value)
    const obj = {
      [editInfoList[0].text]: a,
      [editInfoList[1].text]: b
    }
    setSettle({ ...settle, ...obj, moneyList: value, sum: totalSum })
  }

  /**
   * 打开结算弹框
   */
  const openSettle = () => {
    setIsOpenSettleModal(true);
    initInfo({ isCounter: false });
    setSettle({});
  }

  const columns = [
    {
      title: '记录类型',
      dataIndex: 'type',
      align: 'center',
    }, {
      title: '记录值',
      dataIndex: 'accumulate',
      align: 'center',
    }, {
      title: '记录时间',
      dataIndex: 'createdAt',
      align: 'center',
    },
  ]

  return (
    <div className='counter-body'>
      <Flex gap="60px" justify='center' vertical >
        <Flex gap="large" justify='center' vertical >
          <Flex gap="small" justify='center'>
            <Button type='primary' onClick={() => { setIsModalOpen('groupName'); setGroupNameInput(''); }} > 选择集合 </Button>
            <Button type='primary' onClick={enterTitle} > 进入标题 </Button>
            {groupNameInput === '刘罗台球' && <Button type='primary' onClick={openSettle} > 结算 </Button>}
          </Flex>

          {reconnecting && <Button type="primary" size="small" danger ghost icon={<SyncOutlined spin />}> 断 线 重 连 中 ...</Button>}

          {/* 记录操作部分 */}
          <Flex gap="small" vertical style={{ maxHeight: '40vh', overflow: 'auto' }}>
            {
              editInfoList.map((item, index) => {
                return <CounterModel key={index} dataSource={item} onOk={() => initInfo({ isCounter: true })} />
              })
            }
          </Flex>
        </Flex>

        {/* 表格全数据展示 */}
        <ConfigProvider
          theme={{
            components: {
              Table: {
                cellPaddingBlockSM: 2,
              },
            },
          }}
        >
          <Table loading={loading} columns={columns as any} dataSource={tableData} size="small" pagination={{ pageSize: 5 }} />
        </ConfigProvider>
      </Flex>

      {/* 弹框部分 */}
      <Modal title={<div>请输入记录集合名<span style={{ color: 'rgb(255 24 65 / 60%)', fontSize: '12px' }}>(首次使用点击 <a onClick={() => goAdd?.()}>去创建</a> )</span></div>}
        open={isModalOpen === 'groupName'} onOk={() => groupNameOk(groupNameInput)}
        onCancel={() => { setIsModalOpen(''); }} cancelText='取消' okText='确认' style={{ top: '20%' }}
        confirmLoading={loading}>
        <div style={{ padding: '10px 0' }}>
          <Input value={groupNameInput} onChange={(e) => setGroupNameInput(e.target.value)} onPressEnter={() => groupNameOk(groupNameInput)} maxLength={25} placeholder='请输入您创建的集合名' />
        </div>
      </Modal>
      <Modal title="请输入记录标题（不填默认当天日期）" open={isModalOpen === 'title'} onOk={titleOk}
        onCancel={() => { setIsModalOpen(''); setTitle(''); }} cancelText='取消' okText='确认' style={{ top: '20%' }} confirmLoading={loading}>
        <div style={{ padding: '10px 0' }}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} onPressEnter={titleOk} maxLength={25} placeholder={moment(new Date()).format('YYYYMMDD')} />
        </div>
      </Modal>
      <Modal title="提示" open={isGoAdd}
        onOk={() => { goAdd?.(); setIsModalOpen('') }}
        onCancel={() => setIsGoAdd(false)} cancelText='取消' okText='去创建' style={{ top: '25%' }}>
        <p>{'此集合还未创建哦，是否去创建->'}</p>
      </Modal>
      <Modal title="结算" open={isOpenSettleModal}
        footer={<Button type='primary' onClick={() => setIsOpenSettleModal(false)} > 关闭 </Button>}
        onCancel={() => setIsOpenSettleModal(false)} style={{ top: '35%' }}>
        <Spin spinning={loading}>
          <Flex gap="small" vertical>
            <Space.Compact>
              <Input addonBefore={
                <div style={{ width: '50px', maxWidth: '150px', overflow: "hidden" }}>总金额</div>
              } value={settle.moneyList || ''} onChange={(e) => { settleMoney(e.target.value) }}
                placeholder='多个金额请以 + 号分隔' />
              <Button type='text' icon={<ForwardOutlined />} />
              <Input style={{ width: '23%' }} value={settle.sum || ''} />
            </Space.Compact>
            <InputNumber addonBefore={
              <div style={{ width: '50px', maxWidth: '150px', overflow: "hidden" }}>{editInfoList[0]?.text}</div>
            } value={settle[editInfoList[0]?.text] || ''} />
            <InputNumber addonBefore={
              <div style={{ width: '50px', maxWidth: '150px', overflow: "hidden" }}>{editInfoList[1]?.text}</div>
            } value={settle[editInfoList[1]?.text] || ''} />
          </Flex>
        </Spin>
      </Modal>
    </div>
  );
}

export default Counter;

/**
 * 每个独立的操作项组件
 */
const CounterModel = ({ dataSource, onOk }) => {
  const [num, setNum] = useState<number>(0);
  const [initText, setInitText] = useState<string>('');
  const [initValue, setInitValue] = useState<number>(0);
  const [loading, setloading] = useState<boolean>(false)
  const saveValue = useRef<number>(0);

  useEffect(() => {
    const { text = '', value = 0 } = dataSource;
    setInitText(text);
    setInitValue(value);
    setNum(value);
    saveValue.current = value;
  }, [dataSource])


  const save = async (val) => {
    /* 先获取当前的集合和标题 */
    const groupName = localStorage.getItem('counterGroupName');
    const title = sessionStorage.getItem('counterTitle');
    if (!groupName || !title) {
      message.warning('记录集或标题不存在，请重新进入标题')
      return;
    }
    /* 如果记录项或值不存在，不允许操作 */
    if ((!initText) || (!val && val !== 0)) {
      message.warning('记录项或值不存在，请稍后重试')
      return;
    }
    setNum(val);
    try {
      setloading(true);
      await axios.post('/api/counterAdd', {
        groupName,
        title,
        type: initText,
        accumulate: val,
      })
      saveValue.current = val;
      message.success('操作成功', 1.5)
      onOk?.();
    } catch (error) {
      dialogError(error);
      setNum(saveValue.current);
    } finally {
      setloading(false);
    }
  }

  return (
    <>
      <Spin spinning={loading}>
        <Flex gap='small' justify='center'>
          <InputNumber addonBefore={
            <div style={{ width: '100px', maxWidth: '150px', overflow: "hidden" }}>{initText}</div>
          } defaultValue={initValue} value={num} onChange={(value) => setNum(value)} />
          <ButtonGroup>
            <Button onClick={() => save(num - 1)} icon={<MinusOutlined />} />
            <Button onClick={() => save(num + 1)} icon={<PlusOutlined />} />
            <Button onClick={() => save(num)} icon={<CheckOutlined />} />
          </ButtonGroup>
        </Flex>
      </Spin>
    </>
  )
}