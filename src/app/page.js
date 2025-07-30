import Image from 'next/image';
import Headline from './Headline';
import Footer from './Footer';
import Link from 'next/link';
import { Calendar, Music, Plus } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Headline title="敬拜诗歌本" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-3xl"></div>
        <div className="relative container mx-auto px-6 pt-32 pb-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              敬拜诗歌本
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              专为教会赞美队设计的现代化诗歌管理工具
              <br />
              让每一次敬拜都更加专注、更加美好
            </p>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="card p-6 text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">智能日历</h3>
                <p className="text-slate-600 text-sm">按日期查看歌单，轻松规划每次服事</p>
              </div>
              
              <div className="card p-6 text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">完整歌库</h3>
                <p className="text-slate-600 text-sm">歌谱、音频、备注一站式管理</p>
              </div>
              
              <div className="card p-6 text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">团队协作</h3>
                <p className="text-slate-600 text-sm">同工共享，随时同步最新版本</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/calendar" className="group">
                <button className="btn-primary flex items-center gap-3 px-8 py-4 text-lg">
                  <Calendar className="w-5 h-5" />
                  浏览歌单
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </Link>
              
              <Link href="/create-songlist" className="group">
                <button className="btn-secondary flex items-center gap-3 px-8 py-4 text-lg">
                  <Plus className="w-5 h-5" />
                  创建歌单
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-12">
        <p className="text-slate-500 text-sm">
          愿这个工具帮助你更专注于敬拜本身
        </p>
      </div>
    </div>
  );
}
