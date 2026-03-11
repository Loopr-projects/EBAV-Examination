import { useState, type FormEvent } from 'react'
import ModalActions from './ModalActions'

interface CreateCategoryModalProps {
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

export default function CreateCategoryModal({ onClose, onCreate }: CreateCategoryModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    setLoading(true)
    try {
      await onCreate(name.trim())
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Category</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="category-name">Name</label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              autoFocus
              required
            />
          </div>

          <ModalActions
              onCancel={onClose}
              confirmLabel="Create"
              loadingLabel="Creating…"
              loading={loading}
              disabled={!name.trim()}
            />
        </form>
      </div>
    </div>
  )
}
