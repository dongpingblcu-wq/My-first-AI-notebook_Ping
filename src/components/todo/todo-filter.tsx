'use client';

import { TodoFilter as FilterType } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string; count?: number }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' },
];

export function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {filters.map(({ value, label }) => (
        <Button
          key={value}
          variant={filter === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFilterChange(value)}
          className={cn(
            'flex-1 text-sm',
            filter === value 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}