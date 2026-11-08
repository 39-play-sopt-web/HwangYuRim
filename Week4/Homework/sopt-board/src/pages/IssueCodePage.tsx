import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { issueAuthorizationCode } from '../api/members';
import type { Part } from '../api/members';
import { saveAuth } from '../auth';

const PARTS: Part[] = ['WEB', 'iOS', 'ANDROID'];

export default function IssueCodePage() {
  const [selectedPart, setSelectedPart] = useState<Part | ''>('');
  const navigate = useNavigate();
  const issueCode = useMutation({
    mutationFn: async (part: Part) => {
      const authorizationCode = await issueAuthorizationCode(part);

      saveAuth({ authorizationCode, part });
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPart || issueCode.isPending) return;

    issueCode.mutate(selectedPart, {
      onSuccess: () => navigate('/posts'),
    });
  }

  return (
    <Container>
      <Card>
        <Title>SOPT Board💌</Title>
        <Subtitle>회원 코드 발급</Subtitle>
        <Description>파트를 선택하고 회원 코드를 발급받아보세요.</Description>
        <Form onSubmit={handleSubmit} aria-busy={issueCode.isPending}>
          <label htmlFor="part">파트</label>
          <Fields>
            <PartSelect
              id="part"
              name="part"
              value={selectedPart}
              disabled={issueCode.isPending}
              onChange={(event) => {
                setSelectedPart(PARTS.find((part) => part === event.target.value) ?? '');
                issueCode.reset();
              }}
            >
              <option value="">파트를 선택해주세요</option>
              {PARTS.map((part) => (
                <option key={part} value={part}>{part}</option>
              ))}
            </PartSelect>
            <IssueButton
              type="submit"
              disabled={!selectedPart || issueCode.isPending}
            >
              {issueCode.isPending ? '발급 중…' : '코드 발급받기'}
            </IssueButton>
          </Fields>
          {issueCode.isError && (
            <ErrorMessage role="alert">
              {isAxiosError(issueCode.error)
                ? '회원 코드를 발급하지 못했어요. 연결 상태를 확인하고 다시 시도해주세요.'
                : issueCode.error.message}
            </ErrorMessage>
          )}
        </Form>
        <ListLink to="/posts">게시글 목록 보기</ListLink>
      </Card>
    </Container>
  );
}

const Container = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
`;

const Card = styled.section`
  width: 100%;
  max-width: 440px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;

  @media (max-width: 480px) {
    padding: 24px;
  }
`;

const Title = styled.h1`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
`;

const Subtitle = styled.h2`
  margin: 0 0 8px;
  font-size: 20px;
`;

const Description = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const Form = styled.form`
  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
  }
`;

const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PartSelect = styled.select`
  flex: 1 1 180px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

const IssueButton = styled.button`
  flex: 1 1 auto;
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`;

const ListLink = styled(Link)`
  display: block;
  margin-top: 16px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  text-decoration: none;
`;
