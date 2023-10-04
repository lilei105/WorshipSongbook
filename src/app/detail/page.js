"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Headline from "../Headline";
import Footer from "../Footer";
import WaveSurfer from "wavesurfer.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline";

// Import React hooks
import { useRef, useState, useEffect, useCallback } from "react";

function isNullOrEmpty(value) {
  return value === null || value === undefined || value === "";
}

export default function Detail() {
  const isBrowser = typeof window !== "undefined";
  const router = useRouter();

  // const song_title = window.sessionStorage.getItem("title");
  const song_name = window.sessionStorage.getItem("song_name");
  const audio_url = window.sessionStorage.getItem("audio_url");
  const sheet_url = window.sessionStorage.getItem("sheet_url");
  const song_note = window.sessionStorage.getItem("song_note");

  console.log("song_note: ", song_note);

  // const audio_url = "https://1253489749.vod2.myqcloud.com/9d4470b6vodcq1253489749/7cf9d72e5576678020597380155/iIaFmFC1RmUA.mp3";

  // WaveSurfer hook
  const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState(null);

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
      if (!containerRef.current) return;

      const ws = WaveSurfer.create({
        ...options,
        container: containerRef.current,
      });

      setWavesurfer(ws);

      return () => {
        ws.destroy();
      };
    }, [options, containerRef]);

    return wavesurfer;
  };

  // Create a React component that will render wavesurfer.
  // Props are wavesurfer options.
  const WaveSurferPlayer = (props) => {
    const containerRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const wavesurfer = useWavesurfer(containerRef, props);

    // On play button click
    const onPlayClick = useCallback(() => {
      console.log("isReady = ", isReady);
      if (wavesurfer && wavesurfer.getDuration()) {
        wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
      }
    }, [wavesurfer]);

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
      if (!wavesurfer) return;

      setCurrentTime(0);
      setIsPlaying(false);

      const subscriptions = [
        wavesurfer.on("play", () => {
          console.log("is playing");
          setIsPlaying(true);
          // console.log('isPlaying = ', isPlaying);
        }),
        wavesurfer.on("pause", () => {
          console.log("paused");
          setIsPlaying(false);
        }),
        wavesurfer.on("ready", (duration) => {
          console.log("ready, song length = ", duration + "s");
          setIsReady(true);
        }),
        wavesurfer.on("timeupdate", (currentTime) =>
          setCurrentTime(currentTime)
        ),
      ];

      return () => {
        subscriptions.forEach((unsub) => unsub());
      };
    }, [wavesurfer]);

    return (
      //播放器的布局
      <div className="h-16 flex items-center bg-gradient-to-b from-white to-slate-300">
        <div>
          <div
            className="bg-sky-400 w-12 h-12 flex items-center justify-center  mt-2 mb-2 ml-2 mr-2 rounded-3xl"
            onClick={onPlayClick}
          >
            <p>{isPlaying ? "暂停" : "播放"}</p>
          </div>
        </div>

        <div className="flex-grow ">
          <div className={isReady ? "hidden" : "visible text-center"}>
            <p>正在加载，请稍候...</p>
          </div>

          <div
            className={isReady ? "visible flex-grow" : "hidden"}
            ref={containerRef}
          />
        </div>
        {/* <p>Seconds played: {currentTime}</p> */}
      </div>
    );
  };

  return (
    //Detail页面的总布局
    <div>
      <Headline title={isNullOrEmpty(song_note) ? song_name : song_note} />

      <div className="pt-16 pb-20">
        <img src={sheet_url} alt="歌谱图片" className="max-w-full h-auto" />
      </div>

      <div className="container mx-auto max-w-screen-sm fixed bottom-16">
        <div className="container mx-auto items-center ">
          {/* <div className="p-5 text-center">上一首</div> */}

          <WaveSurferPlayer
            height={48}
            waveColor="rgb(200, 0, 200)"
            progressColor="rgb(100, 0, 100)"
            url={audio_url}
            plugins={[Timeline.create({ height: 16 })]}
          />

          {/* <div className="p-5 text-center">下一首</div> */}
        </div>
      </div>

      <Footer title="回到歌曲列表" />
    </div>
  );
}
