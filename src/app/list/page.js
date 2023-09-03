"use client";

import { useState, useEffect } from "react";
import Headline from "../Headline";
import Image from "next/image";
import Footer from "../Footer";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function SongList() {
  const [songs, setSongs] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const listid = searchParams.get("songlistid");
  console.log("query params: ", listid);

  axios
    .get(`/api/getByList?songlistid=${listid}`)
    .then((res) => {
      console.log("songs: ", res.data);
      setSongs(res.data["data"]);
    })
    .catch((error) => console.error(error));

  const handleClick = (image) => {
    console.log(image);
    setTimeout(() => {
      console.log("Paused for 1 second");
    }, 1000);
  };

  return (
    <div>
      <Headline title="2023年9月3日 主日敬拜" />

      <div className="pt-16 grid grid-cols-2 pb-20">
        {songs.map((image, index) => (
          <div key={index} className=" relative">
            <Link href={"/detail"}>
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
