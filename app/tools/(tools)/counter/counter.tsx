import React, { useEffect, useState, useRef, ReactElement } from 'react';
import { Button, Input, Flex, Modal, Table, InputNumber, Spin, ConfigProvider, Space } from 'antd';
import { MinusOutlined, PlusOutlined, CheckOutlined, ForwardOutlined } from '@ant-design/icons';
import { dialogError, message } from '@/app/utils';

import axios from 'axios';
import moment from 'moment';

const ButtonGroup = Button.Group;

interface counterProps {
  goAdd: () => void;
}

/**
 * 记录工具模块
 */
const Counter: React.FC<counterProps> = ({ goAdd }): ReactElement => {

  const [isGoAdd, setIsGoAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<string>('');
  const [isOpenSettleModal, setIsOpenSettleModal] = useState<boolean>(false); // 结算弹框
  const [groupNameInput, setGroupNameInput] = useState<string>('');
  const [editInfoList, setEditInfoList] = useState<any[]>([]); // 记录信息，包含所有记录项及记录值
  const [tableData, setTableData] = useState<any[]>([]); // 记录信息表格展示，包含所有记录项及记录值
  const [title, setTitle] = useState<string>('');
  const [settle, setSettle] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const groupName = localStorage.getItem('counterGroupName');
    const title = sessionStorage.getItem('counterTitle');
    const typeList = JSON.parse(sessionStorage.getItem('counterTypeList') || '[]');
    /* 如果本地有集合名和标题说明进入过标题，直接初始化 */
    if (groupName && title && typeList.length) {
      initInfo(false);
    } else if (groupName && typeList.length && !title) {
      setIsModalOpen('title');
    } else {
      setIsModalOpen('groupName');
    }
  }, []);

  /**
   * 
   * @param isCounter 是否是记录操作
   */
  const initInfo = (isCounter = true) => {
    const groupName = localStorage.getItem('counterGroupName');
    const title = sessionStorage.getItem('counterTitle');
    const typeList = JSON.parse(sessionStorage.getItem('counterTypeList') || '[]');
    getEditInfo({ groupName, title, typeList, isTitleOk: false, isCounter });
  }

  /**
   *  获取当前记录信息
   */
  const getEditInfo = async ({ groupName, title, typeList, isTitleOk = true, isCounter = false }) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/counterQuery', {
        opttyp: 'title',
        groupName,
        title,
      })
      setTableData(res.data.counter.map((item) => { return { ...item, createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') } }))
      if (!isCounter) {
        if (res.data.counter.length === 0 && isTitleOk) {
          message.warning('标题不存在或无记录信息,已自动创建', 3)
          setEditInfoList(typeList.map((item) => { return { text: item, value: 0 } }))
        } else {
          setEditInfoList(typeList.map((item) => { return { text: item, value: res.data.counter.filter((itm) => itm.type === item)[0]?.accumulate || 0 } }))
        }
      }

      sessionStorage.setItem('counterTitle', title);
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
  const groupNameOk = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/counterQuery', {
        opttyp: 'groupName',
        groupName: groupNameInput,
      })
      if (res.data.counter.length === 0) {
        setIsGoAdd(true);
        return
      }
      sessionStorage.setItem('counterTitle', '');
      localStorage.setItem('counterGroupName', groupNameInput);
      sessionStorage.setItem('counterTypeList', JSON.stringify(res.data?.counter[0]?.typeList || '[]'));
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
    getEditInfo({ groupName, typeList, title: title || moment(new Date()).format('YYYYMMDD') })
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
    initInfo(false);
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

          {/* 记录操作部分 */}
          <Flex gap="small" vertical style={{ maxHeight: '40vh', overflow: 'auto' }}>
            {
              editInfoList.map((item, index) => {
                return <CounterModel key={index} dataSource={item} onOk={initInfo} />
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
      <Modal title="请输入记录集合名" open={isModalOpen === 'groupName'} onOk={groupNameOk}
        onCancel={() => { setIsModalOpen(''); }} cancelText='取消' okText='确认' style={{ top: '20%' }}
        confirmLoading={loading}>
        <div style={{ padding: '10px 0' }}>
          <Input value={groupNameInput} onChange={(e) => setGroupNameInput(e.target.value)} onPressEnter={groupNameOk} maxLength={25} placeholder='请输入您创建的集合名' />
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