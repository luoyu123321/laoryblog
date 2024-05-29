import { message } from 'antd';
const dialogError = (error: any) => {
  message.error({ content: error?.response?.data?.message || '操作失败，请稍后重试！', duration: 3, style: { marginTop: '10vh' }, })
}
export default dialogError;