'use client';

import { Project } from '@/types/project';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  Tag,
  Edit3,
  Settings,
  Share
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface ProjectHeaderProps {
  project: Project;
  stats: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
  };
  onUpdate: (updates: Partial<Project>) => void;
}

export function ProjectHeader({ project, stats, onUpdate }: ProjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // 避免hydration错误 - 在客户端设置当前时间
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中';
      case 'completed': return '已完成';
      case 'archived': return '已归档';
      case 'planning': return '规划中';
      default: return '未知';
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

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!editedProject.name.trim()) {
        alert('项目名称不能为空');
        return;
      }
      if (!editedProject.description.trim()) {
        alert('项目描述不能为空');
        return;
      }
      
      await onUpdate(editedProject);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('保存项目失败，请重试');
    }
  };

  const handleCancel = () => {
    setEditedProject(project);
    setIsEditing(false);
  };

  const isOverdue = currentTime && project.endDate && 
    project.status === 'active' && 
    new Date(project.endDate) < currentTime;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority === 'urgent' ? '紧急' : 
                   project.priority === 'high' ? '高优先级' :
                   project.priority === 'medium' ? '中优先级' : '低优先级'}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive">已逾期</Badge>
                )}
              </div>
              <p className="text-gray-600 text-lg">{project.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    编辑
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>编辑项目信息</DialogTitle>
                    <DialogDescription>
                      更新项目的基本信息和设置
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>项目名称</Label>
                      <Input
                        value={editedProject.name}
                        onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>项目描述</Label>
                      <Textarea
                        value={editedProject.description}
                        onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>状态</Label>
                        <Select 
                          value={editedProject.status}
                          onValueChange={(value: string) => setEditedProject({...editedProject, status: value as Project['status']})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">规划中</SelectItem>
                            <SelectItem value="active">进行中</SelectItem>
                            <SelectItem value="completed">已完成</SelectItem>
                            <SelectItem value="archived">已归档</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>优先级</Label>
                        <Select 
                          value={editedProject.priority}
                          onValueChange={(value: string) => setEditedProject({...editedProject, priority: value as Project['priority']})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">低</SelectItem>
                            <SelectItem value="medium">中</SelectItem>
                            <SelectItem value="high">高</SelectItem>
                            <SelectItem value="urgent">紧急</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>开始日期</Label>
                        <Input
                          type="date"
                          value={editedProject.startDate.split('T')[0]}
                          onChange={(e) => setEditedProject({...editedProject, startDate: new Date(e.target.value).toISOString()})}
                        />
                      </div>
                      <div>
                        <Label>结束日期（可选）</Label>
                        <Input
                          type="date"
                          value={editedProject.endDate?.split('T')[0] || ''}
                          onChange={(e) => setEditedProject({...editedProject, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={handleCancel}>
                      取消
                    </Button>
                    <Button onClick={handleSave}>
                      保存
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                时间安排
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">开始时间：</span>
                  <span>{format(new Date(project.startDate), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                </div>
                {project.endDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">截止时间：</span>
                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                      {format(new Date(project.endDate), 'yyyy年MM月dd日', { locale: zhCN })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                团队成员
              </h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>我</AvatarFallback>
                </Avatar>
                <span className="text-sm">{project.memberIds.length} 人参与</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">项目进度</h3>
              <div className="text-sm text-gray-600">
                {stats.completedTasks} / {stats.totalTasks} 任务完成
              </div>
            </div>
            <Progress value={project.progress} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>整体进度</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}