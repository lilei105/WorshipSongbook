'use client';

import { useRouter } from 'next/navigation';

export default () => {
  const router = useRouter();

  async function toList() {
    await router.push('/list');
  }

  return (
    <div>
      <div className="bg-zinc-300 p-5">歌名很长歌名很长歌名很长歌名很长</div>

      <div>
        <img src="/images/2.png" alt="歌谱图片" className="max-w-full h-auto" />
      </div>

      <div className=" pt-40"></div>

      <div className="bg-zinc-300 p-5 fixed bottom-32 left-0 right-0 text-xl">
        段落顺序：ABABCAB
      </div>

      <div className="fixed bottom-16 left-0 right-0">
        <div className="container mx-auto grid grid-cols-3">
          <div className="p-5 text-center">上一首</div>
          <div className="p-5 text-center" onClick={toList}>
            回歌单
          </div>
          <div className="p-5 text-center">下一首</div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <div className="container mx-auto bg-blue-500 p-5 text-center">
          播放器
        </div>
      </div>
    </div>
  );
};
