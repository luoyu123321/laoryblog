'use client';
import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image'


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
          <a className='blog-body-content-box-bg' href='https://juejin.cn/post/7367552374335176755' target="_blank" >
            <div className='blog-body-content-box'>
              <div className='blog-body-content-left'>
                <div className='blog-body-content-left-title'>
                  东方战虎.辉(优质博客)
                </div>
                <div className='blog-body-content-left-content'>
                  这是一篇博客这是一篇博客这是一篇博客这是一篇博客这是一篇博客这是一篇博客这是一篇博客这是一篇博客这是一篇博客这是一篇博客
                </div>
                <div className='blog-body-content-left-foot'>
                  <span>2024-05-14</span>
                  <span style={{ backgroundColor: "#555", padding: "2px 6px" }}>前端成长</span>
                </div>
              </div>
              <div className='blog-body-content-right'>
                <Image
                  src={"/slot-bg1.jpg"}
                  width={212}
                  height={125}
                  alt=''
                />
              </div>
            </div>
          </a>
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