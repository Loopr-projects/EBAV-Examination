import { PencilIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'

interface ItemActionsProps {
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
  onCopy?: (e: React.MouseEvent) => void
}

export default function ItemActions({ onEdit, onDelete, onCopy }: ItemActionsProps) {
  return (
    <span className="category-item-actions">
      {onCopy && (
        <button
          className="icon-btn"
          title="Copy"
          onClick={onCopy}
        >
          <DocumentDuplicateIcon className="hero-icon" />
        </button>
      )}
      <button
        className="icon-btn"
        title="Edit"
        onClick={onEdit}
      >
        <PencilIcon className="hero-icon" />
      </button>
      <button
        className="icon-btn icon-btn--danger"
        title="Delete"
        onClick={onDelete}
      >
        <TrashIcon className="hero-icon" />
      </button>
    </span>
  )
}
