import { useState, type FormEvent } from 'react'
import type { Category } from '../types'
import ModalActions from './ModalActions'

interface EditCategoryModalProps {
  category: Category
  onClose: () => void
  onSave: (guid: number, name: string) => Promise<void>
}

export default function EditCategoryModal({ category, onClose, onSave }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    setError('')
    setLoading(true)
    try {
      await onSave(category.guid, name.trim())
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Edit Category</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-category-name">Name</label>
            <input
              id="edit-category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <ModalActions
              onCancel={onClose}
              confirmLabel="Save"
              loadingLabel="Saving…"
              loading={loading}
              disabled={!name.trim()}
            />
        </form>
      </div>
    </div>
  )
}
