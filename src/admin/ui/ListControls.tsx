'use client';

import { ArrowDown, ArrowUp, Trash } from 'lucide-react';
import { IconButton } from './primitives';

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Up / down / delete buttons for one row of an editable list. */
export function ListControls({ index, count, onMove, onRemove, removeLabel = 'حذف', disableRemove }: { index: number; count: number; onMove: (to: number) => void; onRemove?: () => void; removeLabel?: string; disableRemove?: boolean }) {
  return (
    <div className="flex shrink-0 items-center">
      <IconButton label="تحريك لأعلى" disabled={index === 0} onClick={() => onMove(index - 1)}>
        <ArrowUp aria-hidden className="size-4" />
      </IconButton>
      <IconButton label="تحريك لأسفل" disabled={index === count - 1} onClick={() => onMove(index + 1)}>
        <ArrowDown aria-hidden className="size-4" />
      </IconButton>
      {onRemove && (
        <IconButton label={removeLabel} disabled={disableRemove} onClick={onRemove} className="hover:bg-rose-50 hover:text-rose-600">
          <Trash aria-hidden className="size-4" />
        </IconButton>
      )}
    </div>
  );
}
