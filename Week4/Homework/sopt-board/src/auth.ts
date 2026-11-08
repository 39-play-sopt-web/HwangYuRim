import type { Part } from './api/members';

export interface Auth {
  authorizationCode: string;
  part: Part;
}

const STORAGE_KEY = 'sopt-board-auth';

export function readAuth(): Auth | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const auth: unknown = JSON.parse(stored);
    if (
      typeof auth !== 'object' ||
      auth === null ||
      !('authorizationCode' in auth) ||
      typeof auth.authorizationCode !== 'string' ||
      !auth.authorizationCode.trim() ||
      !('part' in auth) ||
      (auth.part !== 'WEB' && auth.part !== 'iOS' && auth.part !== 'ANDROID')
    ) {
      return null;
    }

    return { authorizationCode: auth.authorizationCode, part: auth.part };
  } catch {
    return null;
  }
}

export function saveAuth(auth: Auth): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {
    throw new Error('회원 코드를 저장하지 못했어요. 브라우저의 저장소 설정을 확인해주세요.');
  }
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}
