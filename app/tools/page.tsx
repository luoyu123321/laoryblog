'use client';
import { FC, useEffect, useState } from 'react'
import Link from 'next/link';
import { Image } from 'antd';
import { animated, useTransition } from '@react-spring/web'

interface toolsProps {
}

const Tools: FC<toolsProps> = ({ }) => {

  const [bodyHeight, setBodyHeight] = useState<number>(0)

  const arr = [
    { path: '/tools/next_chat', name: 'chatGPT', imgUrl: '/next_chat.jpg', width: '50%' },
    { path: '/tools/lucky_canvas', name: '抽奖(三种玩法)', imgUrl: '/choujiang.jpg', width: '50%' },
    { path: '/tools/programmer_Inn', name: '程序员客栈', imgUrl: '/programmer_Inn.png', width: '100%' },
  ]

  useEffect(() => {
    setBodyHeight(window.innerHeight - 64)
  }, [])

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

  return <div style={{ paddingTop: '30px', fontSize: '20px', height: bodyHeight !== 0 ? bodyHeight : '', overflow: 'auto', display: 'flex', justifyContent: 'center', flexWrap: "wrap" }}>
    {transition((style, item) => {
      return (
        <Link href={item.path} prefetch={true}>
          <animated.div className='tools-mod-panel' style={style}>
            <Image
              alt={item.name}
              preview={false}
              width={item.width}
              src={item.imgUrl}
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