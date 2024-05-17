import { FC } from 'react'
import ChatGPT from './components/chatGPT'
import HomeMod from './components/homeMod';

interface homeProps {
}

export const metadata = {
  title: "LaoryBlog",
  description: "个人博客",
};

const Home: FC<homeProps> = ({ }) => {

  return (
    <div className='Home-body'>
      <ChatGPT />
      <HomeMod />
    </div>
  )
}

export default Home;