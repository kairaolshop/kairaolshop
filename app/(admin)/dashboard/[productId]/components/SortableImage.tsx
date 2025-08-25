'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableImageProps {
  id: string;
  url: string;
  onRemove: () => void;
  disabled?: boolean;
}

export function SortableImage({ id, url, onRemove, disabled }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRemove();
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
  <div {...attributes} {...listeners} className="cursor-move">
    <Image
      src={url}
      alt={`Preview ${id}`}
      className="w-30 h-30 object-cover rounded"
      width={96}
      height={96}
      priority
    />
  </div>
  <Button
    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded z-10 pointer-events-auto"
    onClick={handleRemoveClick}
    disabled={disabled}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</div>
  );
}