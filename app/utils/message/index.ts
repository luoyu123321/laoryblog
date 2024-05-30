import { message as Message } from 'antd';

// eslint-disable-next-line import/no-anonymous-default-export
export default class message {
  /**
   * 
   * @param content 提示内容
   * @param duration 延迟秒数 默认2s
   * @param style 样式
   */
  public static success(content, duration = 2, style = { marginTop: '10vh' }) {
    Message.success({ content, duration, style })
  }
  /**
   * 
   * @param content 提示内容
   * @param duration 延迟秒数 默认2s
   * @param style 样式
   */
  public static warning(content, duration = 2, style = { marginTop: '10vh' }) {
    Message.warning({ content, duration, style })
  }
  /**
   * 
   * @param content 提示内容
   * @param duration 延迟秒数 默认3s
   * @param style 样式
   */
  public static error(content, duration = 3, style = { marginTop: '10vh' }) {
    Message.success({ content, duration, style })
  }
  /**
   * 
   * @param content 提示内容
   * @param duration 延迟秒数 默认2s
   * @param style 样式
   */
  public static info(content, duration = 2, style = { marginTop: '10vh' }) {
    Message.info({ content, duration, style })
  }
}
