import { useEffect, useRef, useState } from 'react';

function useStreamText(text: string, delay: number = 50) {
  const [streamedText, setStreamedText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!text) {
      setStreamedText('');
      setIsStreaming(false);
      return;
    }

    setStreamedText('');
    setIsStreaming(true);
    indexRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      const current = text.slice(0, indexRef.current);
      setStreamedText(current);

      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
        setIsStreaming(false);
      }
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay]);

  return { streamedText, isStreaming };
}

export default useStreamText;
