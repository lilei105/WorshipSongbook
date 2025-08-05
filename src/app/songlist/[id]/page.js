"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Headline from "../../Headline";
import authAxios from "@/lib/auth-api";
import { Music, Calendar, Plus, Edit3 } from "lucide-react";

export default function SonglistDetail() {
  const params = useParams();
  const router = useRouter();
  const songlistId = params.id;

  const [songlist, setSonglist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSonglist();
  }, [songlistId]);

  const fetchSonglist = async () => {
    try {
      const response = await authAxios.get(`/api/songlist/${songlistId}`);
      setSonglist(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("获取歌单失败");
      setLoading(false);
      console.error("获取歌单失败:", err);
      if (err.response?.status === 401) {
        window.location.href = '/login';
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Headline title="加载中..." />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">加载歌单中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !songlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Headline title="歌单不存在" />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-12 h-12 text-slate-500" />
            </div>
            <p className="text-slate-600 text-lg mb-4">{error || "歌单不存在"}</p>
            <button
              onClick={() => router.push('/calendar')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              返回日历
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title={songlist.name || "歌单详情"} />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 歌单信息卡片 */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{songlist.name}</h2>
              <button
                onClick={() => router.push(`/songlist/${songlistId}/add-songs`)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加更多歌曲
              </button>
            </div>
            
            {songlist.date && (
              <p className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(songlist.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            
            <p className="text-slate-600 mt-2">
              共 {songlist.songs?.length || 0} 首歌曲
            </p>
          </div>

          {/* 歌曲列表 */}
          <div className="card p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">歌曲列表</h3>
            
            {songlist.songs?.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-slate-500">这个歌单还没有添加歌曲</p>
                <button
                  onClick={() => router.push(`/songlist/${songlistId}/add-songs`)}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  开始添加歌曲
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {songlist.songs?.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{song.name}</h4>
                        {song.by && <p className="text-sm text-slate-600">{song.by}</p>}
                        {song.note && <p className="text-sm text-slate-500">{song.note}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {song.sheet_url && (
                        <a
                          href={song.sheet_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          歌谱
                        </a>
                      )}
                      {song.audio_url && (
                        <a
                          href={song.audio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          音频
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部导航 */}
          <div className="text-center space-y-4">
            <button
              onClick={() => router.push('/calendar')}
              className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              📅 返回日历
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              🏠 返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}