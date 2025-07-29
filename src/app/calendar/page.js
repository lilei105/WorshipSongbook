"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Headline from "../Headline";
import Footer from "../Footer";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import axios from "axios";
// import Collapsible from 'react-collapsible';

const Collapsible = dynamic(() => import("react-collapsible"), {
  ssr: false,
});

function isNullOrEmpty(value) {
  return value === null || value === undefined || value === "";
}

//根据API传来的数据生成多个可折叠的内容
const CollapContent = ({ content }) => {
  // console.log('content fetched from api is: ', content);
  let title = "";
  let songlistId = 0;
  let songs = [];
  let str = "";

  if (isNullOrEmpty(content) || content.length < 1) {
    return CollapItem("今日没有数据", 0, [], 0);
  }

  //有多少个list就生成多少串Collapsible，最后一起返回
  function buildData(content) {
    return content.map(
      (list, index) => (
        (title = dayjs(list.date).format("YYYY年MM月DD日") + " " + list.name),
        // console.log(title),
        (songlistId = list.id),
        (songs = list["songs"]),
        CollapItem(title, songlistId, songs, index)
      )
    );
  }

  // str = buildData(content);
  // console.log(str);

  return buildData(content);
};

//处理点击事件，向/list页面POST列表ID和标题
function handleClick(e, songlistId, title) {
  // e.preventDefault();
  // console.log(title);

  if (!isNullOrEmpty(window)) {
    window.sessionStorage.setItem("songlistId", songlistId);
    window.sessionStorage.setItem("title", title);
  }

  // axios.get("/list").catch((error) => {
  //   console.error(error);
  // });
}

//只管按可折叠的格式显示标题和内容
const CollapItem = (title, songlistId, songs, index) => (
  <Collapsible
    open={index == 0 ? true : false}
    className="card mb-4 overflow-hidden"
    openedClassName="card mb-4"
    transitionTime={200}
    trigger={
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
        <span className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          {title}
        </span>
        <span className="text-xl transition-transform duration-200" 
              style={{ transform: 'rotate(0deg)' }}
              data-collapsible-trigger>▼</span>
      </div>
    }
    triggerWhenOpen={
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-medium cursor-pointer">
        <span className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          {title}
        </span>
        <span className="text-xl transition-transform duration-200" 
              style={{ transform: 'rotate(180deg)' }}
              data-collapsible-trigger>▼</span>
      </div>
    }
    triggerTagName="div"
    key={index}
  >
    <div className="p-6 bg-white/50 backdrop-blur-sm">
      <Link href="/list" onClick={(e) => handleClick(e, songlistId, title)}>
        <div className="grid gap-3">
          {songs.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/80 transition-colors duration-200 cursor-pointer group">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-slate-700 font-medium group-hover:text-purple-600 transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Link>
    </div>
  </Collapsible>
);

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [data, setData] = useState();

  //处理鼠标点击的事件，将所选日期格式化为YYYY-MM-DD格式，
  //改变selectedDate，触发useEffect
  function handleSelectDateChanged(value) {
    setSelectedDate(dayjs(value).format("YYYY-MM-DD"));
  }

  //使用useEffect，每当selectedDate改变时触发api查询，
  //并把api返回的结果以json形式更新到data里
  useEffect(() => {
    axios
      .get(`/api/getByDate?date=${selectedDate}`)
      .then((res) => {
        let data = isNullOrEmpty(res.data.data) ? [] : res.data.data;
        // console.log('updating data: ', data);

        setData(data);
      })
      .catch((error) => console.error(error));
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title="选择日期查看歌单" />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              选择日期
            </h2>
            <div className="flex justify-center">
              <Calendar 
                locale="zh" 
                onChange={handleSelectDateChanged} 
                className="react-calendar-modern"
              />
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              {selectedDate} 的歌单
            </h3>
          </div>
          
          <div className="space-y-4">
            <CollapContent content={data} />
          </div>
        </div>
      </div>
      
      <div className="text-center py-8">
        <Link href="/" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors"
        >
          <span>←</span> 回到首页
        </Link>
      </div>
    </div>
  );
}
