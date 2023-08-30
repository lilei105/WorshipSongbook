import Image from 'next/image';
import Headline from './Headline';
import Footer from './Footer';

export default function Home() {
  return (
    <div>
      <Headline title="Helloworld" />

      <div className="text-center text-xl">
        <div className="bg-cyan-500 p-6 mt-40 mx-8 rounded-xl ">浏览歌单</div>
        <div className="bg-cyan-500 p-6 mt-10 mx-8 rounded-xl ">创建歌单</div>

        <div className="mt-40"></div>
      </div>

      <Footer title="&nbsp; " />
    </div>
  );
}
