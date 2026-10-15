import styled from '@emotion/styled'

export const RankingSection = styled.section`
  width: min(720px, calc(100% - 40px));
  margin: 0 auto;
  padding: 48px 0;
`

export const RankingHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
  }
`

export const ResetButton = styled.button`
  height: 36px;
  padding: 0 14px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.small};
  font-weight: 700;
`

export const TableContainer = styled.div`
  overflow-x: auto;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.medium};
`

export const RankingTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 12px 16px;
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.colors.primarySoft};
  }

  tbody tr + tr {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`

export const EmptyMessage = styled.p`
  margin: 96px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`
