'use client';

import { Trash2, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

interface TodoStatsProps {
  stats: TodoStats;
  onClearCompleted: () => void;
}

export function TodoStats({ stats, onClearCompleted }: TodoStatsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">任务统计</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">总任务数</span>
            </div>
            <span className="text-xl font-bold">{stats.total}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">已完成</span>
            </div>
            <span className="text-xl font-bold text-green-600">{stats.completed}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">完成率</span>
            </div>
            <span className="text-xl font-bold text-orange-600">{stats.completionRate.toFixed(1)}%</span>
          </div>
        </div>

        {stats.completed > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCompleted}
            className="w-full mt-4"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清除已完成任务
          </Button>
        )}
      </Card>

      {stats.total > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">进度概览</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>进度</span>
              <span>{stats.completionRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{stats.active} 待完成</span>
              <span>{stats.completed} 已完成</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}