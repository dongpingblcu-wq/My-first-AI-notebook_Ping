'use client';

import { ProjectTask, ProjectMember } from '@/types/project';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ProjectKanbanProps {
  tasks: ProjectTask[];
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskAdd: (task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  members: ProjectMember[];
}

const columns = [
  { id: 'todo', title: '待办', color: 'bg-gray-100' },
  { id: 'in-progress', title: '进行中', color: 'bg-blue-100' },
  { id: 'review', title: '待审核', color: 'bg-yellow-100' },
  { id: 'done', title: '已完成', color: 'bg-green-100' },
];

export function ProjectKanban({ tasks, onTaskUpdate, onTaskAdd, members }: ProjectKanbanProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // 避免hydration错误 - 在客户端设置当前时间
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskUpdate(draggedTask, { status: status as ProjectTask['status'] });
      setDraggedTask(null);
    }
  };

  const handleAddTask = (columnId: string) => {
    if (newTaskTitle.trim()) {
      onTaskAdd({
        projectId: '',
        title: newTaskTitle,
        description: '',
        status: columnId as ProjectTask['status'],
        priority: 'medium',
        progress: 0,
        tags: [],
        dependencies: []
      });
      setNewTaskTitle('');
      setShowAddTask(null);
    }
  };

  const TaskCard = ({ task }: { task: ProjectTask }) => {
    const assignee = members.find(m => m.id === task.assigneeId);
    const isOverdue = currentTime && task.dueDate && task.status !== 'done' && new Date(task.dueDate) < currentTime;

    return (
      <Card 
        className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
        draggable
        onDragStart={() => handleDragStart(task.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm flex-1 mr-2">{task.title}</h4>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onTaskUpdate(task.id, { status: 'done' })}
                    disabled={task.status === 'done'}
                  >
                    标记完成
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              {assignee ? (
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-xs">
                      {getInitials(assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{assignee.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>未分配</span>
                </div>
              )}

              {task.dueDate && (
                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                  <Clock className="w-3 h-3" />
                  <span>{format(new Date(task.dueDate), 'MM/dd', { locale: zhCN })}</span>
                </div>
              )}
            </div>

            {task.progress > 0 && (
              <div className="flex items-center gap-2">
                <Progress value={task.progress} className="w-16 h-1" />
                <span className="text-xs">{task.progress}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter(task => task.status === column.id);
        
        return (
          <div key={column.id} className="flex flex-col">
            <div className={`rounded-t-lg p-3 ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>
            
            <Card className="rounded-t-none border-t-0 flex-1">
              <CardContent 
                className="p-4 min-h-[400px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
                
                {showAddTask === column.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="输入任务标题..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTask(column.id);
                        }
                        if (e.key === 'Escape') {
                          setShowAddTask(null);
                          setNewTaskTitle('');
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAddTask(column.id)}
                        className="flex-1"
                      >
                        添加
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setShowAddTask(null);
                          setNewTaskTitle('');
                        }}
                        className="flex-1"
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-500 hover:text-gray-700"
                    onClick={() => setShowAddTask(column.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加任务
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}