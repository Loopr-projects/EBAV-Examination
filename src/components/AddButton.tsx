interface AddButtonProps {
  onClick: () => void
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <button className="add-button" onClick={onClick} aria-label="Add">
      Add
    </button>
  )
}
