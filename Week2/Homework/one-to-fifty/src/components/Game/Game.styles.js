import styled from '@emotion/styled'

export const GameSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: clamp(40px, 8vw, 96px) 20px;
`

export const Status = styled.p`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    font-size: 14px;
  }
`

export const NextNumber = styled.strong`
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
`

export const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $size }) => $size}, 1fr);
  gap: 8px;
`

export const NumberButton = styled.button`
  width: clamp(48px, 12vw, 96px);
  aspect-ratio: 1;
  padding: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.medium};
  font-size: 24px;
  font-weight: 700;

  &:disabled {
    background-color: transparent;
    border-style: dashed;
    cursor: default;
  }
`
