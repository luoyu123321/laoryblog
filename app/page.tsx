import { FC } from 'react'
import ChatGPT from './components/chatGPT'

interface homeProps {
}

export const metadata = {
  title: "LaoryBlog",
  description: "博客页面测试",
};

const Home: FC<homeProps> = ({ }) => {

  return (
    <>
    <ChatGPT />
    </>
  )
}

export default Home;