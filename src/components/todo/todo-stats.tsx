'use client';

import { TodoStats as Stats } from '@/types/todo';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TodoStatsProps {
  stats: Stats;
  onClearCompleted: () => void;
}

export function TodoStats({ stats, onClearCompleted }: TodoStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">任务统计</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 进度条 */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>完成进度</span>
            <span>{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </div>

        {/* 统计信息 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Circle className="w-4 h-4 mr-2 text-blue-500" />
              <span>总任务</span>
            </div>
            <span className="font-semibold">{stats.total}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <Circle className="w-4 h-4 mr-2 text-orange-500" />
              <span>未完成</span>
            </div>
            <span className="font-semibold">{stats.active}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              <span>已完成</span>
            </div>
            <span className="font-semibold">{stats.completed}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        {stats.completed > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCompleted}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            清除已完成
          </Button>
        )}
      </CardContent>
    </Card>
  );
}