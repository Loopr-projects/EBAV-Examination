import type { Question } from '../types'
import QuestionItem from './QuestionItem'

interface QuestionListProps {
  questions: Question[]
  onEdit?: (question: Question, e: React.MouseEvent) => void
  onDelete?: (question: Question, e: React.MouseEvent) => void
  onCopy?: (question: Question, e: React.MouseEvent) => void
  readOnly?: boolean
}

export default function QuestionList({ questions, onEdit, onDelete, onCopy, readOnly }: QuestionListProps) {
  return (
    <ol className="question-list">
      {questions.map((q) => (
        <QuestionItem
          key={q.guid}
          question={q}
          onEdit={onEdit ? (e) => onEdit(q, e) : undefined}
          onDelete={onDelete ? (e) => onDelete(q, e) : undefined}
          onCopy={onCopy ? (e) => onCopy(q, e) : undefined}
          readOnly={readOnly}
        />
      ))}
    </ol>
  )
}
