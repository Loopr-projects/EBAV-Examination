import { useState } from 'react'
import ModalActions from './ModalActions'

interface ConfirmationModalProps {
  message: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function ConfirmationModal({ message, onClose, onConfirm }: ConfirmationModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setError('')
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Confirm</h2>
        <p className="modal-message">{message}</p>

        {error && <p className="error-message">{error}</p>}

        <ModalActions
          onCancel={onClose}
          confirmLabel="Delete"
          loadingLabel="Deleting…"
          loading={loading}
          confirmVariant="danger"
          confirmType="button"
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  )
}
