import { client } from './client';

export type Part = 'WEB' | 'iOS' | 'ANDROID';

interface AuthorizationCodeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: {
    authorizationCode: string;
  } | null;
}

export async function issueAuthorizationCode(part: Part): Promise<string> {
  const { data } = await client.post<AuthorizationCodeResponse>(
    '/members/authorization-code',
    { part },
  );

  if (!data.isSuccess || !data.data?.authorizationCode) {
    throw new Error('회원 코드를 발급하지 못했어요. 다시 시도해주세요.');
  }

  return data.data.authorizationCode;
}
