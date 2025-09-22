'use client';

import { AppLayout } from '@/components/app-layout';
import { ProjectList } from '@/components/project/project-list';
import { ProjectStats } from '@/components/project/project-stats';
import { ProjectFilterBar } from '@/components/project/project-filter-bar';
import { useProjects } from '@/hooks/useProjects';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProjectPage() {
  const router = useRouter();
  const {
    filteredProjects,
    stats,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    view,
    setView,
    createProject,
    deleteProject,
    loadProjects
  } = useProjects();

  const handleCreateProject = () => {
    try {
      console.log('ProjectPage: Creating new project...');
      const newProject = createProject();
      console.log('ProjectPage: New project created:', newProject);
      
      // 跳转到新项目详情页
      console.log('ProjectPage: Navigating to project detail:', `/project/${newProject.id}`);
      router.push(`/project/${newProject.id}`);
    } catch (error) {
      console.error('ProjectPage: Failed to create project:', error);
      alert('创建项目失败，请重试');
    }
  };

  // 页面加载时强制刷新项目数据
  useEffect(() => {
    console.log('ProjectPage: Page loaded, refreshing projects...');
    loadProjects();
  }, [loadProjects]);

  return (
    <AppLayout breadcrumbs={[{ label: '主页', href: '/' }, { label: '项目管理' }]}>
      <div className="w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                返回主页
              </Link>
            </div>
            <Button 
              onClick={handleCreateProject}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新建项目
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">项目管理</h1>
          <p className="text-gray-600">高效管理您的项目，跟踪进度和团队协作</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <ProjectStats stats={stats} />
        </div>

        <ProjectFilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          view={view}
          onViewChange={setView}
        />

        <div className="mt-6">
          <ProjectList
            projects={filteredProjects}
            view={view}
            onDelete={deleteProject}
          />
        </div>
      </div>
    </AppLayout>
  );
}