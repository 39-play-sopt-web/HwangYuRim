import styled from "@emotion/styled";

export const HeaderContainer = styled.header`
  display: grid;
  grid-template-areas: "brand menu controls";
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  min-height: 73px;
  padding: 12px clamp(20px, 4vw, 64px);
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 700px) {
    grid-template-areas:
      "brand controls"
      "menu menu";
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px 12px;
    padding: 12px 16px;
  }
`;

export const Brand = styled.div`
  grid-area: brand;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    flex: 0 0 auto;
    font-size: 24px;
    line-height: 1;
  }

  h1 {
    margin: 0;
    font-size: 18px;
    line-height: 1.3;
  }

  @media (max-width: 420px) {
    gap: 8px;

    h1 {
      font-size: 16px;
    }
  }
`;

export const Menu = styled.nav`
  grid-area: menu;
  display: flex;
  gap: 4px;
  justify-self: center;
  padding: 3px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.medium};
`;

export const MenuButton = styled.button`
  min-width: 64px;
  height: 36px;
  padding: 0 14px;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.surface : theme.colors.textMuted};
  background-color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.primary : "transparent"};
  border: 0;
  border-radius: 6px;
  font-weight: 700;
  transition:
    color 150ms ease,
    background-color 150ms ease;

  &:hover {
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.surface : theme.colors.text};
  }
`;

export const Controls = styled.div`
  grid-area: controls;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-self: end;
`;

export const LevelSelect = styled.select`
  height: 38px;
  padding: 0 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.small};
  cursor: pointer;
`;

export const Timer = styled.output`
  display: inline-grid;
  min-width: 78px;
  height: 38px;
  padding: 0 12px;
  place-items: center;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: ${({ theme }) => theme.radius.small};
  font-weight: 700;
  font-variant-numeric: tabular-nums;

  @media (max-width: 420px) {
    min-width: 68px;
    padding: 0 8px;
    font-size: 14px;
  }
`;
