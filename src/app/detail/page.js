"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Headline from "../Headline";
import Link from "next/link";
import WaveSurfer from "wavesurfer.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline";

// Import React hooks
import { useRef, useState, useEffect, useCallback } from "react";

// 自定义图片组件，专门处理歌谱图片
const WorshipSongImage = ({ src, alt, className, style }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    setHasError(true);
  };

  const validSrc = safeUrl(src);

  if (validSrc && !hasError) {
    return (
      <img 
        src={validSrc}
        alt={alt}
        className={className}
        style={style}
        onError={handleError}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-slate-100 rounded-lg`}
          style={style}>
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎵</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">暂无歌谱</h3>
        <p className="text-slate-500">
          {validSrc ? '歌谱加载失败' : '这首诗歌暂时还没有上传歌谱'}
        </p>
      </div>
    </div>
  );
};

// 音频播放器空值处理
const SafeAudioPlayer = ({ url }) => {
  if (!url || url === 'null' || url === 'undefined') {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">音频播放</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔇</span>
            </div>
            <div>
              <h4 className="text-amber-700 font-medium">暂无音频</h4>
              <p className="text-amber-600 text-sm">这首诗歌暂时还没有上传音频文件</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">音频播放</h3>
      <audio controls className="w-full">
        <source src={url} type="audio/mpeg" />
        您的浏览器不支持音频播放。
      </audio>
    </div>
  );
};

// 增强的空值处理工具
function isNullOrEmpty(value) {
  return value === null || value === undefined || value === "" || value === "null" || value === "undefined";
}

// 安全获取值的工具函数
function safeValue(value, defaultValue = "") {
  return isNullOrEmpty(value) ? defaultValue : value;
}

// 安全URL检查工具 - 修复过于严格的验证
function safeUrl(url) {
  if (!url || isNullOrEmpty(url)) return null;
  
  // 放宽验证，允许更多格式的URL
  if (typeof url === 'string' && url.trim().length > 0) {
    // 允许http/https/相对路径/绝对路径等所有有效URL
    const trimmedUrl = url.trim();
    if (trimmedUrl !== 'null' && trimmedUrl !== 'undefined') {
      return trimmedUrl;
    }
  }
  return null;
}

export default function Detail() {
  const isBrowser = typeof window !== "undefined";
  const router = useRouter();

  // 安全获取所有sessionStorage值
  const [songData, setSongData] = useState({
    songName: "正在加载...",
    audioUrl: null,
    sheetUrl: null,
    songNote: ""
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const songName = safeValue(window.sessionStorage.getItem("song_name"), "未知歌曲");
      const audioUrl = safeUrl(window.sessionStorage.getItem("audio_url"));
      const sheetUrl = safeUrl(window.sessionStorage.getItem("sheet_url"));
      const songNote = safeValue(window.sessionStorage.getItem("song_note"), "");
      
      setSongData({
        songName,
        audioUrl,
        sheetUrl,
        songNote
      });
    }
  }, []);

  const { songName, audioUrl, sheetUrl, songNote } = songData;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title={songNote ? `${songName} - ${songNote}` : songName || "歌曲详情"} />

      <div className="container mx-auto px-4 pt-24 pb-8">

        <div className="mb-6">
          <WorshipSongImage 
            src={sheetUrl}
            alt={`${songName} 歌谱`}
            className="w-full h-auto object-contain rounded-2xl shadow-lg"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          />
        </div>

        <SafeAudioPlayer url={audioUrl} />
      </div>

      <div className="text-center py-8">
        <div className="flex justify-center gap-8">
          <Link href="/list" 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors"
          >
            <span>←</span> 返回歌曲列表
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
