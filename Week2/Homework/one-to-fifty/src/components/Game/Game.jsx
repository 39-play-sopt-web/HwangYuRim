import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createTiles } from '../../utils/game.js'
import {
  ConfirmButton,
  GameBoard,
  GameSection,
  ModalDialog,
  ModalTime,
  NextNumber,
  NumberButton,
  Status,
} from './Game.styles.js'

const RECORDS_STORAGE_KEY = 'oneToFiftyRecords'
const TIMER_INTERVAL = 10

function ResultModal({ level, playTime, onConfirm }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()

    return () => dialog.close()
  }, [])

  const handleCancel = (event) => {
    event.preventDefault()
  }

  return createPortal(
    <ModalDialog
      ref={dialogRef}
      aria-labelledby="result-title"
      onCancel={handleCancel}
    >
      <h2 id="result-title">🆒 Level {level} 야호~!</h2>
      <ModalTime>{playTime}초</ModalTime>
      <ConfirmButton type="button" autoFocus onClick={onConfirm}>
        확인
      </ConfirmButton>
    </ModalDialog>,
    document.body,
  )
}

function Game({ level, onTimeChange }) {
  const [tiles, setTiles] = useState(() => createTiles(level.maxNumber))
  const [nextNumber, setNextNumber] = useState(1)
  const [completedTime, setCompletedTime] = useState(null)
  const startedAtRef = useRef(null)
  const timerIdRef = useRef(null)

  const stopTimer = () => {
    window.clearInterval(timerIdRef.current)
    timerIdRef.current = null
  }

  const resetGame = () => {
    stopTimer()
    startedAtRef.current = null
    setTiles(createTiles(level.maxNumber))
    setNextNumber(1)
    setCompletedTime(null)
    onTimeChange('0.00')
  }

  const startTimer = (startedAt) => {
    startedAtRef.current = startedAt
    timerIdRef.current = window.setInterval(() => {
      const elapsedSeconds = (performance.now() - startedAtRef.current) / 1000
      onTimeChange(elapsedSeconds.toFixed(2))
    }, TIMER_INTERVAL)
  }

  const saveRecord = (playTime) => {
    const records = JSON.parse(
      localStorage.getItem(RECORDS_STORAGE_KEY) ?? '[]',
    )

    records.push({
      playedAt: new Date().toISOString(),
      level: level.value,
      playTime: Number(playTime),
    })
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records))
  }

  const finishGame = (finishedAt) => {
    const playTime = ((finishedAt - startedAtRef.current) / 1000).toFixed(2)

    stopTimer()
    onTimeChange(playTime)
    saveRecord(playTime)
    setCompletedTime(playTime)
  }

  const handleNumberClick = (event, clickedNumber, tileIndex) => {
    if (clickedNumber !== nextNumber) {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (!prefersReducedMotion) {
        event.currentTarget.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' },
          ],
          { duration: 220, easing: 'ease-in-out' },
        )
      }
      return
    }

    if (clickedNumber === 1) {
      startTimer(event.timeStamp)
    }

    setTiles((currentTiles) =>
      currentTiles.map((tile, index) =>
        index === tileIndex ? { current: tile.next, next: null } : tile,
      ),
    )

    if (clickedNumber === level.maxNumber) {
      finishGame(event.timeStamp)
      return
    }

    setNextNumber((currentNumber) => currentNumber + 1)
  }

  useEffect(() => () => stopTimer(), [])

  return (
    <GameSection>
      <Status>
        다음 숫자{' '}
        <NextNumber>{completedTime ? 'Pass' : nextNumber}</NextNumber>
        <span>
          ({nextNumber} / {level.maxNumber})
        </span>
      </Status>

      <GameBoard $size={level.size}>
        {tiles.map((tile, index) => (
          <NumberButton
            key={index}
            type="button"
            disabled={tile.current === null}
            aria-hidden={tile.current === null}
            onClick={(event) => handleNumberClick(event, tile.current, index)}
          >
            {tile.current}
          </NumberButton>
        ))}
      </GameBoard>

      {completedTime && (
        <ResultModal
          level={level.value}
          playTime={completedTime}
          onConfirm={resetGame}
        />
      )}
    </GameSection>
  )
}

export default Game
