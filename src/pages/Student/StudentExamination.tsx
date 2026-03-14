import { useEffect, useRef, useState } from 'react'
import type { Question } from '../../types'

interface StudentExaminationProps {
  questions: Question[]
  onExit: () => void
}

const EXAM_QUESTION_COUNT = 20
const TOTAL_SECONDS = 40 * 60
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
  const [shuffled] = useState<Question[]>(() => shuffle(questions).slice(0, EXAM_QUESTION_COUNT))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    new Array(Math.min(questions.length, EXAM_QUESTION_COUNT)).fill(null)
  )
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [phase, setPhase] = useState<Phase>('exam')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalQuestions = shuffled.length
  const current = shuffled[currentIndex]

  // Single global countdown for the entire exam
  useEffect(() => {
    if (phase !== 'exam') return

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setPhase('results')
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current!)
  }, [phase])

  function selectAnswer(num: number) {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentIndex] = num
      return next
    })
  }

  function submitExam() {
    clearInterval(timerRef.current!)
    setPhase('results')
  }

  const filledAnswers = ANSWER_KEYS.map((key, i) => ({ key, num: i + 1, text: current?.[key] }))
    .filter((a) => a.text?.trim())

  const timerPercent = (timeLeft / TOTAL_SECONDS) * 100
  const timerDanger = timeLeft <= 300 // 5-minute warning

  const correctCount = answers.filter((a, i) => a === shuffled[i]?.correct_answer).length
  const answeredCount = answers.filter((a) => a !== null).length

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
                      <span className="result-answer timed-out">— No answer given</span>
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
            Back to Questions
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
              <button
                className={`exam-answer-btn${answers[currentIndex] === num ? ' selected' : ''}`}
                onClick={() => selectAnswer(num)}
              >
                <span className="exam-answer-letter">{String.fromCharCode(64 + num)}</span>
                <span>{text}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="exam-nav">
          <div className="exam-nav-dots">
            {shuffled.map((_, i) => (
              <button
                key={i}
                className={`exam-nav-dot${i === currentIndex ? ' current' : ''}${answers[i] !== null ? ' answered' : ''}`}
                onClick={() => setCurrentIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="exam-nav-actions">
            <button
              className="btn-secondary"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </button>
            <span className="exam-answered-count">{answeredCount} / {totalQuestions} answered</span>
            {currentIndex < totalQuestions - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setCurrentIndex((i) => i + 1)}
              >
                Next
              </button>
            ) : (
              <button className="btn-primary" onClick={submitExam}>
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
