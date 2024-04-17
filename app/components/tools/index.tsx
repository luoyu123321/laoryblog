import { FC } from 'react'
import LuckCanvas from './lucky_canvas';

interface toolsProps {
  isShow: boolean
}

const Tools: FC<toolsProps> = ({ isShow = false }) => {

  return <div style={{ display: isShow ? 'block' : 'none', marginTop: '30px', fontSize: '20px' }}>
    <LuckCanvas />

  </div>
}

export default Tools