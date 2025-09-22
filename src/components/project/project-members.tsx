'use client';

import { ProjectMember } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Crown, 
  Shield, 
  User,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';

interface ProjectMembersProps {
  members: ProjectMember[];
  onAddMember: (member: Omit<ProjectMember, 'id' | 'joinedAt'>) => void;
  onRemoveMember: (memberId: string) => void;
  currentUserRole: 'owner' | 'admin' | 'member' | 'viewer';
}

export function ProjectMembers({ members, onAddMember, onRemoveMember, currentUserRole }: ProjectMembersProps) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'member' as 'owner' | 'admin' | 'member' | 'viewer'
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'member': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner': return '所有者';
      case 'admin': return '管理员';
      case 'member': return '成员';
      case 'viewer': return '观察者';
      default: return '未知';
    }
  };

  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.email.trim()) {
      onAddMember(newMember);
      setNewMember({ name: '', email: '', role: 'member' });
      setShowAddMember(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">团队成员</h2>
          <p className="text-gray-600">管理项目成员和权限</p>
        </div>
        {canManageMembers && (
          <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                添加成员
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加团队成员</DialogTitle>
                <DialogDescription>
                  邀请新成员加入项目
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>姓名</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="输入成员姓名"
                  />
                </div>
                <div>
                  <Label>邮箱</Label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    placeholder="输入邮箱地址"
                  />
                </div>
                <div>
                  <Label>角色</Label>
                  <Select 
                    value={newMember.role}
                    onValueChange={(value: string) => setNewMember({...newMember, role: value as 'owner' | 'admin' | 'member' | 'viewer'})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">观察者 - 只读权限</SelectItem>
                      <SelectItem value="member">成员 - 可编辑任务</SelectItem>
                      <SelectItem value="admin">管理员 - 管理项目</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAddMember(false)}>
                  取消
                </Button>
                <Button onClick={handleAddMember}>
                  添加
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            成员列表
            <Badge variant="secondary">{members.length} 人</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {members.map((member) => {
            const RoleIcon = getRoleIcon(member.role);
            return (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{member.name}</h4>
                      <Badge className={getRoleColor(member.role)}>
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {getRoleText(member.role)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span>{member.email}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      加入于 {format(new Date(member.joinedAt), 'yyyy年MM月dd日', { locale: zhCN })}
                    </p>
                  </div>
                </div>
                
                {canManageMembers && member.role !== 'owner' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-red-600"
                        onClick={() => onRemoveMember(member.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        移除成员
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}