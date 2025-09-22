'use client';

interface SearchHighlightProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export function SearchHighlight({ text, searchTerm, className = "" }: SearchHighlightProps) {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  const term = searchTerm.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(term);

  if (index === -1) {
    return <span className={className}>{text}</span>;
  }

  const before = text.substring(0, index);
  const match = text.substring(index, index + term.length);
  const after = text.substring(index + term.length);

  return (
    <span className={className}>
      {before}
      <span className="bg-yellow-200 font-semibold">{match}</span>
      {after}
    </span>
  );
}