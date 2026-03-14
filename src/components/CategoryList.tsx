import type { Category } from '../types'
import CategoryItem from './CategoryItem'

interface CategoryListProps {
  categories: Category[]
  selectedCategory: Category | null
  onSelect: (category: Category) => void
  onEdit?: (e: React.MouseEvent) => void
  onDelete?: (e: React.MouseEvent) => void
  readOnly?: boolean
}

export default function CategoryList({ categories, selectedCategory, onSelect, onEdit, onDelete, readOnly }: CategoryListProps) {
  return (
    <ul className="category-list">
      {categories.map((cat) => (
        <CategoryItem
          key={cat.guid}
          category={cat}
          isSelected={selectedCategory?.guid === cat.guid}
          onClick={() => onSelect(cat)}
          onEdit={onEdit}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </ul>
  )
}
