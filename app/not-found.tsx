import Link from 'next/link'
import { Button, Result } from 'antd';

export default function NotFound() {
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，没有找到页面"
        extra={<Link href="/"><Button type="primary">返回首页</Button></Link>}
      />
    </div>
  )
}