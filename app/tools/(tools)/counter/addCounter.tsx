import React, { useState, ReactElement } from 'react';
import { Button, Flex, Form, Input, Spin, message } from 'antd';
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
      const params = {
        opttyp: 'add',
        groupName: values.groupName,
        typeList: Object.values(values).slice(1)
      }
      await axios.post('/api/counterAdd', params)
      message.success({content:'保存成功', duration: 2, style: { marginTop: '10vh' },})
      sessionStorage.setItem('counterTitle', '');
      sessionStorage.setItem('counterGroupName', values.groupName);
      sessionStorage.setItem('counterTypeList', JSON.stringify(Object.values(values).slice(1) || '[]'));
      onOk?.();
    } catch (error) {
      console.log('error:', error);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={{ padding: '20px 10% 0px', }}>
      <Spin tip="Loading..." spinning={loading}>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="vertical"
            style={{ maxWidth: 600, maxHeight: '600px', overflow: 'auto' }}
          >
            <Form.Item key={'groupName'} name={`groupName`} label={`计数集合名`}
              rules={[{ required: true, message: '集合名不能为空!' }]}>
              <Input maxLength={25} placeholder='例如：日常运动、学习'/>
            </Form.Item>
            {settingFormItem.map((_, index) => {
              return <Form.Item key={index} name={`type${index + 1}`} label={`计数项${index + 1}`}>
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