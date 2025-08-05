'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrganizationSelect() {
  const [searchQuery, setSearchQuery] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgData, setNewOrgData] = useState({ name: '', location: '', type: 'church' });
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const searchOrganizations = async (query) => {
    if (!query.trim()) {
      setOrganizations([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/organizations/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setOrganizations(data.data);
      }
    } catch (error) {
      console.error('搜索组织失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchOrganizations(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleOrganizationSelect = (organization) => {
    sessionStorage.setItem('selectedOrganization', JSON.stringify(organization));
    router.push('/register');
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    if (!newOrgData.name.trim() || !newOrgData.location.trim()) {
      alert('请填写组织名称和位置');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/organizations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrgData),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('selectedOrganization', JSON.stringify(data.data));
        router.push('/register');
      } else {
        alert(data.error || '创建组织失败');
      }
    } catch (error) {
      console.error('创建组织失败:', error);
      alert('创建组织失败，请重试');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            选择您的组织
          </h1>
          <p className="text-gray-600">
            首先选择您所在的教会或组织
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">搜索现有组织</h2>
          <input
            type="text"
            placeholder="输入组织名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}

          {organizations.length > 0 && (
            <div className="mt-4 space-y-2">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrganizationSelect(org)}
                  className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-sm text-gray-600">{org.location}</div>
                  <div className="text-xs text-gray-500">{org.type}</div>
                </button>
              ))}
            </div>
          )}

          {searchQuery && !loading && organizations.length === 0 && (
            <div className="mt-4 text-center text-gray-500">
              未找到匹配的组织
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">创建新组织</h2>
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              创建新组织
            </button>
          ) : (
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  组织名称 *
                </label>
                <input
                  type="text"
                  value={newOrgData.name}
                  onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  位置 *
                </label>
                <input
                  type="text"
                  value={newOrgData.location}
                  onChange={(e) => setNewOrgData({ ...newOrgData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如：北京、上海"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  类型
                </label>
                <select
                  value={newOrgData.type}
                  onChange={(e) => setNewOrgData({ ...newOrgData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="church">教会</option>
                  <option value="ministry">事工</option>
                  <option value="group">小组</option>
                  <option value="band">乐队</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {creating ? '创建中...' : '创建组织'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  取消
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}