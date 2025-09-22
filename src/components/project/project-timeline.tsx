'use client';

import { useState, useEffect } from 'react';
import { ProjectTask } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ProjectTimelineProps {
  tasks: ProjectTask[];
  milestones: Array<{id: string; title: string; date?: string; description?: string; status?: string; dueDate?: string}>;
}

export function ProjectTimeline({ tasks, milestones }: ProjectTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Circle className="w-5 h-5 text-blue-600" />;
      case 'review': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return '待办';
      case 'in-progress': return '进行中';
      case 'review': return '待审核';
      case 'done': return '已完成';
      default: return '未知';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '紧急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  // 按截止日期排序
  const sortedTasks = [...tasks]
    .filter(task => task.dueDate)
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  // 按日期分组
  const groupedByDate = sortedTasks.reduce((groups, task) => {
    const date = format(new Date(task.dueDate!), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, ProjectTask[]>);

  // 获取今天的日期 - 使用useEffect避免hydration错误
  const [today, setToday] = useState<string>('');
  
  useEffect(() => {
    setToday(format(new Date(), 'yyyy-MM-dd'));
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            项目时间线
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无设置截止日期的任务</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([date, dayTasks]) => {
                const isToday = date === today;
                const isOverdue = date < today;
                const dateObj = new Date(date);
                
                return (
                  <div key={date} className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isToday ? 'bg-blue-100 text-blue-800' :
                        isOverdue ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {format(dateObj, 'MM月dd日', { locale: zhCN })}
                        {isToday && ' (今天)'}
                        {isOverdue && ' (已逾期)'}
                      </div>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    
                    <div className="space-y-3 ml-4">
                      {dayTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                          {getStatusIcon(task.status)}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {getPriorityText(task.priority)}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {getStatusText(task.status)}
                              </Badge>
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{task.estimatedHours || 0}小时</span>
                              </div>
                              
                              {task.progress > 0 && (
                                <div className="flex items-center gap-2">
                                  <Progress value={task.progress} className="w-20 h-2" />
                                  <span>{task.progress}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              项目里程碑
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    {milestone.dueDate && (
                      <p className="text-sm text-gray-600">
                        截止：{format(new Date(milestone.dueDate), 'yyyy年MM月dd日', { locale: zhCN })}
                      </p>
                    )}
                  </div>
                  <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                    {milestone.status === 'completed' ? '已完成' : '待完成'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}