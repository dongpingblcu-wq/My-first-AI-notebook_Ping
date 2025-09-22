'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, BookOpen, Calendar, Tag } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { AppLayout } from '@/components/app-layout';



export default function AINotesPage() {
  const { notes, createNote, updateNote, searchTerm, setSearchTerm } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // 避免hydration错误 - 在客户端设置当前时间
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const filteredNotes = notes;

  const handleCreateNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = createNote();
      updateNote(note.id, {
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags
      });
      setNewNote({ title: '', content: '', tags: [] });
      setIsCreating(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !newNote.tags.includes(tag.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <AppLayout>
      <main className="flex-1 p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl font-bold">AI笔记本</h1>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>新建笔记</span>
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索笔记..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 创建新笔记表单 */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>创建新笔记</CardTitle>
            <CardDescription>记录您的想法和灵感</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="笔记标题"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="笔记内容"
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
            />
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {newNote.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="添加标签（按回车确认）"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateNote}>保存笔记</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 笔记列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm ? '没有找到匹配的笔记' : '还没有笔记'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm ? '尝试使用不同的关键词搜索' : '点击"新建笔记"开始记录您的想法'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                <CardDescription className="flex items-center space-x-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{currentTime ? new Date(note.createdAt).toLocaleDateString('zh-CN') : ''}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
    </AppLayout>
  );
}