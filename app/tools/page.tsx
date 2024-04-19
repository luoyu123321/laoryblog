'use client';
import { FC } from 'react'
import LuckCanvas from './lucky_canvas';

interface toolsProps {
}

const Tools: FC<toolsProps> = ({}) => {

  return <div style={{ marginTop: '30px', fontSize: '20px' }}>
    <LuckCanvas />
  </div>
}

export default Tools