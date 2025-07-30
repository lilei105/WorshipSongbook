"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Headline from "../../../Headline";
import axios from "axios";
import { Search, Plus, Music, Upload, Check } from "lucide-react";

export default function AddSongsToSonglist() {
  const params = useParams();
  const router = useRouter();
  const songlistId = params.id;

  const [activeTab, setActiveTab] = useState("search");
  const [songlist, setSonglist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 新歌曲表单状态
  const [newSong, setNewSong] = useState({
    name: "",
    by: "",
    note: "",
    sheet_url: "",
    audio_url: "",
  });

  // 获取歌单信息
  useEffect(() => {
    fetchSonglist();
    fetchAllSongs();
  }, [songlistId]);

  const fetchSonglist = async () => {
    try {
      const response = await axios.get(`/api/songlist/${songlistId}`);
      setSonglist(response.data.data);
    } catch (err) {
      console.error("获取歌单失败:", err);
    }
  };

  const fetchAllSongs = async (page = 1) => {
    try {
      const response = await axios.get(`/api/songs?page=${page}&limit=10`);
      setSongs(response.data.data);
    } catch (err) {
      console.error("获取歌曲列表失败:", err);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/songs/search?q=${query}`);
      setSearchResults(response.data.data);
    } catch (err) {
      console.error("搜索失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const addExistingSong = async (songId) => {
    try {
      await axios.post(`/api/songlist/${songlistId}/add-song`, {
        songId,
      });
      alert("歌曲已添加到歌单！");
      fetchAllSongs(); // 刷新列表
    } catch (err) {
      setError("添加失败，请重试");
    }
  };

  const createNewSong = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/songs/create", newSong);
      const newSongId = response.data.data.id;
      
      await axios.post(`/api/songlist/${songlistId}/add-song`, {
        songId: newSongId,
      });

      alert("新歌曲已创建并添加到歌单！");
      setNewSong({
        name: "",
        by: "",
        note: "",
        sheet_url: "",
        audio_url: "",
      });
      fetchAllSongs();
    } catch (err) {
      setError("创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ tabId, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        activeTab === tabId
          ? "bg-purple-500 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title={`添加歌曲 - ${songlist?.name || "歌单"}`} />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 标签切换 */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-2 flex gap-2">
            <TabButton tabId="search" label="搜索歌曲" icon={Search} />
            <TabButton tabId="upload" label="上传新歌" icon={Upload} />
          </div>

          {/* 搜索歌曲标签页 */}
          {activeTab === "search" && (
            <div className="card p-6">
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="搜索歌曲名称、演唱者或备注... 按回车键搜索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchQuery);
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    搜索
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {searchQuery ? (
                  searchResults.length > 0 ? (
                    searchResults.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Music className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800">{song.name}</h3>
                            {song.by && (
                              <p className="text-sm text-slate-600">{song.by}</p>
                            )}
                            {song.note && (
                              <p className="text-sm text-slate-500">{song.note}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => addExistingSong(song.id)}
                          className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          添加
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      {loading ? "搜索中..." : "未找到匹配的歌曲"}
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    请在上方输入关键词后按回车键搜索，或浏览下方的完整歌曲列表
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 上传新歌标签页 */}
          {activeTab === "upload" && (
            <div className="card p-6">
              <form onSubmit={createNewSong} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">歌曲名称 *</label>
                  <input
                    type="text"
                    value={newSong.name}
                    onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">演唱者</label>
                  <input
                    type="text"
                    value={newSong.by}
                    onChange={(e) => setNewSong({ ...newSong, by: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">备注</label>
                  <textarea
                    value={newSong.note}
                    onChange={(e) => setNewSong({ ...newSong, note: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">歌谱URL</label>
                  <input
                    type="url"
                    value={newSong.sheet_url}
                    onChange={(e) => setNewSong({ ...newSong, sheet_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="https://example.com/sheet.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">音频URL</label>
                  <input
                    type="url"
                    value={newSong.audio_url}
                    onChange={(e) => setNewSong({ ...newSong, audio_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !newSong.name.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {loading ? "创建中..." : "创建并添加"}
                </button>
              </form>
            </div>
          )}

          {/* 当前所有歌曲库 - 仅在无搜索结果时显示 */}
          {!searchQuery && (
            <div className="card p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">浏览所有歌曲</h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium">{song.name}</p>
                      {song.by && <p className="text-sm text-slate-600">{song.by}</p>}
                    </div>
                    <button
                      onClick={() => addExistingSong(song.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      添加
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 完成按钮 */}
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push(`/songlist/${songlistId}`)}
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium cursor-pointer"
              >
                ✓ 完成添加
              </button>
              <button
                onClick={() => router.push('/calendar')}
                className="px-8 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium cursor-pointer"
              >
                📅 返回日历
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              已添加的歌曲将自动保存，无需其他操作
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}