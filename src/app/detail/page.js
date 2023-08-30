'use client';

import { useRouter } from 'next/navigation';
import Headline from '../Headline';
import Footer from '../Footer';

export default () => {
  const router = useRouter();

  async function toList() {
    await router.push('/list');
  }

  return (
    <div>
      <Headline title="2023年9月3日 主日敬拜" />

      <div className="mt-16">
        <img src="/images/1.png" alt="歌谱图片" className="max-w-full h-auto" />
      </div>

      <div className=" pt-60"></div>

      <div className="container mx-auto max-w-screen-sm bg-zinc-300 p-5 fixed bottom-32 text-xl">
        段落顺序：ABABCAB
      </div>

      <div className="container mx-auto max-w-screen-sm fixed bottom-16">
        <div className="container mx-auto grid grid-cols-3">
          <div className="p-5 text-center">上一首</div>
          <div className="p-5 text-center" onClick={toList}>
            播放器
          </div>
          <div className="p-5 text-center">下一首</div>
        </div>
      </div>

      <Footer title="回到歌曲列表" />
    </div>
  );
};
