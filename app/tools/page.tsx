'use client';
import { FC } from 'react'
import Link from 'next/link';
import { Image } from 'antd';
import { animated, useTransition } from '@react-spring/web'

interface toolsProps {
}

const Tools: FC<toolsProps> = ({ }) => {
  const arr = [
    { path: '/tools/lucky_canvas', name: '抽奖(转盘)' },
    { path: '/tools/lucky_canvas', name: '抽奖(九宫格)' },
    { path: '/tools/lucky_canvas', name: '抽奖(老虎机)' },

  ]

  //动画
  const transition = useTransition(arr, {
    trail: 400 / arr.length,
    from: { opacity: 0, transform: 'scale3d(0,0,0)' },
    enter: { opacity: 1, transform: 'scale3d(1,1,1)' },
    config: {
      tension: 500,
      friction: 50
    }
  })

  return <div style={{ marginTop: '30px', fontSize: '20px' }}>
    {transition((style, item) => {
      return (
        <Link href={item.path} prefetch={true}>
          <animated.div className='tools-mod-panel' style={style}>
            <Image
            width={'50%'}
              src="/choujiang.jpg"
            />
            <div>
            {item.name}
            </div>
          </animated.div>
        </Link>
      )
    })}
  </div>
}

export default Tools