import { FC } from 'react'

interface blogProps {
  isShow: boolean
}

const Blog: FC<blogProps> = ({ isShow = false }) => {

  return <div style={{ display: isShow ? 'block' : 'none', marginTop: '30px', fontSize: '20px' }}>敬请期待</div>
}

export default Blog