import { useState, type FormEvent } from 'react'
import type { Category } from '../types'
import type { CreateQuestionPayload } from '../api/questions'
import ModalActions from './ModalActions'

interface CreateQuestionModalProps {
  category: Category
  onClose: () => void
  onCreate: (payload: CreateQuestionPayload, category_guid: number) => Promise<void>
}

const EMPTY: CreateQuestionPayload = {
  question: '',
  correct_answer: 1,
  mediaurl: '',
  answer1: '',
  answer2: '',
  answer3: '',
  answer4: '',
  answer5: '',
  answer6: '',
}

export default function CreateQuestionModal({ category, onClose, onCreate }: CreateQuestionModalProps) {
  const [form, setForm] = useState<CreateQuestionPayload>(EMPTY)
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
      await onCreate({ ...form, mediaurl: form.mediaurl || null }, category.guid)
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create question')
    } finally {
      setLoading(false)
    }
  }

  const isValid = form.question.trim() && form.answer1.trim() && form.answer2.trim()

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card--wide" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Question</h2>
        <p className="modal-message">Category: <strong>{category.name}</strong></p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="q-question">Question</label>
            <input
              id="q-question"
              type="text"
              value={form.question}
              onChange={(e) => set('question', e.target.value)}
              placeholder="Enter question text"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="q-mediaurl">Media URL <span className="label-optional">(optional)</span></label>
            <input
              id="q-mediaurl"
              type="url"
              value={form.mediaurl ?? ''}
              onChange={(e) => set('mediaurl', e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="form-grid-2">
            {([1, 2, 3, 4, 5, 6] as const).map((n) => (
              <div className="form-group" key={n}>
                <label htmlFor={`q-answer-${n}`}>Answer {n}{n <= 2 ? ' *' : ''}</label>
                <input
                  id={`q-answer-${n}`}
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
            <label htmlFor="q-correct">Correct answer</label>
            <select
              id="q-correct"
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
            confirmLabel="Create"
            loadingLabel="Creating…"
            loading={loading}
            disabled={!isValid}
          />
        </form>
      </div>
    </div>
  )
}
