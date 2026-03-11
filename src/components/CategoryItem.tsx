import type { Category } from '../types'
import ItemActions from './ItemActions'

interface CategoryItemProps {
  category: Category
  isSelected: boolean
  onClick: () => void
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}

export default function CategoryItem({ category, isSelected, onClick, onEdit, onDelete }: CategoryItemProps) {
  return (
    <li
      className={isSelected ? 'category-item active' : 'category-item'}
      onClick={onClick}
    >
      <span>{category.name}</span>
      {isSelected && (
        <ItemActions
          onEdit={(e) => { e.stopPropagation(); onEdit(e) }}
          onDelete={(e) => { e.stopPropagation(); onDelete(e) }}
        />
      )}
    </li>
  )
}
