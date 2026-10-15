import { useState } from "react";
import { RECORDS_STORAGE_KEY } from "../../constants/storage.js";
import {
  EmptyMessage,
  RankingHeader,
  RankingSection,
  RankingTable,
  ResetButton,
  TableContainer,
} from "./Ranking.styles.js";

function loadRecords() {
  const records = JSON.parse(localStorage.getItem(RECORDS_STORAGE_KEY) ?? "[]");

  return records.sort((a, b) => a.playTime - b.playTime);
}

function Ranking() {
  const [records, setRecords] = useState(loadRecords);

  const resetRecords = () => {
    localStorage.removeItem(RECORDS_STORAGE_KEY);
    setRecords([]);
  };

  return (
    <RankingSection>
      <RankingHeader>
        <h2>Ranking</h2>
        <ResetButton type="button" onClick={resetRecords}>
          초기화
        </ResetButton>
      </RankingHeader>

      {records.length === 0 ? (
        <EmptyMessage>
          아직 기록이 없어요. <br />
          그대여, 당장 게임 진행시켜~
        </EmptyMessage>
      ) : (
        <TableContainer>
          <RankingTable>
            <thead>
              <tr>
                <th scope="col">순위</th>
                <th scope="col">레벨</th>
                <th scope="col">플레이 시간</th>
                <th scope="col">기록 시각</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${record.playedAt}-${index}`}>
                  <td>{index + 1}</td>
                  <td>Level {record.level}</td>
                  <td>{record.playTime.toFixed(2)}초</td>
                  <td>{new Date(record.playedAt).toLocaleString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </RankingTable>
        </TableContainer>
      )}
    </RankingSection>
  );
}

export default Ranking;
