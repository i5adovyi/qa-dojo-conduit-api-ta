import { APIRequestContext } from '@playwright/test';
import * as fs from 'fs';

const TOKEN_FILE = 'tests/utils/helpers/.token';

export function getToken(): string | null {
  const exists = fs.existsSync(TOKEN_FILE);
  if (exists) {
    const token = fs.readFileSync(TOKEN_FILE, 'utf8');
    return token;
  }
  return null;
}

export function saveToken(token: string): void {
  fs.writeFileSync(TOKEN_FILE, token);
}

export async function isTokenValid(
  request: APIRequestContext,
  token: string
): Promise<boolean> {
  try {
    const response = await request.get('user/', {
      headers: { Authorization: `Token ${token}` },
    });
    return response.status() === 200;
  } catch {
    return false;
  }
}
