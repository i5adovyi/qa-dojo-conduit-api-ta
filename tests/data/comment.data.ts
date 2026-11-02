import { randomUUID } from 'node:crypto';
import type { Comment } from '@/types/types';

export function commentData(): Comment {
  return { comment: { body: `Test comment ${randomUUID()}` } };
}
