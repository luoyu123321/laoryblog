'use client'
import React, { useState } from 'react';
import { Radio } from 'antd';

import AddCounter from './addCounter';
import CounterMod from './counter';
import QueryCounter from './queryCounter';
const Counter = ({ }) => {
  const [radioSelect, setRadioSelect] = useState<string>('add');

  return (
    <div style={{ marginTop: '25px' }}>
      <Radio.Group value={radioSelect} onChange={(e) => setRadioSelect(e.target.value)}>
        <Radio.Button value="add">新增计数集</Radio.Button>
        <Radio.Button value="edit">计数组</Radio.Button>
        <Radio.Button value="query">数据查询</Radio.Button>
      </Radio.Group>
      {radioSelect === 'add' && <AddCounter onOk={() => setRadioSelect('edit')} />}
      {radioSelect === 'edit' && <CounterMod goAdd={() => setRadioSelect('add')} />}
      {radioSelect === 'query' && <QueryCounter />}
    </div>
  );
}

export default Counter;