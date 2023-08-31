"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Headline from "../Headline";
import Footer from "../Footer";
import WaveSurfer from "wavesurfer.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline";

// Import React hooks
import { useRef, useState, useEffect, useCallback } from "react";

export default function Detail() {
  const router = useRouter();

  const audio_url =
    "http://1253489749.vod2.myqcloud.com/9d4470b6vodcq1253489749/7cf9d72e5576678020597380155/iIaFmFC1RmUA.mp3";

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
          console.log("ready at ", duration + "s");
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
      <div className="h-20 flex items-center">
        <div
          className="bg-slate-400 w-20 h-20 flex items-center justify-center text-2xl lp border-8 border-white rounded-3xl"
          onClick={onPlayClick}
        >
          <p>{isPlaying ? "暂停" : "播放"}</p>
        </div>

        <div className="flex-grow">
          <div className={isReady ? "hidden" : "visible text-center"}>
            <p>正在加载，请稍候...</p>
          </div>

          <div className={isReady ? "visible flex-grow" : "hidden"} ref={containerRef} />

          {/* <div className="flex-grow text-center">
            {!isReady && "Loading..."}
          </div>
          <div className="flex-grow" ref={containerRef} /> */}
        </div>
        {/* <p>Seconds played: {currentTime}</p> */}
      </div>
    );
  };

  return (
    <div>
      <Headline title="段落顺序：ABABCAB" />

      <div className="mt-16">
        <img src="/images/2.png" alt="歌谱图片" className="max-w-full h-auto" />
      </div>

      <div className=" pt-40"></div>

      {/* <div className="container mx-auto max-w-screen-sm bg-zinc-300 p-5 fixed bottom-32 text-xl">
        段落顺序：ABABCAB
      </div> */}

      <div className="container mx-auto max-w-screen-sm fixed bottom-16">
        <div className="container mx-auto items-center ">
          {/* <div className="p-5 text-center">上一首</div> */}

          <WaveSurferPlayer
            height={80}
            waveColor="rgb(200, 0, 200)"
            progressColor="rgb(100, 0, 100)"
            url={audio_url}
            // plugins={[Timeline.create()]}
          />

          {/* <div className="p-5 text-center">下一首</div> */}
        </div>
      </div>

      <Footer title="回到歌曲列表" />
    </div>
  );
}
