'use client';

import Headline from '../Headline';
import Footer from '../Footer';
import Link from 'next/link';

export default () => {
  const n = 7;
  const images = [
    {
      name: '歌名很长歌名很长歌名很长歌名很长',
      url: '/images/1.png',
    },
    {
      name: '让赞美飞扬',
      url: '/images/2.png',
    },
    {
      name: '十字架',
      url: '/images/3.png',
    },
    {
      name: '唯一的安慰',
      url: '/images/4.png',
    },
    {
      name: '我需要有你在我生命中',
      url: '/images/5.png',
    },
    {
      name: '他医治破碎心灵',
      url: '/images/6.png',
    },
    {
      name: '丰盛的应许',
      url: '/images/7.png',
    },
  ];

  return (
    <div>
      <Headline title="2023年9月3日 主日敬拜" />

      <div className="mt-16 grid grid-cols-2">
        {images.map((image, index) => (
          <Link href="/list">
            <div key={index} className=" relative">
              <div className=" bg-blue-300 border border-zinc-300 p-2 absolute top-0 left-0 w-full ">
                {image['name']}
              </div>

              <div className="h-auto m-1 ">
                <img src={image['url']} alt="歌谱图片" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className=" pt-20"></div>

      <Footer title="回到日历" />
    </div>
  );
};
