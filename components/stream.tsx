"use client"

import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from 'react-markdown';

function FadeIn({
  content,
}: {
  content: string;
}) {
  
  return (
    <span
    >
      {content}
    </span>
  );
}

interface StreamProps {
  content: string
}

export function Stream({
  content,
}: StreamProps) {
  const [output, setOutput] = useState<React.ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const stringResult = useMemo(() => {
    return output.map(node => {
      if (React.isValidElement(node)) {
        const props = node.props as { content: string };
        return String(props.content || '');
      }
      return String(node || '');
    }).join('');
  }, [output]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const bufferLength = 7;
      let buffer = '';
      let i = 0;
      for (i; (i + currentIndex) < content.length && i < bufferLength; i++) {
        buffer += content[currentIndex + i];
      }
      setOutput([...output, <FadeIn key={Date.now()} content={buffer} />]);
      setCurrentIndex(currentIndex + i);
    }, 1);
    return () => clearTimeout(timer);
  }, [currentIndex, content]);

  return (
    <>
      <ReactMarkdown>{stringResult}</ReactMarkdown>
    </>
  )
}