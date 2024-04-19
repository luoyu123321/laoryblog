import { FC } from 'react'

interface homeProps {
}

export const metadata = {
  title: "Blogtest",
  description: "博客页面测试",
};

const Home: FC<homeProps> = ({ }) => {

  return <div style={{ marginTop: '30px', fontSize: '20px' }}>敬请期待</div>
}

export default Home;