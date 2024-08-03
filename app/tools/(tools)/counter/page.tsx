'use client'
import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';

import AddCounter from './addCounter';
import CounterMod from './counter';
import QueryCounter from './queryCounter';
import GoEasy from 'goeasy';

const Counter = ({ }) => {
  const [radioSelect, setRadioSelect] = useState<string>('add');

  /**
   * 创建goeasy实例,websocket连接
   */
  const goEasy = GoEasy.getInstance({
    host: 'hangzhou.goeasy.io',//应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
    appkey: 'BC-d649a1f9ba94470fad5ad5c9a5c74125',
    modules: ['pubsub'],
  });

  useEffect(() => {
    window['goEasy'] = goEasy;
  }, [])
  

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