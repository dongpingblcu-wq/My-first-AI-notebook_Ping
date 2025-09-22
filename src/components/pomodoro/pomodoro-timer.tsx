'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Palette, Maximize2, Minimize2, X } from 'lucide-react';

interface PomodoroTimerProps {
  className?: string;
}

type ThemeStyle = 'dopamine' | 'minimal' | 'candy';

interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    progress: string;
  };
}

const themes: Record<ThemeStyle, ThemeConfig> = {
  dopamine: {
    name: '多巴胺',
    colors: {
      primary: 'from-pink-500 via-purple-500 to-indigo-500',
      secondary: 'from-orange-400 to-pink-500',
      accent: 'from-yellow-400 to-orange-500',
      background: 'bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900',
      text: 'text-white',
      progress: 'from-pink-500 to-purple-500'
    }
  },
  minimal: {
    name: '极简',
    colors: {
      primary: 'from-gray-800 to-gray-900',
      secondary: 'from-gray-600 to-gray-700',
      accent: 'from-white to-gray-200',
      background: 'bg-white',
      text: 'text-gray-900',
      progress: 'from-gray-800 to-gray-900'
    }
  },
  candy: {
    name: '糖果',
    colors: {
      primary: 'from-blue-400 via-purple-400 to-pink-400',
      secondary: 'from-green-300 to-blue-400',
      accent: 'from-yellow-300 to-pink-300',
      background: 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100',
      text: 'text-gray-800',
      progress: 'from-blue-400 to-purple-400'
    }
  }
};

export function PomodoroTimer({ className = '' }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeStyle>('dopamine');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const theme = themes[currentTheme];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <>
      {/* Normal Mode */}
      {!isFullscreen && (
        <div className={`relative ${className}`}>
          <div className={`${theme.colors.background} rounded-2xl p-6 shadow-2xl transition-all duration-500`}>
            {/* Theme Selector */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-full ${theme.colors.text} hover:scale-110 transition-transform`}
                title="全屏模式"
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                className={`p-2 rounded-full ${theme.colors.text} hover:scale-110 transition-transform`}
              >
                <Palette size={20} />
              </button>
            </div>
            
            {showThemeSelector && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-2 space-y-1 z-10">
                {(Object.keys(themes) as ThemeStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setCurrentTheme(style);
                      setShowThemeSelector(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors ${
                      currentTheme === style ? 'bg-gray-100 font-semibold' : ''
                    }`}
                  >
                    {themes[style].name}
                  </button>
                ))}
              </div>
            )}

            {/* Timer Display */}
            <div className="text-center">
              <div className={`text-6xl font-bold mb-6 ${theme.colors.text} tracking-wider`}>
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Ring */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="opacity-20"
                    style={{ color: theme.colors.text === 'text-white' ? 'white' : 'black' }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={theme.colors.progress.includes('pink') ? '#ec4899' : theme.colors.progress.includes('gray') ? '#374151' : '#60a5fa'} />
                      <stop offset="100%" stopColor={theme.colors.progress.includes('purple') ? '#8b5cf6' : theme.colors.progress.includes('gray') ? '#111827' : '#a855f7'} />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${theme.colors.text}`}>
                      {Math.floor(progress)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleTimer}
                  className={`px-6 py-3 rounded-full bg-gradient-to-r ${theme.colors.primary} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  {isRunning ? (
                    <Pause size={20} className="inline mr-2" />
                  ) : (
                    <Play size={20} className="inline mr-2" />
                  )}
                  {isRunning ? '暂停' : '开始'}
                </button>
                
                <button
                  onClick={resetTimer}
                  className={`px-6 py-3 rounded-full bg-gradient-to-r ${theme.colors.secondary} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                >
                  <RotateCcw size={20} className="inline mr-2" />
                  重置
                </button>
              </div>

              {/* Status */}
              <div className={`mt-4 text-sm ${theme.colors.text} opacity-75`}>
                {isRunning ? '专注时间中...' : '准备开始专注'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Mode */}
      {isFullscreen && (
        <div className={`fixed inset-0 ${theme.colors.background} z-50 flex items-center justify-center transition-opacity duration-500`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8">
              {/* Top Controls */}
              <div className="absolute top-8 right-8 flex space-x-4">
                <button
                  onClick={toggleFullscreen}
                  className={`p-3 rounded-full ${theme.colors.text} hover:scale-110 transition-transform bg-white/10 backdrop-blur-sm`}
                  title="退出全屏"
                >
                  <Minimize2 size={24} />
                </button>
                <button
                  onClick={exitFullscreen}
                  className={`p-3 rounded-full ${theme.colors.text} hover:scale-110 transition-transform bg-white/10 backdrop-blur-sm`}
                  title="关闭"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Theme Selector in Fullscreen */}
              <div className="absolute top-8 left-8">
                <button
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className={`p-3 rounded-full ${theme.colors.text} hover:scale-110 transition-transform bg-white/10 backdrop-blur-sm`}
                >
                  <Palette size={24} />
                </button>
                
                {showThemeSelector && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl p-3 space-y-2 z-20">
                    {(Object.keys(themes) as ThemeStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => {
                          setCurrentTheme(style);
                          setShowThemeSelector(false);
                        }}
                        className={`block w-full text-left px-4 py-3 rounded-md text-sm hover:bg-gray-100 transition-colors ${
                          currentTheme === style ? 'bg-gray-100 font-semibold' : ''
                        }`}
                      >
                        {themes[style].name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timer Display - Larger in Fullscreen */}
              <div className={`text-9xl font-bold mb-12 ${theme.colors.text} tracking-wider`}>
                {formatTime(timeLeft)}
              </div>
              
              {/* Progress Ring - Much Larger */}
              <div className="relative w-96 h-96 mx-auto mb-12">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="opacity-20"
                    style={{ color: theme.colors.text === 'text-white' ? 'white' : 'black' }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#fullscreen-gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="fullscreen-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={theme.colors.progress.includes('pink') ? '#ec4899' : theme.colors.progress.includes('gray') ? '#374151' : '#60a5fa'} />
                      <stop offset="100%" stopColor={theme.colors.progress.includes('purple') ? '#8b5cf6' : theme.colors.progress.includes('gray') ? '#111827' : '#a855f7'} />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${theme.colors.text}`}>
                      {Math.floor(progress)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Large Controls */}
              <div className="flex justify-center space-x-8">
                <button
                  onClick={toggleTimer}
                  className={`px-12 py-6 rounded-full bg-gradient-to-r ${theme.colors.primary} text-white font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300`}
                >
                  {isRunning ? (
                    <Pause size={32} className="inline mr-3" />
                  ) : (
                    <Play size={32} className="inline mr-3" />
                  )}
                  {isRunning ? '暂停' : '开始'}
                </button>
                
                <button
                  onClick={resetTimer}
                  className={`px-12 py-6 rounded-full bg-gradient-to-r ${theme.colors.secondary} text-white font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300`}
                >
                  <RotateCcw size={32} className="inline mr-3" />
                  重置
                </button>
              </div>

              {/* Large Status */}
              <div className={`mt-8 text-2xl ${theme.colors.text} opacity-75`}>
                {isRunning ? '专注时间中...' : '准备开始专注'}
              </div>

              {/* Exit hint */}
              <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm ${theme.colors.text} opacity-50`}>
                按 ESC 或点击右上角退出全屏
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}