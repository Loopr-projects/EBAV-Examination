interface ModalActionsProps {
  onCancel: () => void
  confirmLabel: string
  loadingLabel?: string
  loading?: boolean
  disabled?: boolean
  confirmVariant?: 'primary' | 'danger'
  confirmType?: 'submit' | 'button'
  onConfirm?: () => void
}

export default function ModalActions({
  onCancel,
  confirmLabel,
  loadingLabel,
  loading = false,
  disabled = false,
  confirmVariant = 'primary',
  confirmType = 'submit',
  onConfirm,
}: ModalActionsProps) {
  return (
    <div className="modal-actions">
      <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
        Cancel
      </button>
      <button
        type={confirmType}
        className={confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}
        onClick={onConfirm}
        disabled={loading || disabled}
      >
        {loading && loadingLabel ? loadingLabel : confirmLabel}
      </button>
    </div>
  )
}
