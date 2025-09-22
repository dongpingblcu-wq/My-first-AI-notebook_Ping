'use client';

import { ProjectTask, ProjectMember, TaskFilter } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Calendar,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState, useEffect } from 'react';

interface ProjectTaskListProps {
  tasks: ProjectTask[];
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskAdd: (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  members: ProjectMember[];
}

export function ProjectTaskList({ tasks, onTaskUpdate, onTaskDelete, onTaskAdd, members }: ProjectTaskListProps) {
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'status' | 'assignee'>('priority');
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // 避免hydration错误 - 在客户端设置当前时间
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigneeId: string;
    dueDate: string;
    estimatedHours: number;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    assigneeId: '',
    dueDate: '',
    estimatedHours: 0
  });

  const sortedAndFilteredTasks = tasks
    .filter(task => filter === 'all' || task.status === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder: Record<'low' | 'medium' | 'high' | 'urgent', number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate || !b.dueDate) return 0;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'status':
          const statusOrder: Record<'todo' | 'in-progress' | 'review' | 'done', number> = { 'todo': 1, 'in-progress': 2, 'review': 3, 'done': 4 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'assignee':
          const aAssignee = members.find(m => m.id === a.assigneeId)?.name || '';
          const bAssignee = members.find(m => m.id === b.assigneeId)?.name || '';
          return aAssignee.localeCompare(bAssignee);
        default:
          return 0;
      }
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const _getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const _getStatusText = (status: string) => {
    switch (status) {
      case 'todo': return '待办';
      case 'in-progress': return '进行中';
      case 'review': return '待审核';
      case 'done': return '已完成';
      default: return '未知';
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onTaskAdd({
        projectId: '',
        title: newTask.title,
        description: newTask.description,
        status: 'todo',
        priority: newTask.priority,
        assigneeId: newTask.assigneeId || undefined,
        dueDate: newTask.dueDate || undefined,
        estimatedHours: newTask.estimatedHours || undefined,
        progress: 0,
        tags: [],
        dependencies: []
      });
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assigneeId: '',
        dueDate: '',
        estimatedHours: 0
      });
      setShowAddTask(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={(value) => setFilter(value as TaskFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部任务</SelectItem>
              <SelectItem value="todo">待办</SelectItem>
              <SelectItem value="in-progress">进行中</SelectItem>
              <SelectItem value="review">待审核</SelectItem>
              <SelectItem value="done">已完成</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'priority' | 'dueDate' | 'status' | 'assignee')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">按优先级</SelectItem>
              <SelectItem value="dueDate">按截止时间</SelectItem>
              <SelectItem value="status">按状态</SelectItem>
              <SelectItem value="assignee">按负责人</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={() => setShowAddTask(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加任务
        </Button>
      </div>

      {showAddTask && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="任务标题 *"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Textarea
                  placeholder="任务描述"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={2}
                />
              </div>
              <Select 
                value={newTask.priority}
                onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high' | 'urgent'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="urgent">紧急</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={newTask.assigneeId}
                onValueChange={(value) => setNewTask({...newTask, assigneeId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="负责人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">未分配</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
              <Input
                type="number"
                placeholder="预计工时（小时）"
                value={newTask.estimatedHours || ''}
                onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                取消
              </Button>
              <Button onClick={handleAddTask}>
                添加任务
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">状态</TableHead>
              <TableHead>任务</TableHead>
              <TableHead className="w-24">优先级</TableHead>
              <TableHead className="w-32">负责人</TableHead>
              <TableHead className="w-24">进度</TableHead>
              <TableHead className="w-32">截止时间</TableHead>
              <TableHead className="w-20 text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredTasks.map((task) => {
              const assignee = members.find(m => m.id === task.assigneeId);
              const isOverdue = currentTime && task.dueDate && task.status !== 'done' && new Date(task.dueDate) < currentTime;
              
              return (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={task.status === 'done'}
                      onCheckedChange={(checked) => 
                        onTaskUpdate(task.id, { 
                          status: checked ? 'done' : 'todo',
                          progress: checked ? 100 : 0
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'urgent' ? '紧急' : 
                       task.priority === 'high' ? '高' :
                       task.priority === 'medium' ? '中' : '低'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{assignee.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">未分配</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="w-16 h-2" />
                      <span className="text-sm text-gray-600">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? (
                      <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(task.dueDate), 'MM/dd', { locale: zhCN })}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onTaskUpdate(task.id, { status: 'done' })}
                        disabled={task.status === 'done'}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600"
                        onClick={() => onTaskDelete(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {sortedAndFilteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无任务
          </div>
        )}
      </Card>
    </div>
  );
}