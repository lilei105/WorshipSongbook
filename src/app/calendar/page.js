'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Headline from '../Headline';
import Footer from '../Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
// import Collapsible from 'react-collapsible';

const Collapsible = dynamic(() => import('react-collapsible'), {
  ssr: false,
});

const Collap = ({ title }) => {
  return (
    <Collapsible
      open={true}
      className=" bg-slate-500 text-xl p-2 "
      openedClassName="bg-slate-300"
      transitionTime={100}
      trigger={<div>&#10148; {title}</div>}
      triggerWhenOpen={<div>&#11167; {title}</div>}
      triggerTagName="div"
      triggerOpenedClassName=" bg-slate-500 text-xl p-2 "
      // triggerElementProps={{ id: '123456' }}
    >
      <Link href="/list">
        <div className="ml-4">
          <p>1. This is the collapsible content.</p>
          <p>2. This is the collapsible content.</p>
          <p>3. This is the collapsible content.</p>
          <p>4. This is the collapsible content.</p>
          <p>5. This is the collapsible content.</p>
          <p>6. This is the collapsible content.</p>
        </div>
      </Link>
    </Collapsible>
  );
};

export default function CalendarView() {
  return (
    <div>
      <Headline title="选择一个日期，查看该日歌单" />

      <div className="mt-20 flex justify-center pb-4 border-b-4">
        <div className="border border-gray-200">
          <Calendar locale="zh" />
        </div>
      </div>

      <div className="px-4 mt-2 divide-y-2">
        <Collap title="2023年9月3日 主日敬拜" />
        <Collap title="2023年9月3日 祷告会" />
      </div>

      <div className="mt-24"></div>

      <Footer title="回到首页" />
    </div>
  );
}
