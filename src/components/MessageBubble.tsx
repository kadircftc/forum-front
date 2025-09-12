import { Flag } from 'lucide-react';
import type { MessageDto } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

function MessageBubble({ message, isOwn, onReport, isAdminMessage = false }: { message: MessageDto; isOwn: boolean; onReport?: (message: MessageDto) => void; isAdminMessage?: boolean }) {
  // Kendi mesajlarımız her zaman sağda olsun, backend align'ı yoksa
  const alignment = message.align ?? (isOwn ? 'right' : 'left');
  const isRight = alignment === 'right';

  return (
    <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] glass-effect rounded-xl p-3 ${isRight ? 'bg-blue-500/10' : 'bg-zinc-800/40'} group ${isAdminMessage ? 'border-l-2 border-orange-500/50' : ''}`}>
        <div className="flex items-center justify-between mb-1">
          {message.username && !isOwn && (
            <div className={`text-sm font-bold ${isAdminMessage ? 'text-orange-300' : 'text-zinc-200'} flex items-center gap-2`}>
              {isAdminMessage && (
                <>
                  <img 
                    src="/reqspark_logo.png" 
                    alt="Admin Logo" 
                    className="w-20 rounded-full"
                  />
                  <span>Yönetici</span>
                </>
              )}
              {!isAdminMessage && message.username}
            </div>
          )}
          {!isOwn && onReport && (
            <button
              onClick={() => onReport(message)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-400 p-1"
              title="Raporla"
            >
              <Flag className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="text-xm text-zinc-100 whitespace-pre-wrap">{message.content}</div>
        <div className="text-[10px] text-zinc-400 mt-1">
          {formatDistanceToNow(new Date(message.created_at))}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;


