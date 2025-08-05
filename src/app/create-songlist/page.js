"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Headline from "../Headline";
import authAxios from "@/lib/auth-api";
import axios from "axios";
import { Calendar, Plus } from "lucide-react";

export default function CreateSonglist() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAxios.post("/api/songlist/create", {
        name,
        date: date || undefined,
      });

      if (response.data.success) {
        const songlistId = response.data.data.id;
        router.push(`/songlist/${songlistId}/add-songs`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "创建失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title="创建新歌单" />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-md mx-auto">
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              创建新歌单
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  歌单名称 *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="例如：主日献诗 2024"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  日期
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    创建中...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    创建并添加歌曲
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => window.history.back()}
              className="text-slate-600 hover:text-purple-600 transition-colors"
            >
              ← 返回
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}