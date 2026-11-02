import {
  Brand,
  Controls,
  HeaderContainer,
  LevelSelect,
  Menu,
  MenuButton,
  Timer,
} from "./Header.styles.js";

const MENU_ITEMS = [
  { value: "game", label: "게임" },
  { value: "ranking", label: "랭킹" },
];

function Header({
  activeView,
  levels,
  selectedLevel,
  elapsedTime,
  onViewChange,
  onLevelChange,
}) {
  const isGameView = activeView === "game";

  return (
    <HeaderContainer>
      <Brand>
        <span aria-hidden="true">💅🏾</span>
        <h1>숫자 클릭 게임</h1>
      </Brand>

      <Menu aria-label="화면 선택">
        {MENU_ITEMS.map((menu) => {
          const isActive = activeView === menu.value;

          return (
            <MenuButton
              key={menu.value}
              type="button"
              $isActive={isActive}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onViewChange(menu.value)}
            >
              {menu.label}
            </MenuButton>
          );
        })}
      </Menu>

      <Controls>
        {isGameView && (
          <>
            <LevelSelect
              aria-label="게임 레벨"
              value={selectedLevel}
              onChange={(event) => onLevelChange(Number(event.target.value))}
            >
              {levels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </LevelSelect>
            <Timer aria-label="플레이 시간">{elapsedTime}초</Timer>
          </>
        )}
      </Controls>
    </HeaderContainer>
  );
}

export default Header;
