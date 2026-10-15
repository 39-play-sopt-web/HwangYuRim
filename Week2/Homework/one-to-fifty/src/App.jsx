import { useState } from 'react'
import Game from './components/Game/Game.jsx'
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
  const [elapsedTime, setElapsedTime] = useState('0.00')

  const isGameView = activeView === VIEW.game
  const selectedLevelConfig = LEVELS[selectedLevel]

  const handleViewChange = (view) => {
    setActiveView(view)

    if (view === VIEW.ranking) {
      setElapsedTime('0.00')
    }
  }

  return (
    <AppShell>
      <Header
        activeView={activeView}
        levels={[LEVELS[1]]}
        selectedLevel={selectedLevel}
        elapsedTime={elapsedTime}
        onViewChange={handleViewChange}
        onLevelChange={setSelectedLevel}
      />
      <MainContent aria-label={isGameView ? '게임 화면' : '랭킹 화면'}>
        {isGameView && (
          <Game level={selectedLevelConfig} onTimeChange={setElapsedTime} />
        )}
      </MainContent>
    </AppShell>
  )
}

export default App
