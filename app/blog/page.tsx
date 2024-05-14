'use client';
import React, { FC, useEffect, useState, Suspense } from 'react';
import Image from 'next/image'
import postsList from './posts';

interface blogProps {
}

const Blog: FC<blogProps> = ({ }) => {

  return (
    <div className='blog' style={{ color: '#fff' }}>
      <div className='blog-body'>
        <div className='blog-body-title' style={{ borderBottom: "3px solid #000" }}>
          最新发布
        </div>
        <div className='blog-body-content'>
          {postsList.map((item, index) => {
            return <a key={index} className='blog-body-content-box-bg' href={item.href} target="_blank" >
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
                  <Suspense fallback={<div>Loading...</div>}>
                    <Image
                      src={item.imgSrc}
                      width={170}
                      height={125}
                      alt=''
                      layout="fixed"
                    />
                  </Suspense>
                </div>
              </div>
            </a>
          })}
        </div>
      </div>
      <footer style={{ position: "fixed", bottom: "20px", right: "5%", color: "#fff", textAlign: "center" }}>
        <p>友情链接</p>
        <a href="https://www.wujunhui.com/" target="_blank">东方战虎.辉(优质博客)</a>
      </footer>
    </div>
  )
}

export default Blog