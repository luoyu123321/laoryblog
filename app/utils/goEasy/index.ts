import GoEasy from 'goeasy';

/**
 * 创建goeasy实例,websocket连接
 */
const goEasy = GoEasy.getInstance({
  host: 'hangzhou.goeasy.io',//应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
  appkey: 'BC-d649a1f9ba94470fad5ad5c9a5c74125',
  modules: ['pubsub'],
});

/**
 * 连接goeasy
 */
const connectGoEasy = (onSuccess?: any, onFailed?: any) => {
  goEasy.connect({
    onProgress: (attempts) => {
      console.log("GoEasy is connecting", attempts);
    },
    onSuccess: () => {
      console.log("GoEasy connect successfully.")
      onSuccess?.();
    },
    onFailed: (error) => {
      onFailed?.(error);
      console.log("GoEasy connect failed:", error); //连接失败
    }
  });
}

/**
 * 断开长连接
 */
const goeasyDisconnect = () => {
  goEasy.disconnect({
    onSuccess: function () {
      console.log("GoEasy disconnect successfully.")
    },
    onFailed: function (error) {
      console.log("Failed to disconnect GoEasy, code:" + error.code + ",error:" + error.content);
    }
  });
}

/**
 * 获取长连接历史数据，用于断网重新连接后恢复最新数据
 */
const goeasyHistory = ({ channel, onSuccess, onFailed }: any) => {
  if (!channel) return;
  goEasy.pubsub.history({
    channel,
    limit: 1, //可选项，返回的消息条数，默认为10条，最多30条
    onSuccess: function (response) {
      const jsonrRes = JSON.parse('' + JSON.stringify(response) || '{}');
      const res = JSON.parse(jsonrRes?.content?.messages[0]?.content || '{}');
      onSuccess?.(res);
    },
    onFailed: function (error) { //获取失败
      onFailed?.(error);
      console.log("Failed to obtain history, code:" + error.code + ",error:" + error.content);
    }
  });
}

/**
 * 订阅接收goeasy长连接消息
 */
const subscribe = ({ channel, onMessage, onSuccess, onFailed }: any) => {
  if (!channel) return;
  goEasy.pubsub.subscribe({
    channel,
    onMessage: (message) => {
      const res = JSON.parse(message?.content || '{}');
      onMessage?.(res);
    },
    onSuccess: () => {
      onSuccess?.();
      console.log(channel + '订阅成功.');
    },
    onFailed: (error) => {
      onFailed?.(error);
      console.log("订阅失败，错误编码：" + error.code + " 错误信息：" + error.content);
    }
  });
}

/**
 * 取消订阅goeasy长连接消息
 */
const unsubscribe = ({ channel, onSuccess, onFailed }: any) => {
  if (!channel) return;
  goEasy.pubsub.unsubscribe({
    channel: channel,
    onSuccess: function () {
      onSuccess?.();
      console.log(channel + "订阅取消成功。");
    },
    onFailed: function (error) {
      onFailed?.(error);
      console.log("取消订阅失败，错误编码：" + error.code + " 错误信息：" + error.content)
    }
  });
}

/**
 * 发送goeasy长连接消息
 */
const updateChannel = ({ channel, message, qos = 1, onSuccess, onFailed }: any) => {
  goEasy.pubsub.publish({
    channel,
    message,
    qos, // 消息自动补发： 为1启用补发，0无需补发，默认为0。SDK需升级至2.6.2以上
    onSuccess: () => {
      onSuccess?.();
      console.log("send message success");
    },
    onFailed: (error) => {
      onFailed?.();
      console.log("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
    }
  });
}

const goEasyExport = {
  connectGoEasy,
  goeasyDisconnect,
  goeasyHistory,
  subscribe,
  unsubscribe,
  updateChannel,
};

export default goEasyExport;