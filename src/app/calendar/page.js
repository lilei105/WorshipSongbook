"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Headline from "../Headline";
import Footer from "../Footer";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
// import Collapsible from 'react-collapsible';

const Collapsible = dynamic(() => import("react-collapsible"), {
  ssr: false,
});

//根据API传来的数据生成多个可折叠的内容
const CollapContent = ({ content }) => {
  function isNullOrEmpty(value) {
    return value === null || value === undefined || value === "";
  }

  console.log("content fetched from api is: ", content);
  let title = "";
  let songlistid = 0;
  let songs = [];
  let str = "";

  if (
    isNullOrEmpty(content) ||
    isNullOrEmpty(content["data"]) ||
    content["data"].length < 1
  ) {
    return CollapItem("今日没有数据", 0, [], 0);
  }

  //从json对象中取出数组
  content = content["data"];
  console.log("updated content is: ", content);

  //有多少个list就生成多少串Collapsible，最后一起返回
  function buildData(content) {
    return content.map(
      (list, index) => (
        (title = " " + list.name),
        // console.log(title),
        (songlistid = list.id),
        (songs = list["songs"]),
        // console.log("title = ", title),
        // console.log("songlistid = ", songlistid),
        // console.log("songs = ", songs),
        // console.log("index = ", index),

        CollapItem(title, songlistid, songs, index)
      )
    );
  }

  str = buildData(content);
  console.log(str);

  return str;
};

//只管按可折叠的格式显示标题和内容
const CollapItem = (title, songlistid, songs, index) => (
  <Collapsible
    open={index == 0 ? true : false}
    className=" bg-slate-500 text-xl p-2 "
    openedClassName="bg-slate-300"
    transitionTime={100}
    trigger={<div>&#10148; {title}</div>}
    triggerWhenOpen={<div>&#11167; {title}</div>}
    triggerTagName="div"
    triggerOpenedClassName=" bg-slate-500 text-xl p-2 "
    key={index}
  >
    <Link href={"/list?songlistid=" + songlistid}>
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
    fetch(`/api/getByDate?date=${selectedDate}`)
      .then((res) => res.json())

      .then((data) => {
        console.log("updating data: ", data);

        setData(data);
      })
      .catch((error) => console.error(error));
  }, [selectedDate]);

  // if (data && data.data && data.data[0]) {
  //   title = data.data[0].date;
  //   content = data.data[0].name;
  // }

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
