'use client';
import React, { FC, useEffect, useState, Suspense } from 'react';
import Image from 'next/image'
import postsList from './posts';
import { useSearchParams } from 'next/navigation'

interface blogProps {
}

const Blog: FC<blogProps> = ({ }) => {
  const searchParams = useSearchParams()

  /**
   * 如果是首页跳转，滚动到指定文章
   */
  useEffect(() => {
    const postId = searchParams.get('postId');
    if (postId) {
      let time = 0;
      let interval = setInterval(() => {
        time += 100;
        const postele = document.getElementById(postId as string);
        console.log('postele', postele)
        if (postele) {
          postele.scrollIntoView();
          hovers(postele)
          clearInterval(interval);
        }
      }, 100);
      if (time > 5000) {
        clearInterval(interval);
      }
    }
  }, [searchParams]);

  /**
   * 跳转的元素高亮闪烁效果
   * @param ele 滚动到的元素
   */
  const hovers = (ele) => {
    let time = 0;
    let interval1 = setInterval(() => {
      if (time > 300) {
        clearInterval(interval1);
      }
      time += 300;
      if (time / 300 % 2 === 1) {
        // 添加hover样式类
        ele.classList.add('blog-body-content-box-bg-hover');
      } else if (time / 300 % 2 === 0) {
        // 移除hover样式类
        ele.classList.remove('blog-body-content-box-bg-hover');
      }
    }, 300);
    let timeout =setTimeout(() => {
      clearTimeout(timeout);
      // 移除hover样式类
      ele.classList.remove('blog-body-content-box-bg-hover');
    }, 5000);
  }

  return (
    <div className='blog' style={{ color: '#fff' }}>
      <div className='blog-body'>
        <div className='blog-body-title' style={{ borderBottom: "3px solid #000" }}>
          最新发布
        </div>
        <div className='blog-body-content'>
          <BlogContent postsList={postsList} />
        </div>
      </div>
      <footer style={{ paddingBottom:'20px', color: "#fff", textAlign: "center" }}>
        <p>友情链接</p>
        <a href="https://www.wujunhui.com/" target="_blank">东方战虎.辉(优质博客)</a>
      </footer>
    </div>
  )
}

export default Blog

const BlogContent = ({ postsList }) => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setIsMobile(window.innerWidth < 660);
  }, [])


  return (
    <>
      {
        isMobile !== undefined ? isMobile ? postsList.map((item, index) => {
          return <a key={index} id={item.id} className='blog-body-content-box-bg' href={item.href} target="_blank" >
            <div className='blog-body-content-title-mb'>
              {item.title}
            </div>
            <div className='blog-body-content-box-mb'>
              <div className='blog-body-content-box-center'>
                <div className='blog-body-content-left'>
                  <div className='blog-body-content-left-content-mb'>
                    {item.content}
                  </div>
                </div>
                <div className='blog-body-content-right'>
                  <Image
                    src={item.imgSrc}
                    alt=''
                    fill
                    loading="lazy"
                    sizes='72px'
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
              <div className='blog-body-content-left-foot-mb'>
                <span>{item.date}</span>
                <span>
                  {item.tags.map((tag, index) => {
                    return <span key={index} className='blog-body-content-left-tag-mb'>{tag}</span>
                  })}
                </span>
              </div>
            </div>
          </a>
        }) :
          postsList.map((item, index) => {
            return <a key={index} id={item.id} className='blog-body-content-box-bg' href={item.href} target="_blank" >
              <div className='blog-body-content-box'>
                <div className='blog-body-content-left'>
                  <div className='blog-body-content-left-title'>
                    {item.title}
                  </div>
                  <div className='blog-body-content-left-content'>
                    {item.content}
                  </div>
                  <div className='blog-body-content-left-foot'>
                    <span>{item.date}</span>
                    <span>
                      {item.tags.map((tag, index) => {
                        return <span key={index} className='blog-body-content-left-tag'>{tag}</span>
                      })}
                    </span>
                  </div>
                </div>
                <div className='blog-body-content-right'>
                  <Image
                    src={item.imgSrc}
                    alt=''
                    fill={true}
                    loading="lazy"
                    sizes='170px'
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </a>
          })
          : <></>
      }
    </>
  )

}