'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string> | Array<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    try {
      console.log('DebugPage: Starting debug...');
      
      // 获取所有localStorage数据
      const projectsData = localStorage.getItem('ai-notebook-projects');
      console.log('DebugPage: Raw projects data:', projectsData);
      console.log('DebugPage: Checking other possible keys...');
      
      // 检查所有localStorage键
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`DebugPage: Found key ${i}:`, key);
        if (key && key.includes('notebook')) {
          console.log(`DebugPage: Found matching key:`, key, localStorage.getItem(key));
        }
      }
      
      if (projectsData) {
        const parsed = JSON.parse(projectsData);
        console.log('DebugPage: Parsed projects:', parsed);
        setLocalStorageData(parsed);
      } else {
        console.log('DebugPage: No projects data found in localStorage');
        setLocalStorageData({});
      }
    } catch (err) {
      console.error('DebugPage: Error reading localStorage:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const createTestProject = () => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    try {
      console.log('DebugPage: Creating test project...');
      const testProject = {
        id: `test-${Date.now()}`,
        name: '测试项目',
        description: '这是一个测试项目',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString(),
        progress: 0,
        ownerId: 'test-user',
        memberIds: ['test-user'],
        tags: ['test'],
        milestones: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingData = localStorage.getItem('ai-notebook-projects');
      const existingProjects = existingData ? JSON.parse(existingData) : [];
      const updatedProjects = [...existingProjects, testProject];
      
      localStorage.setItem('ai-notebook-projects', JSON.stringify(updatedProjects));
      console.log('DebugPage: Test project created and saved');
      
      // 刷新显示
      setLocalStorageData(updatedProjects);
    } catch (err) {
      console.error('DebugPage: Error creating test project:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const clearAllProjects = () => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    try {
      console.log('DebugPage: Clearing all projects...');
      localStorage.removeItem('ai-notebook-projects');
      setLocalStorageData([]);
      console.log('DebugPage: All projects cleared');
    } catch (err) {
      console.error('DebugPage: Error clearing projects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">调试页面</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>错误：</strong> {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">操作</h2>
          <div className="flex gap-4">
            <button
              onClick={createTestProject}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              创建测试项目
            </button>
            <button
              onClick={clearAllProjects}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              清除所有项目
            </button>
            <Link
              href="/project"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
            >
              返回项目列表
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">当前项目数据</h2>
          {localStorageData ? (
            <div>
              <p className="text-gray-600 mb-4">找到 {localStorageData.length} 个项目</p>
              <div className="space-y-4">
                {(localStorageData as Array<{id: string; name: string; description: string; status?: string; createdAt?: string}>).map((project, index) => (
                  <div key={project.id || index} className="border border-gray-200 rounded p-4">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    <p className="text-gray-600 text-sm">{project.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>ID: {project.id}</p>
                      {project.status && <p>状态: {project.status}</p>}
                      {project.createdAt && <p>创建时间: {project.createdAt}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">没有项目数据</p>
          )}
        </div>
      </div>
    </div>
  );
}