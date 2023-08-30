"use client";

import { useRouter } from "next/navigation";
import Headline from "../Headline";
import Footer from "../Footer";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from "media-chrome/dist/react";

export default () => {
  const router = useRouter();

  const audio_url =
    "http://1253489749.vod2.myqcloud.com/9d4470b6vodcq1253489749/7cf9d72e5576678020597380155/iIaFmFC1RmUA.mp3";

  async function toList() {
    await router.push("/list");
  }

  return (
    <div>
      <Headline title="2023年9月3日 主日敬拜" />

      <div className="mt-16">
        <img src="/images/1.png" alt="歌谱图片" className="max-w-full h-auto" />
      </div>

      <div className=" pt-60"></div>

      <div className="container mx-auto max-w-screen-sm bg-zinc-300 p-5 fixed bottom-32 text-xl">
        段落顺序：ABABCAB
      </div>

      <div className="container mx-auto max-w-screen-sm fixed bottom-16">
        <div className="container mx-auto items-center ">
          {/* <div className="p-5 text-center">上一首</div> */}
          <MediaController audio>
            <audio slot="media" src={audio_url} />
            <MediaControlBar style={{ width: "100%" }}>
              <MediaPlayButton>
                <span slot="play" className=" text-4xl">Play</span>
                <span slot="pause">Pause</span>
              </MediaPlayButton>
              <MediaTimeRange></MediaTimeRange>
              <MediaTimeDisplay showDuration></MediaTimeDisplay>
            </MediaControlBar>
          </MediaController>
          {/* <div className="p-5 text-center">下一首</div> */}
        </div>
      </div>

      <Footer title="回到歌曲列表" />
    </div>
  );
};
