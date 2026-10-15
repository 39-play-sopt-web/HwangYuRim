import { useState } from 'react'
import Header from './components/Header/Header.jsx'
import { LEVELS } from './constants/levels.js'
import { AppShell, MainContent } from './App.styles.js'

const VIEW = {
  game: 'game',
  ranking: 'ranking',
}

function App() {
  const [activeView, setActiveView] = useState(VIEW.game)
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[1].value)

  const isGameView = activeView === VIEW.game

  return (
    <AppShell>
      <Header
        activeView={activeView}
        levels={[LEVELS[1]]}
        selectedLevel={selectedLevel}
        elapsedTime="0.00"
        onViewChange={setActiveView}
        onLevelChange={setSelectedLevel}
      />
      <MainContent aria-label={isGameView ? '게임 화면' : '랭킹 화면'} />
    </AppShell>
  )
}

export default App
