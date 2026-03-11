import type { Question } from '../types'
import QuestionItem from './QuestionItem'

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question, e: React.MouseEvent) => void
  onDelete: (question: Question, e: React.MouseEvent) => void
  onCopy?: (question: Question, e: React.MouseEvent) => void
}

export default function QuestionList({ questions, onEdit, onDelete, onCopy }: QuestionListProps) {
  return (
    <ol className="question-list">
      {questions.map((q) => (
        <QuestionItem
          key={q.guid}
          question={q}
          onEdit={(e) => onEdit(q, e)}
          onDelete={(e) => onDelete(q, e)}
          onCopy={onCopy ? (e) => onCopy(q, e) : undefined}
        />
      ))}
    </ol>
  )
}
