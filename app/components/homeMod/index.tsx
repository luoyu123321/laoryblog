'use client';
import React, { useEffect, useState, useRef, ReactElement } from 'react';
import Link from 'next/link';
import postsList from '@/app/blog/posts';

interface HomeProps {

}

const HomeMod: React.FC<HomeProps> = ({ }): ReactElement => {

  const [isShowmore, setIsShowmore] = useState<boolean>(false);
  const [postLists, setPostLists] = useState<{ [key: string]: any }[]>([]);

  useEffect(() => {
    const isMobile = window.innerWidth < 660;
    setPostLists(postsList.slice(0, isMobile ? 5 : 6));
    setIsShowmore(isMobile ? postsList.length > 5 : postsList.length > 6);
  }, []);

  return (
    <div>
      <div className='home-hot-title'>博客预览</div>
      <div className='home-hot-blog-body'>
        {postLists.map((item) => {
          return <div key={item.id} className='home-hot-blog-item'>
            <div>{item.date}</div>
            <div><Link style={{ color: "#000" }} href={`/blog?postId=${item.id}`}>{item.content}</Link></div>
          </div>
        })}
        {isShowmore && <Link href='/blog'><span className='home-hot-blog-body-more-btn'>查看更多</span></Link>}
      </div>
    </div>
  );
}

export default HomeMod;