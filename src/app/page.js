'use client';

import { useState, useEffect } from 'react';
import Headline from './Headline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Music, Plus, User, LogOut } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 animate-ping border-2 border-blue-400 opacity-20"></div>
        </div>
        <p className="absolute bottom-1/3 text-slate-600 text-sm animate-pulse">正在加载敬拜诗歌本...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Headline title="敬拜诗歌本" />
        
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
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                <Link href="/login" className="group">
                  <button className="btn-primary flex items-center gap-3 px-8 py-4 text-lg"
                         style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem' }}>
                    <User className="w-5 h-5" />
                    登录
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
                
                <Link href="/organizations/select" className="group">
                  <button className="btn-secondary flex items-center gap-3 px-8 py-4 text-lg"
                         style={{ border: '2px solid #3b82f6', color: '#3b82f6', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', backgroundColor: 'white' }}>
                    <Plus className="w-5 h-5" />
                    注册新账号
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
            </div>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">
            愿这个工具帮助你更专注于敬拜本身
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      
      <Headline title="敬拜诗歌本" />
      
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            欢迎回来
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            开始管理您的敬拜歌单吧！
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <Link href="/calendar" className="group transform hover:scale-105 transition-all duration-300">
              <button className="btn-primary flex items-center gap-3 px-8 py-4 text-lg"
                     style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem' }}>
                <Calendar className="w-5 h-5" />
                浏览歌单
              </button>
            </Link>
            
            <Link href="/create-songlist" className="group transform hover:scale-105 transition-all duration-300">
              <button className="btn-secondary flex items-center gap-3 px-8 py-4 text-lg"
                     style={{ border: '2px solid #3b82f6', color: '#3b82f6', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', backgroundColor: 'white' }}>
                <Plus className="w-5 h-5" />
                创建歌单
              </button>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="group transform hover:scale-105 transition-all duration-300"
            >
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-lg shadow-md flex items-center gap-3 text-lg transition-all duration-200 transform hover:scale-105"
                     style={{ backgroundColor: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem' }}>
                <LogOut className="w-5 h-5" />
                退出登录
                
              </button>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
        </div>

        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">
            愿这个工具帮助你更专注于敬拜本身
          </p>
        </div>
      </div>
    </div>
  );
}
