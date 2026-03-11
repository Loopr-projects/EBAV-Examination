import { useState, type FormEvent } from 'react'
import type { Question } from '../types'
import type { CreateQuestionPayload } from '../api/questions'
import ModalActions from './ModalActions'

interface EditQuestionModalProps {
  question: Question
  onClose: () => void
  onSave: (guid: number, payload: Partial<CreateQuestionPayload>) => Promise<void>
}

export default function EditQuestionModal({ question, onClose, onSave }: EditQuestionModalProps) {
  const [form, setForm] = useState<CreateQuestionPayload>({
    question: question.question,
    correct_answer: question.correct_answer,
    mediaurl: question.mediaurl ?? '',
    answer1: question.answer1,
    answer2: question.answer2,
    answer3: question.answer3,
    answer4: question.answer4,
    answer5: question.answer5,
    answer6: question.answer6,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof CreateQuestionPayload>(key: K, value: CreateQuestionPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!form.question.trim() || !form.answer1.trim() || !form.answer2.trim()) return
    setError('')
    setLoading(true)
    try {
      await onSave(question.guid, { ...form, mediaurl: form.mediaurl || null })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update question')
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.question.trim() && form.answer1.trim() && form.answer2.trim()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card--wide" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit Question</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="eq-question">Question</label>
            <input
              id="eq-question"
              type="text"
              value={form.question}
              onChange={(e) => set('question', e.target.value)}
              placeholder="Enter question text"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eq-mediaurl">Media URL <span className="label-optional">(optional)</span></label>
            <input
              id="eq-mediaurl"
              type="url"
              value={form.mediaurl ?? ''}
              onChange={(e) => set('mediaurl', e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="form-grid-2">
            {([1, 2, 3, 4, 5, 6] as const).map((n) => (
              <div className="form-group" key={n}>
                <label htmlFor={`eq-answer-${n}`}>Answer {n}{n <= 2 ? ' *' : ''}</label>
                <input
                  id={`eq-answer-${n}`}
                  type="text"
                  value={form[`answer${n}`]}
                  onChange={(e) => set(`answer${n}`, e.target.value)}
                  placeholder={`Answer ${n}`}
                  required={n <= 2}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="eq-correct">Correct answer</label>
            <select
              id="eq-correct"
              value={form.correct_answer}
              onChange={(e) => set('correct_answer', Number(e.target.value))}
              required
            >
              {([1, 2, 3, 4, 5, 6] as const).map((n) => (
                <option key={n} value={n} disabled={n > 2 && !form[`answer${n}`].trim()}>
                  Answer {n}
                </option>
              ))}
            </select>
          </div>

          <ModalActions
            onCancel={onClose}
            confirmLabel="Save"
            loadingLabel="Saving…"
            loading={loading}
            disabled={!isValid}
          />
        </form>
      </div>
    </div>
  )
}
