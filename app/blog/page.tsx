'use client';
import { FC } from 'react'

interface blogProps {
}

const Blog: FC<blogProps> = ({ }) => {

  return (
  <div style={{ marginTop: '30px', fontSize: '14px', zIndex:1, position:'relative', color:'#fff' }}>
    <div> 敬请期待</div>
    <p>1、搭建next项目的博客编写</p>
    <p>2、首页展示大模型对话框试用(已完成)</p>
    <p>3、小工具待完善，显示各种工具的展示，点开进入详情，gpt也可以放在小工具（已完成）</p>
    <p>4、tailwind使用学习--(小完成，放弃使用)</p>
    <p>5、抽奖待完善----（已完成）</p>
    <p>6、预加载优化待学习完善（主要是服务端渲染，请求服务端处理）</p>
    <p>7、缓存敏感数据处理问题---（已完成）</p>
    <footer style={{position:'fixed', bottom:'20px', right:'5%', color:'#fff' }}>
      <p>友情链接</p>
      <a href="https://www.wujunhui.com/" target="_blank">东方战虎.辉(优质博客)</a>
    </footer>
  </div>
  )
}

export default Blog