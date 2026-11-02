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
  transition:
    background-color 100ms ease,
    transform 100ms ease;

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primarySoft};
    transform: scale(0.94);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:disabled {
    background-color: transparent;
    border-style: dashed;
    cursor: default;
  }
`

export const ModalDialog = styled.dialog`
  width: min(360px, calc(100% - 40px));
  padding: 32px;
  gap: 24px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadow.floating};

  &[open] {
    display: grid;
  }

  &::backdrop {
    background-color: rgb(41 38 42 / 55%);
  }

  h2 {
    margin: 0;
    font-size: 20px;
  }
`

export const ModalTime = styled.strong`
  font-size: 36px;
  font-variant-numeric: tabular-nums;
`

export const ConfirmButton = styled.button`
  height: 44px;
  color: ${({ theme }) => theme.colors.surface};
  background-color: ${({ theme }) => theme.colors.primary};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.small};
  font-weight: 700;
`
