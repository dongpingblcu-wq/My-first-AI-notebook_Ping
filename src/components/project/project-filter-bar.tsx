'use client';

import { ProjectFilter, ProjectSortBy } from '@/types/project';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Grid, 
  List, 
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface ProjectFilterBarProps {
  filter: ProjectFilter;
  onFilterChange: (filter: ProjectFilter) => void;
  sortBy: ProjectSortBy;
  onSortChange: (sort: ProjectSortBy) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ProjectFilterBar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  view,
  onViewChange
}: ProjectFilterBarProps) {
  const filterOptions = [
    { value: 'all' as ProjectFilter, label: '全部项目' },
    { value: 'active' as ProjectFilter, label: '进行中' },
    { value: 'completed' as ProjectFilter, label: '已完成' },
    { value: 'archived' as ProjectFilter, label: '已归档' },
  ];

  const sortOptions = [
    { value: 'startDate' as ProjectSortBy, label: '开始时间' },
    { value: 'name' as ProjectSortBy, label: '项目名称' },
    { value: 'priority' as ProjectSortBy, label: '优先级' },
    { value: 'progress' as ProjectSortBy, label: '完成度' },
    { value: 'endDate' as ProjectSortBy, label: '截止时间' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={view === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('grid')}
            className="h-8 px-3"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
            className="h-8 px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}