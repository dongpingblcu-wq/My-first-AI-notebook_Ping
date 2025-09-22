'use client';

import { AIChatInterface } from '@/components/ai-chat/ai-chat-interface';
import { AppLayout } from '@/components/app-layout';

export default function AIChatPage() {
  return (
    <AppLayout>
      <div className="flex-1 h-full">
        <AIChatInterface />
      </div>
    </AppLayout>
  );
}