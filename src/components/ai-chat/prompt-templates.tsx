'use client';

import { useState, useEffect } from 'react';
import { Wand2, Edit, Save, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
}

const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: '1',
    name: '代码解释',
    content: '请详细解释以下代码的工作原理，包括：\n1. 代码结构\n2. 关键逻辑\n3. 潜在问题\n4. 优化建议\n\n代码：',
    category: '编程',
    tags: ['代码', '解释', '技术']
  },
  {
    id: '2',
    name: '写作助手',
    content: '请帮我撰写一篇关于以下主题的文章：\n\n主题：\n\n要求：\n- 结构清晰，逻辑严密\n- 语言简洁有力\n- 字数控制在500-800字\n- 包含引人入胜的开头和有力的结尾',
    category: '写作',
    tags: ['写作', '文章', '创作']
  },
  {
    id: '3',
    name: '学习总结',
    content: '请帮我总结以下内容的核心要点，并提供一个清晰的学习框架：\n\n内容：\n\n请包括：\n1. 关键概念\n2. 实际应用\n3. 进一步学习建议',
    category: '学习',
    tags: ['学习', '总结', '知识']
  },
  {
    id: '4',
    name: '头脑风暴',
    content: '请为以下主题进行头脑风暴，提供尽可能多的创意想法：\n\n主题：\n\n要求：\n- 至少提供10个不同的想法\n- 包含创新的角度\n- 考虑实际可行性\n- 按优先级排序',
    category: '创意',
    tags: ['创意', '头脑风暴', '创新']
  },
  {
    id: '5',
    name: '问题分析',
    content: '请分析以下问题，并提供解决方案：\n\n问题描述：\n\n请包括：\n1. 问题根本原因\n2. 可能的解决方案（至少3个）\n3. 每个方案的优缺点\n4. 推荐方案及理由',
    category: '分析',
    tags: ['分析', '问题', '解决']
  }
];

interface PromptTemplatesProps {
  onSelect: (prompt: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromptTemplates({ onSelect, isOpen, onOpenChange }: PromptTemplatesProps) {
  const [templates, setTemplates] = useState<PromptTemplate[]>(DEFAULT_TEMPLATES);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [newTemplateModalOpen, setNewTemplateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<PromptTemplate>>({
    name: '',
    content: '',
    category: '自定义',
    tags: []
  });

  useEffect(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('promptTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('promptTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleSelect = (template: PromptTemplate) => {
    onSelect(template.content);
    onOpenChange(false);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      ));
      setEditModalOpen(false);
      setEditingTemplate(null);
    }
  };

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      const template: PromptTemplate = {
        id: Date.now().toString(),
        name: newTemplate.name,
        content: newTemplate.content,
        category: newTemplate.category || '自定义',
        tags: newTemplate.tags || []
      };
      setTemplates([...templates, template]);
      setNewTemplateModalOpen(false);
      setNewTemplate({ name: '', content: '', category: '自定义', tags: [] });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const categories = [...new Set(templates.map(t => t.category))];

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            提示词模板
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-[400px] max-h-[500px] overflow-y-auto">
          <div className="p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => setNewTemplateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              新建模板
            </Button>
          </div>

          {categories.map(category => (
            <div key={category}>
              <div className="px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-100">
                {category}
              </div>
              
              {templates
                .filter(t => t.category === category)
                .map(template => (
                  <DropdownMenuItem
                    key={template.id}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left p-2 h-auto"
                        onClick={() => handleSelect(template)}
                      >
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {template.content.substring(0, 60)}...
                        </div>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingTemplate(template);
                          setEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Template Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑提示词模板</DialogTitle>
          </DialogHeader>
          
          {editingTemplate && (
            <div className="space-y-4">
              <div>
                <Label>模板名称</Label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                />
              </div>
              
              <div>
                <Label>提示词内容</Label>
                <Textarea
                  value={editingTemplate.content}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, content: e.target.value })
                  }
                  rows={8}
                />
              </div>
              
              <div>
                <Label>分类</Label>
                <Input
                  value={editingTemplate.category}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, category: e.target.value })
                  }
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingTemplate(null);
                  }}
                >
                  取消
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="w-4 h-4 mr-2" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Template Modal */}
      <Dialog open={newTemplateModalOpen} onOpenChange={setNewTemplateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新建提示词模板</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>模板名称</Label>
              <Input
                value={newTemplate.name || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="例如：代码审查"
              />
            </div>
            
            <div>
              <Label>提示词内容</Label>
              <Textarea
                value={newTemplate.content || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                rows={8}
                placeholder="输入提示词模板内容..."
              />
            </div>
            
            <div>
              <Label>分类</Label>
              <Input
                value={newTemplate.category || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                placeholder="例如：编程、写作、学习"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setNewTemplateModalOpen(false);
                  setNewTemplate({ name: '', content: '', category: '自定义', tags: [] });
                }}
              >
                取消
              </Button>
              <Button onClick={handleAddTemplate}>
                <Plus className="w-4 h-4 mr-2" />
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}