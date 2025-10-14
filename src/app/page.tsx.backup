'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, CheckSquare, MessageCircle, Clock, FolderKanban, ArrowRight } from 'lucide-react';
import { WavyBackground } from '@/components/ui/wavy-background';
import { AppLayout } from '@/components/app-layout';

export default function Home() {
  const router = useRouter();

  const modules = [
    {
      id: 'notebook',
      title: 'AI笔记本',
      description: '智能记录与整理您的想法，支持AI辅助功能',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      path: '/ai-notes',
      features: ['智能编辑', 'AI润色', '自动标签', '快速搜索']
    },
    {
      id: 'todo',
      title: '待办清单',
      description: '高效管理日常任务，保持工作井然有序',
      icon: CheckSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      path: '/todo',
      features: ['任务管理', '进度跟踪', '优先级设置', '完成统计']
    },
    {
      id: 'ai-chat',
      title: 'AI对话',
      description: '与AI助手对话，获得智能建议和解答',
      icon: MessageCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      path: '/ai-chat',
      features: ['智能对话', '多模型选择', '上下文记忆', '专业解答']
    },
    {
      id: 'project',
      title: '项目管理',
      description: '高效管理项目进度，团队协作更轻松',
      icon: FolderKanban,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      path: '/project',
      features: ['项目看板', '任务分配', '进度跟踪', '团队协作']
    },
    {
      id: 'pomodoro',
      title: '番茄钟',
      description: '专注时间管理，提升工作效率',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      path: '/?pomodoro=true',
      features: ['专注计时', '休息提醒', '主题切换', '全屏模式']
    }
  ];

  const handleModuleClick = (path: string) => {
    router.push(path);
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen">
      {/* 固定背景 */}
      <div className="fixed inset-0 z-0">
        <WavyBackground
          className="w-full h-full"
          containerClassName="w-full h-full"
          colors={[
            "#38bdf8",
            "#818cf8", 
            "#c084fc",
            "#e879f9",
            "#22d3ee"
          ]}
          waveWidth={50}
          backgroundFill="#0f172a"
          blur={10}
          speed="fast"
          waveOpacity={0.5}
        />
      </div>
      
      {/* 内容层 */}
      <div className="relative z-10 w-full px-6 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI个人工作台
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            集成AI笔记、任务管理、智能对话和专注计时，打造您的专属数字工作空间
          </p>
        </div>

        {/* 功能模块卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center relative z-20">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.path)}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl w-full max-w-sm drop-shadow-lg"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-white/20 transition-all duration-300">
                  {/* 卡片头部 */}
                  <div className={`${module.bgColor} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
                      <IconComponent size={128} className={module.textColor} />
                    </div>
                    <div className="relative z-10">
                      <div className={`inline-flex p-3 rounded-xl bg-white shadow-sm mb-4`}>
                        <IconComponent size={32} className={module.textColor} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {/* 卡片内容 */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      {module.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.color}`}></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* 进入按钮 */}
                    <div className={`flex items-center justify-between p-3 rounded-xl bg-gradient-to-r ${module.color} text-white group-hover:shadow-lg transition-all duration-300`}>
                      <span className="font-medium">立即使用</span>
                      <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">所有功能已就绪，开始您的高效工作之旅</span>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
}