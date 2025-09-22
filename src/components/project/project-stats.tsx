'use client';

import { ProjectStats as ProjectStatsType } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  TrendingUp
} from 'lucide-react';

interface ProjectStatsProps {
  stats: ProjectStatsType;
}

export function ProjectStats({ stats }: ProjectStatsProps) {
  const statCards = [
    {
      title: '总项目数',
      value: stats.totalProjects,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: '活跃项目',
      value: stats.activeProjects,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: '已完成',
      value: stats.completedProjects,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      title: '逾期项目',
      value: stats.overdueProjects,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Card className="lg:col-span-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            整体完成率
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">项目完成率</span>
              <span className="text-lg font-semibold">{stats.completionRate}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-3" />
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                <p className="text-sm text-gray-600">总任务数</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
                <p className="text-sm text-gray-600">已完成</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.overdueTasks}</p>
                <p className="text-sm text-gray-600">已逾期</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}