import { FC } from 'react'

interface homeProps {
  isShow: boolean
}

const Home: FC<homeProps> = ({ isShow = false }) => {

  return <div style={{ display: isShow ? 'block' : 'none', marginTop: '30px', fontSize: '20px' }}>敬请期待</div>
}

export default Home