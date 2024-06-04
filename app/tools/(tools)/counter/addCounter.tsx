import React, { useState, ReactElement } from 'react';
import { Button, Flex, Form, Input, Spin } from 'antd';
import { dialogError, message } from '@/app/utils';
import axios from 'axios';

interface addCounterProps {
  onOk: () => void;
}

/**
 * 新增集合模块
 */
const AddCounter: React.FC<addCounterProps> = ({ onOk }): ReactElement => {

  const [settingFormItem, setSettingFormItem] = useState<number[]>([1]);
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const save = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      if (values.length < 2) {
        message.error('请至少添加一个计数项', 2)
        return
      }
      const typeList = Object.values(values).slice(1);
      /* 去重计数项 */
      const newTypeList = Array.from(new Set(typeList));
      const params = {
        opttyp: 'add',
        groupName: values.groupName,
        typeList: newTypeList
      }
      await axios.post('/api/counterAdd', params)
      const msgTip = newTypeList.length === typeList.length ? '保存成功!' : '保存成功，计数项有重复，已自动去重！';
      message.success(msgTip, 3)
      sessionStorage.setItem('counterTitle', '');
      localStorage.setItem('counterGroupName', values.groupName);
      sessionStorage.setItem('counterTypeList', JSON.stringify(Object.values(values).slice(1) || '[]'));
      onOk?.();
    } catch (error) {
      dialogError(error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className='counter-body counter-body-add'>
      <p style={{color:'red',fontSize:'12px'}}>集合名请加自己名字/缩写后缀，防止与他人重复</p>
      <Spin tip="Loading..." spinning={loading}>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          // layout="vertical"
          style={{ width: "", maxWidth: 600, maxHeight: '600px', overflow: 'auto', margin: '0 auto' }}
        >
          <Form.Item key={'groupName'} name={`groupName`} label={`计数集合名`}
            rules={[{ required: true, message: '集合名不能为空!' },
            { pattern: /(^\S)((.)*\S)?(\S*$)/, message: '前后不能有空格' }
            ]}>
            <Input maxLength={25} placeholder='例如：日常运动、学习' />
          </Form.Item>
          {settingFormItem.map((_, index) => {
            return <Form.Item key={index} name={`type${index + 1}`} label={`计数项${index + 1}`}
              rules={[{ required: true, message: `计数项${index + 1}不能为空！请删除或填写` },
              { pattern: /(^\S)((.)*\S)?(\S*$)/, message: '前后不能有空格' }
              ]}>
              <Input maxLength={25} />
            </Form.Item>
          })}
        </Form>
        <Flex gap="small" justify='center'>
          <Button type='primary' onClick={() => { setSettingFormItem([...settingFormItem, settingFormItem.length + 1]) }}>增加计数项</Button>
          <Button type='primary' onClick={() => { setSettingFormItem(settingFormItem.slice(0, settingFormItem.length - 1)) }}>删除计数项</Button>
          <Button type='primary' onClick={() => { save() }}>保存</Button>
        </Flex>
      </Spin>
    </div>
  );
}

export default AddCounter;