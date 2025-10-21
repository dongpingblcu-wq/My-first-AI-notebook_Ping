-- 用户表（使用Supabase Auth，无需手动创建）
-- Supabase自动处理用户认证

-- 用户配置表
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  preferences JSONB DEFAULT '{}'::jsonb
);

-- AI聊天记录表
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  messages JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 用户笔记表
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 图片生成历史表
CREATE TABLE image_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  image_url TEXT,
  parameters JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 启用RLS（行级安全）
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_generations ENABLE ROW LEVEL SECURITY;

-- 创建策略
-- 用户只能查看和更新自己的配置文件
CREATE POLICY "用户只能查看自己的配置" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "用户只能更新自己的配置" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- 用户只能查看和管理自己的聊天记录
CREATE POLICY "用户只能查看自己的聊天记录" ON chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能创建自己的聊天记录" ON chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的聊天记录" ON chat_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的聊天记录" ON chat_history
  FOR DELETE USING (auth.uid() = user_id);

-- 用户只能查看和管理自己的笔记
CREATE POLICY "用户只能查看自己的笔记" ON notes
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "用户只能创建自己的笔记" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的笔记" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的笔记" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- 用户只能查看和管理自己的图片生成记录
CREATE POLICY "用户只能查看自己的图片生成记录" ON image_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能创建自己的图片生成记录" ON image_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建函数：自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_history_updated_at BEFORE UPDATE ON chat_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();