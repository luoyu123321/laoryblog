import { FC } from 'react'

interface homeProps {
}

export const metadata = {
  title: "Blogtest",
  description: "博客页面测试",
};

const Home: FC<homeProps> = ({ }) => {

  return (
    <div style={{ marginTop: '30px', fontSize: '20px' }}>
      <div> 敬请期待</div>
      <p>1、搭建next项目的博客编写</p>
      <p>2、首页展示大模型对话框试用</p>
      <p>3、小工具待完善，显示各种工具的展示，点开进入详情，gpt也可以放在小工具</p>
      <p>4、tailwind使用学习待优化</p>
      <p>5、抽奖待完善----(已完成)</p>
      <p>6、预加载优化待学习完善</p>
    </div>
  )
}

export default Home;