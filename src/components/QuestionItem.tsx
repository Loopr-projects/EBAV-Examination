import { useState } from 'react'
import type { Question } from '../types'
import ItemActions from './ItemActions'

interface QuestionItemProps {
  question: Question
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
  onCopy?: (e: React.MouseEvent) => void
}

const ANSWER_KEYS = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5', 'answer6'] as const

export default function QuestionItem({ question, onEdit, onDelete, onCopy }: QuestionItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const mediaUrl = question.mediaurl?.trim() || null

  return (
    <li className={`question-item${expanded ? ' expanded' : ''}`}>
      <div className="question-item-header" onClick={() => setExpanded((v) => !v)}>
        <span>{question.question}</span>
        <div className="question-item-header-right">
          <ItemActions
            onEdit={(e) => { e.stopPropagation(); onEdit(e) }}
            onDelete={(e) => { e.stopPropagation(); onDelete(e) }}
            onCopy={onCopy ? (e) => { e.stopPropagation(); onCopy(e) } : undefined}
          />
          <span className="question-item-chevron">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {expanded && (
        <div className="question-expanded">
          {mediaUrl && (
            <div className="question-media">
              {imgError
                ? <p className="question-media-error">Could not load image: {mediaUrl}</p>
                : <img src={mediaUrl} alt="Question media" onError={() => setImgError(true)} />
              }
            </div>
          )}
          <ol className="question-answers">
            {ANSWER_KEYS.map((key, i) => {
              const num = i + 1
              const isCorrect = question.correct_answer === num
              return (
                <li key={key} className={`question-answer${isCorrect ? ' correct' : ''}`}>
                  {question[key]}
                </li>
              )
            })}
          </ol>
        </div>
      )}
    </li>
  )
}
