import { useState } from 'react'
import Game from './components/Game/Game.jsx'
import Header from './components/Header/Header.jsx'
import Ranking from './components/Ranking/Ranking.jsx'
import { LEVELS } from './constants/levels.js'
import { AppShell, MainContent } from './App.styles.js'

const VIEW = {
  game: 'game',
  ranking: 'ranking',
}
const LEVEL_OPTIONS = Object.values(LEVELS)

function App() {
  const [activeView, setActiveView] = useState(VIEW.game)
  const [selectedLevel, setSelectedLevel] = useState(LEVELS[1].value)
  const [elapsedTime, setElapsedTime] = useState('0.00')

  const isGameView = activeView === VIEW.game
  const selectedLevelConfig = LEVELS[selectedLevel]

  const handleViewChange = (view) => {
    setActiveView(view)

    if (view === VIEW.ranking) {
      setElapsedTime('0.00')
    }
  }

  const handleLevelChange = (level) => {
    setSelectedLevel(level)
    setElapsedTime('0.00')
  }

  return (
    <AppShell>
      <Header
        activeView={activeView}
        levels={LEVEL_OPTIONS}
        selectedLevel={selectedLevel}
        elapsedTime={elapsedTime}
        onViewChange={handleViewChange}
        onLevelChange={handleLevelChange}
      />
      <MainContent aria-label={isGameView ? '게임 화면' : '랭킹 화면'}>
        {isGameView && (
          <Game
            key={selectedLevel}
            level={selectedLevelConfig}
            onTimeChange={setElapsedTime}
          />
        )}
        {!isGameView && <Ranking />}
      </MainContent>
    </AppShell>
  )
}

export default App
