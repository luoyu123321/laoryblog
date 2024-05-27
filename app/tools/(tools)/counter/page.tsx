'use client'
import React, { useEffect, useState, useRef } from 'react';
import { Button, Divider, Flex, Radio, Space, Tooltip } from 'antd';
import axios from 'axios';

import AddCounter from './addCounter';
import CounterMod from './counter';

const Counter = ({ }) => {
  const [radioSelect, setRadioSelect] = useState<string>('edit');

  useEffect(() => {
  }, []);
  const get = async () => {
    const res = await axios.post('/api/counterQuery', {
      opttyp: 'title',
      groupName: '台球',
      title: '20240525测试一',
      typeList: ['三球', '四球', '五球']
    })
    console.log('res', res)
  }
  const addnbr = async () => {
    const res = await axios.post('/api/counterAdd', {
      opttyp: 'edit',
      groupName: '台球',
      title: '20240525测试一',
      type: '四球',
      accumulate: 1
    })
  }

  const addOk = (value: string) => {
    sessionStorage.setItem('counterGroupName', value);
    setRadioSelect('edit');
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <Radio.Group value={radioSelect} onChange={(e) => setRadioSelect(e.target.value)}>
        <Radio.Button value="add">新增计数集</Radio.Button>
        <Radio.Button value="edit">计数组</Radio.Button>
        <Radio.Button value="query">数据查询</Radio.Button>
      </Radio.Group>
      {radioSelect === 'add' && <AddCounter onOk={addOk} />}
      {radioSelect === 'edit' && <CounterMod goAdd={() => setRadioSelect('add')} />}
      {/* <Button onClick={() => { addnbr() }}>计数</Button> */}
      {/* <Button onClick={() => { get() }}>获取数据</Button> */}
    </div>
  );
}

export default Counter;