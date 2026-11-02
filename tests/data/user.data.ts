import { randomUUID } from 'node:crypto';
import type { Registration } from '@/types/types';

export function userInfo(): Registration {
  const username = 'qa' + randomUUID().replaceAll('-', '').slice(0, 16);
  return {
    username,
    email: `${username}@example.com`,
    password: randomUUID(),
  };
}
