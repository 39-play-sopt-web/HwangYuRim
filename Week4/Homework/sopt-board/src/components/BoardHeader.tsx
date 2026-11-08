import { useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useNavigate } from "react-router";
import styled from "styled-components";
import { clearAuth, readAuth } from "../auth";

export default function BoardHeader() {
  const auth = readAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleLogout() {
    try {
      clearAuth();
    } catch {
      window.alert(
        "로그아웃하지 못했어요. 브라우저의 저장소 설정을 확인해주세요.",
      );
      return;
    }

    queryClient.clear();
    navigate("/", { replace: true });
  }

  return (
    <Header>
      <Inner>
        <Brand>
          <Logo to="/">SOPT Board💌</Logo>
          <Part>{auth ? `${auth.part} 파트` : "Are you GUEST?"}</Part>
        </Brand>
        <Navigation aria-label="게시판 메뉴">
          <NavLink to="/posts" end>
            게시글 목록
          </NavLink>
          <NavLink to="/posts/new">글쓰기</NavLink>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </Navigation>
      </Inner>
    </Header>
  );
}

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  width: min(100% - 40px, 1040px);
  min-height: 72px;
  margin: 0 auto;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const Logo = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
`;

const Part = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  a,
  button {
    padding: 4px 0;
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    transition: color 150ms ease;
  }

  a[aria-current="page"],
  a:hover,
  button:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  a[aria-current="page"] {
    font-weight: 700;
  }
`;
