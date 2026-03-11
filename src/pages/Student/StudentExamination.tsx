import { useEffect, useRef, useState } from 'react'
import type { Question } from '../../types'

interface StudentExaminationProps {
  questions: Question[]
  onExit: () => void
}

const SECONDS_PER_QUESTION = 120
const ANSWER_KEYS = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5', 'answer6'] as const

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

type Phase = 'exam' | 'results'

export default function StudentExamination({ questions, onExit }: StudentExaminationProps) {
  const [shuffled] = useState<Question[]>(() => shuffle(questions))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION)
  const [phase, setPhase] = useState<Phase>('exam')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const current = shuffled[currentIndex]
  const totalQuestions = shuffled.length

  // Reset and start timer on each new question
  useEffect(() => {
    if (phase !== 'exam') return
    setTimeLeft(SECONDS_PER_QUESTION)

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          advance(null)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current!)
  }, [currentIndex, phase])

  function advance(answer: number | null) {
    clearInterval(timerRef.current!)
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = answer
      return next
    })
    if (currentIndex + 1 >= totalQuestions) {
      setPhase('results')
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function handleAnswer(num: number) {
    advance(num)
  }

  const filledAnswers = ANSWER_KEYS.map((key, i) => ({ key, num: i + 1, text: current?.[key] }))
    .filter((a) => a.text?.trim())

  const timerPercent = (timeLeft / SECONDS_PER_QUESTION) * 100
  const timerDanger = timeLeft <= 30

  // Score calculation
  const correctCount = answers.filter((a, i) => a === shuffled[i]?.correct_answer).length

  if (phase === 'results') {
    return (
      <div className="exam-fullscreen">
        <div className="exam-results">
          <div className="exam-results-header">
            <h1>Exam Results</h1>
            <p className="exam-score">
              <span className={correctCount / totalQuestions >= 0.7 ? 'score-pass' : 'score-fail'}>
                {correctCount} / {totalQuestions} correct
              </span>
              <span className="score-pct">({Math.round((correctCount / totalQuestions) * 100)}%)</span>
            </p>
          </div>

          <ol className="results-list">
            {shuffled.map((q, i) => {
              const given = answers[i]
              const correct = q.correct_answer
              const isCorrect = given === correct
              return (
                <li key={q.guid} className={`result-item ${isCorrect ? 'result-correct' : 'result-wrong'}`}>
                  <div className="result-item-header">
                    <span className="result-icon">{isCorrect ? '✓' : '✗'}</span>
                    <span className="result-question">{q.question}</span>
                  </div>
                  <div className="result-answers">
                    {given === null && (
                      <span className="result-answer timed-out">⏱ Timed out — no answer given</span>
                    )}
                    {given !== null && !isCorrect && (
                      <span className="result-answer your-answer">
                        Your answer: {q[ANSWER_KEYS[given - 1]]}
                      </span>
                    )}
                    <span className="result-answer correct-answer">
                      Correct: {q[ANSWER_KEYS[correct - 1]]}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>

          <button className="btn-primary exam-exit-btn" onClick={onExit}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-fullscreen">
      <div className="exam-card">
        <div className="exam-topbar">
          <span className="exam-progress">{currentIndex + 1} / {totalQuestions}</span>
          <div className="exam-timer-wrap">
            <span className={`exam-timer-text ${timerDanger ? 'danger' : ''}`}>{formatTime(timeLeft)}</span>
            <div className="exam-timer-bar">
              <div
                className={`exam-timer-fill ${timerDanger ? 'danger' : ''}`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>
          <button className="btn-secondary exam-quit-btn" onClick={onExit}>Quit</button>
        </div>

        <div className="exam-question">
          {current.mediaurl?.trim() && (
            <img src={current.mediaurl} alt="Question media" className="exam-media" />
          )}
          <p className="exam-question-text">{current.question}</p>
        </div>

        <ol className="exam-answers">
          {filledAnswers.map(({ num, text }) => (
            <li key={num}>
              <button className="exam-answer-btn" onClick={() => handleAnswer(num)}>
                <span className="exam-answer-letter">{String.fromCharCode(64 + num)}</span>
                <span>{text}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
