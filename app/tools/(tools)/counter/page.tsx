'use client'
import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';

import AddCounter from './addCounter';
import CounterMod from './counter';
import QueryCounter from './queryCounter';
const Counter = ({ }) => {
  const [radioSelect, setRadioSelect] = useState<string>('add');

  useEffect(() => {
    /* 页面刷新后，恢复上次选择的选项 */
    const radioSelect = sessionStorage.getItem('counterRadioSelect');
    if (radioSelect) {
      setRadioSelect(radioSelect);
    }
  }, []);

  /* 切换选项 */
  const onChange = (e: any) => {
    setRadioSelect(e.target.value);
    sessionStorage.setItem('counterRadioSelect', e.target.value);
  };

  return (
    <div style={{ marginTop: '25px' }}>
      <Radio.Group value={radioSelect} onChange={onChange}>
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