import type { Category } from '../types'
import ItemActions from './ItemActions'

interface CategoryItemProps {
  category: Category
  isSelected: boolean
  onClick: () => void
  onEdit?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  readOnly?: boolean
}

export default function CategoryItem({ category, isSelected, onClick, onEdit, onDelete, readOnly }: CategoryItemProps) {
  return (
    <li
      className={isSelected ? 'category-item active' : 'category-item'}
      onClick={onClick}
    >
      <span>{category.name}</span>
      {isSelected && !readOnly && onEdit && onDelete && (
        <ItemActions
          onEdit={(e) => { e.stopPropagation(); onEdit(e) }}
          onDelete={(e) => { e.stopPropagation(); onDelete(e) }}
        />
      )}
    </li>
  )
}
