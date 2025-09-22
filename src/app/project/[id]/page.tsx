'use client';

import { AppLayout } from '@/components/app-layout';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectKanban } from '@/components/project/project-kanban';
import { ProjectTaskList } from '@/components/project/project-task-list';
import { ProjectTimeline } from '@/components/project/project-timeline';
import { ProjectMembers } from '@/components/project/project-members';
import { useProjectDetail } from '@/hooks/useProjectDetail';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Users, List, Layout } from 'lucide-react';
import { useState } from 'react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'timeline' | 'members'>('board');
  
  const {
    project,
    tasks,
    members,
    stats,
    loading,
    updateProject,
    addTask,
    updateTask,
    deleteTask,
    addMember,
    removeMember
  } = useProjectDetail(projectId);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">加载中...</div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">项目不存在</div>;
  }

  const tabs = [
    { id: 'board', label: '看板', icon: Layout },
    { id: 'list', label: '列表', icon: List },
    { id: 'timeline', label: '时间线', icon: Calendar },
    { id: 'members', label: '成员', icon: Users },
  ];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Link 
            href="/project" 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900 inline-flex mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回项目列表
          </Link>
          
          <ProjectHeader 
            project={project} 
            stats={stats}
            onUpdate={updateProject}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'board' | 'list' | 'timeline' | 'members')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'board' && (
              <ProjectKanban
                tasks={tasks}
                onTaskUpdate={updateTask}
                onTaskAdd={addTask}
                members={members}
              />
            )}
            
            {activeTab === 'list' && (
              <ProjectTaskList
                tasks={tasks}
                onTaskUpdate={updateTask}
                onTaskDelete={deleteTask}
                onTaskAdd={addTask}
                members={members}
              />
            )}
            
            {activeTab === 'timeline' && (
              <ProjectTimeline
                tasks={tasks}
                milestones={project.milestones}
              />
            )}
            
            {activeTab === 'members' && (
              <ProjectMembers
                members={members}
                onAddMember={addMember}
                onRemoveMember={removeMember}
                currentUserRole="owner"
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}