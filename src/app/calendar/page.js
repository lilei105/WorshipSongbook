'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Headline from '../Headline';
import Footer from '../Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import dayjs from 'dayjs';
// import Collapsible from 'react-collapsible';

const Collapsible = dynamic(() => import('react-collapsible'), {
  ssr: false,
});

//可折叠的内容区
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
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 初始化执行
  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
      });
  }, []);

  function handleSelectDateChanged(value) {
    console.log({ value });
    const str = dayjs(value).format('YYYY-MM-DD');
    console.log({ str });
    setSelectedDate(value);
  }

  return (
    //页面总布局
    <div>
      <Headline title="选择一个日期，查看该日歌单" />

      <div className="pt-20 flex justify-center pb-2 border-b-2 border-slate-400">
        <div className="border border-gray-200">
          <Calendar locale="zh" onChange={handleSelectDateChanged} />
        </div>
      </div>

      <div className="px-4 pb-20 mt-2 divide-y-2 ">
        <Collap title="2023年9月3日 主日敬拜" />
      </div>

      <Footer title="回到首页" />
    </div>
  );
}
