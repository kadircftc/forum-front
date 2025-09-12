import { useState } from 'react';

function MessageComposer({ onSend, disabled }: { onSend: (content: string) => Promise<void> | void; disabled?: boolean }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) return;
    setSubmitting(true);
    try {
      await onSend(content.trim());
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 flex items-center gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void submit(e);
          }
        }}
        placeholder="Mesaj yaz..."
        rows={2}
        className="flex-1 rounded-lg bg-black border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none px-3 py-2"
      />
      <button
        type="submit"
        disabled={submitting || disabled}
        className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60"
      >
        Gönder
      </button>
    </form>
  );
}

export default MessageComposer;


