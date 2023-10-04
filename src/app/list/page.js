"use client";

import { useState, useEffect } from "react";
import Headline from "../Headline";
import Image from "next/image";
import Footer from "../Footer";
import Link from "next/link";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

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
    <div>
      <Headline title={title} />

      <div className="pt-16 grid grid-cols-2 pb-20">
        {songs.map((image, index) => (
          <div key={index} className="relative">
            <Link
              href={"/detail"}
              onClick={(e) =>
                handleClick(
                  e,
                  image["name"],
                  image["audio_url"],
                  image["sheet_url"],
                  image["note"]
                )
              }
            >
              <div className=" bg-blue-300 border border-zinc-300 p-2 absolute top-0 left-0 w-full ">
                {image["name"]}
              </div>

              <div className="h-auto m-1 ">
                <img src={image["sheet_url"]} alt="歌谱图片" />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Footer title="回到日历" />
    </div>
  );
}
