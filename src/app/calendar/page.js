"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import Headline from "../Headline";
import Footer from "../Footer";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import authAxios from "@/lib/auth-api";
// import Collapsible from 'react-collapsible';

const Collapsible = dynamic(() => import("react-collapsible"), {
  ssr: false,
});

function isNullOrEmpty(value) {
  return value === null || value === undefined || value === "";
}

//根据API传来的数据生成多个可折叠的内容
const CollapsibleSongListContent = ({ content }) => {
  if (isNullOrEmpty(content) || content.length < 1) {
    return CollapsibleListItem("今日没有数据", 0, [], 0);
  }

  return content.map((list, index) => {
    const title = dayjs(list.date).format("YYYY年MM月DD日") + " " + list.name;
    const songlistId = list.id;
    const songs = list.songs || [];
    
    return CollapsibleListItem(title, songlistId, songs, index);
  });
};

//处理点击事件，向/list页面POST列表ID和标题
function handleClick(e, songlistId, title) {
  if (!isNullOrEmpty(window)) {
    window.sessionStorage.setItem("songlistId", songlistId);
    window.sessionStorage.setItem("title", title);
  }
}

//只管按可折叠的格式显示标题和内容
const CollapsibleListItem = (title, songlistId, songs, index) => (
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
  const [calendarData, setCalendarData] = useState({});
  const [activeMonth, setActiveMonth] = useState(new Date());

  //处理鼠标点击的事件，将所选日期格式化为YYYY-MM-DD格式，
  //改变selectedDate，触发useEffect
  function handleDateSelectionChange(value) {
    setSelectedDate(dayjs(value).format("YYYY-MM-DD"));
  }

  // 计算当前视图需要查询的日期范围
  const getDateRangeForMonth = useCallback((date) => {
    const start = dayjs(date).startOf('month').subtract(7, 'day');
    const end = dayjs(date).endOf('month').add(7, 'day');
    return {
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD')
    };
  }, []);

  // 批量查询日历数据
  const fetchCalendarData = useCallback(async (date) => {
    const { startDate, endDate } = getDateRangeForMonth(date);
    
    try {
      const response = await authAxios.get(`/api/getByDateRange?startDate=${startDate}&endDate=${endDate}`);
      
      if (response.data.data) {
        setCalendarData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      if (error.response?.status === 401) {
        // Redirect to login if unauthorized
        window.location.href = '/login';
      }
    }
  }, [getDateRangeForMonth]);

  // 检查日期是否有数据的函数
  const hasDataOnDate = useCallback((date) => {
    const dateKey = dayjs(date).format('YYYY-MM-DD');
    return calendarData[dateKey] && calendarData[dateKey].length > 0;
  }, [calendarData]);

  // 为日历单元格添加样式类
  const tileClassName = useCallback(({ date, view }) => {
    if (view !== 'month') return null;

    const classes = [];
    const today = dayjs().startOf('day');
    const currentDate = dayjs(date).startOf('day');

    // 添加今日样式
    if (currentDate.isSame(today, 'day')) {
      classes.push('calendar-today');
    }

    // 添加选中日期样式
    if (currentDate.format('YYYY-MM-DD') === selectedDate) {
      classes.push('calendar-selected');
    }

    // 添加有数据的日期样式
    if (hasDataOnDate(date)) {
      classes.push('calendar-has-data');
    }

    // 添加跨月日期样式
    const activeMonthStart = dayjs(activeMonth).startOf('month');
    const activeMonthEnd = dayjs(activeMonth).endOf('month');
    
    if (currentDate.isBefore(activeMonthStart) || currentDate.isAfter(activeMonthEnd)) {
      classes.push('calendar-neighboring-month');
    }

    return classes.join(' ');
  }, [selectedDate, activeMonth, hasDataOnDate]);

  // 为日历单元格添加内容标记
  const tileContent = useCallback(({ date, view }) => {
    if (view !== 'month' || !hasDataOnDate(date)) return null;

    const dateKey = dayjs(date).format('YYYY-MM-DD');
    const count = calendarData[dateKey]?.length || 0;

    return (
      <div className="calendar-data-indicator">
        <span className="calendar-badge">
          {count > 3 ? '3+' : count}
        </span>
      </div>
    );
  }, [hasDataOnDate, calendarData]);

  // 当活动月份变化时重新获取数据
  const handleActiveStartDateChange = useCallback(({ activeStartDate }) => {
    if (activeStartDate) {
      setActiveMonth(activeStartDate);
      fetchCalendarData(activeStartDate);
    }
  }, [fetchCalendarData]);

  // 初始加载数据
  useEffect(() => {
    fetchCalendarData(activeMonth);
  }, [fetchCalendarData, activeMonth]);

  // 使用useEffect，每当selectedDate改变时触发api查询，
  // 并把api返回的结果以json形式更新到data里
  useEffect(() => {
    authAxios
      .get(`/api/getByDate?date=${selectedDate}`)
      .then((res) => {
        let data = isNullOrEmpty(res.data.data) ? [] : res.data.data;
        // console.log('updating data: ', data);

        setData(data);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/login';
        } else {
          console.error("Error fetching data:", error);
        }
      });
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title="选择日期查看歌单" />
      
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto mb-8 px-2 sm:px-0">
          <div className="card p-4 sm:p-6">
            <div className="flex justify-center">
              <Calendar 
                locale="zh" 
                onChange={handleDateSelectionChange} 
                onActiveStartDateChange={handleActiveStartDateChange}
                tileClassName={tileClassName}
                tileContent={tileContent}
                value={new Date(selectedDate)}
                className="react-calendar-modern calendar-large"
                showNeighboringMonth={true}
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
            <CollapsibleSongListContent content={data} />
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
