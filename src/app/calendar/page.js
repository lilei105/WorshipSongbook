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
    className=" bg-slate-500 p-2 "
    openedClassName="bg-slate-300"
    transitionTime={100}
    trigger={<div>&#10148; {title}</div>}
    triggerWhenOpen={<div>&#11167; {title}</div>}
    triggerTagName="div"
    triggerOpenedClassName=" bg-slate-500 text-xl p-2 "
    key={index}
  >
    {/* <Link href={'/list?listId=' + songlistId + '&title=' + title}> */}
    <Link href="/list" onClick={(e) => handleClick(e, songlistId, title)}>
      <div className="ml-4">
        {songs.map((item, index) => (
          <p key={index}>
            {index + 1}. {item.name}
          </p>
        ))}
      </div>
    </Link>
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
    <div>
      <Headline title="选择一个日期，查看该日歌单" />
      <div className="pt-20 flex justify-center pb-2 border-b-2 border-slate-400">
        <Calendar locale="zh" onChange={handleSelectDateChanged} />
      </div>
      <div className="px-4 pb-20 mt-2 divide-y-2 ">
        <CollapContent content={data} />
      </div>
      <Footer title="回到首页" />
    </div>
  );
}
