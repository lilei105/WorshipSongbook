import Image from 'next/image';
import Headline from './Headline';
import Footer from './Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Headline title="Helloworld" />

      <div className="text-center text-xl pt-40 py-20">
        <Link href={'/calendar'}>
          <div className="bg-sky-300 p-6  mx-8 rounded-xl ">浏览歌单</div>
        </Link>

        <div className="bg-sky-300 p-6 mt-10 mx-8 rounded-xl ">创建歌单</div>
      </div>

      <Footer title="&nbsp; " />
    </div>
  );
}
