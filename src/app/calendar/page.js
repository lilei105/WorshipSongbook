'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Headline from '../Headline';
import Footer from '../Footer';

export default () => {
  return (
    <div>
      <Headline title="选择一个日期，查看该日的歌单" />

      <div className="mt-20 flex justify-center pb-4 border-b-4">
        <div className="border border-gray-200">
          <Calendar locale="zh" />
        </div>
      </div>

      <div className="px-4">
        <ul className="my-5 border rounded space-y-2 bg-slate-200">
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
          <li>&nbsp;</li>
        </ul>
      </div>

      <Footer title="回到首页" />
    </div>
  );
};
