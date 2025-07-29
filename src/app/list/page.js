"use client";

import { useState, useEffect } from "react";
import Headline from "../Headline";
import Image from "next/image";
import Link from "next/link";
import { Music } from 'lucide-react';
import axios from "axios";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

function isNullOrEmpty(value) {
  return value === null || value === undefined || value === "";
}

function handleClick(e, song_name, audio_url, sheet_url, song_note) {
  if (!isNullOrEmpty(window)) {
    window.sessionStorage.setItem("song_name", song_name);
    window.sessionStorage.setItem("audio_url", audio_url);
    window.sessionStorage.setItem("sheet_url", sheet_url);
    window.sessionStorage.setItem("song_note", song_note);
  } else {
    console.log("Window is not defined");
  }
}

export default function ShowSongsInList() {
  const [songs, setSongs] = useState([]);
  const isBrowser = typeof window !== "undefined";

  const listId = window.sessionStorage.getItem("songlistId");
  const title = window.sessionStorage.getItem("title");

  if (isBrowser) {
    useEffect(() => {
      axios
        .get(`/api/getByList?listId=${listId}`)
        .then((res) => {
          console.log("songs: ", res.data);
          setSongs(res.data["data"]);
        })
        .catch((error) => console.error(error));
    }, []);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title={title} />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-600">共 {songs.length} 首诗歌</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song, index) => (
            <div key={index} className="card group cursor-pointer animate-scale-in"
                 style={{ animationDelay: `${index * 0.1}s` }}>
              <Link href={"/detail"}
                    onClick={(e) =>
                      handleClick(
                        e,
                        song["name"],
                        song["audio_url"],
                        song["sheet_url"],
                        song["note"]
                      )
                    }
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl">
                  <img 
                    src={song["sheet_url"]} 
                    alt={song["name"]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                        <p className="text-slate-800 font-medium text-center text-sm">点击查看详情</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">
                    {song["name"]}
                  </h3>
                  
                  {song["by"] && (
                    <p className="text-sm text-slate-600 mb-2">演唱者: {song["by"]}</p>
                  )}
                  
                  {song["note"] && (
                    <p className="text-xs text-slate-500 line-clamp-2">{song["note"]}</p>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">#{index + 1}</span>
                    <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full">
                      查看详情
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-12 h-12 text-slate-500" />
            </div>
            <p className="text-slate-600 text-lg">暂无诗歌</p>
            <p className="text-slate-500 text-sm mt-2">这个歌单还没有添加诗歌</p>
          </div>
        )}
      </div>

      <div className="text-center py-8">
        <div className="flex justify-center gap-8">
          <Link href="/calendar" 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors"
          >
            <span>←</span> 返回日历
          </Link>
          
          <Link href="/" 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors"
          >
            <span>←</span> 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
