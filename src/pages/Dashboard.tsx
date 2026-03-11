import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/categories'
import { createQuestion, fetchQuestionsByCategory, deleteQuestion, copyQuestion } from '../api/questions'
import type { CreateQuestionPayload } from '../api/questions'
import type { Category, Question } from '../types'
import DashboardHeader from '../components/DashboardHeader'
import AddButton from '../components/AddButton'
import CategoryList from '../components/CategoryList'
import QuestionList from '../components/QuestionList'
import CreateCategoryModal from '../components/CreateCategoryModal'
import EditCategoryModal from '../components/EditCategoryModal'
import ConfirmationModal from '../components/ConfirmationModal'
import CreateQuestionModal from '../components/CreateQuestionModal'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [categoryError, setCategoryError] = useState('')
  const [questionError, setQuestionError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false)
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)

  useEffect(() => {
    setLoadingCategories(true)
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err: Error) => setCategoryError(err.message))
      .finally(() => setLoadingCategories(false))
  }, [])

  useEffect(() => {
    if (!selectedCategory) {
      setQuestions([])
      return
    }
    setLoadingQuestions(true)
    setQuestionError('')
    fetchQuestionsByCategory(selectedCategory.guid)
      .then((data) => setQuestions(data))
      .catch((err: Error) => setQuestionError(err.message))
      .finally(() => setLoadingQuestions(false))
  }, [selectedCategory])

  async function handleSignOut() {
    await signOut()
  }

  async function handleCreateCategory(name: string) {
    const [created] = await createCategory(name)
    setCategories((prev) => [...prev, created])
  }

  async function handleUpdateCategory(guid: number, name: string) {
    const [updated] = await updateCategory(guid, name)
    setCategories((prev) => prev.map((c) => (c.guid === guid ? updated : c)))
    setSelectedCategory(updated)
  }

  async function handleDeleteCategory() {
    if (!selectedCategory) return
    await deleteCategory(selectedCategory.guid)
    setCategories((prev) => prev.filter((c) => c.guid !== selectedCategory.guid))
    setSelectedCategory(null)
  }

  async function handleCreateQuestion(payload: CreateQuestionPayload, category_guid: number) {
    const [created] = await createQuestion(payload, category_guid)
    setQuestions((prev) => [...prev, created])
  }

  async function handleDeleteQuestion() {
    if (!selectedQuestion) return
    await deleteQuestion(selectedQuestion.guid)
    setQuestions((prev) => prev.filter((q) => q.guid !== selectedQuestion.guid))
    setSelectedQuestion(null)
  }

  async function handleCopyQuestion(question: Question) {
    const [created] = await copyQuestion(question)
    setQuestions((prev) => [...prev, created])
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader email={user?.email ?? ''} onSignOut={handleSignOut} />

      <main className="dashboard-main">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Categories</h3>
              <AddButton onClick={() => setShowCreateModal(true)} />
            </div>
            {loadingCategories ? (
              <p>Loading…</p>
            ) : categoryError ? (
              <p className="error-message">{categoryError}</p>
            ) : categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                onEdit={(e) => { e.stopPropagation(); setShowEditModal(true) }}
                onDelete={(e) => { e.stopPropagation(); setShowDeleteModal(true) }}
              />
            )}
          </div>

          {selectedCategory && (
          <div className="info-card">
            <div className="info-card-header">
              <h3>Questions</h3>
              <AddButton onClick={() => setShowCreateQuestionModal(true)} />
            </div>
            {loadingQuestions ? (
              <p>Loading…</p>
            ) : questionError ? (
              <p className="error-message">{questionError}</p>
            ) : questions.length === 0 ? (
              <p>No questions in this category.</p>
            ) : (
              <QuestionList
                questions={questions}
                onEdit={(q) => setSelectedQuestion(q)}
                onDelete={(q) => { setSelectedQuestion(q); setShowDeleteQuestionModal(true) }}
                onCopy={(q) => handleCopyQuestion(q)}
              />
            )}
          </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <CreateCategoryModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCategory}
        />
      )}

      {showEditModal && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateCategory}
        />
      )}

      {showDeleteModal && selectedCategory && (
        <ConfirmationModal
          message={`Are you sure you want to delete "${selectedCategory.name}"?`}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCategory}
        />
      )}
      {showCreateQuestionModal && selectedCategory && (
        <CreateQuestionModal
          category={selectedCategory}
          onClose={() => setShowCreateQuestionModal(false)}
          onCreate={handleCreateQuestion}
        />
      )}
      {showDeleteQuestionModal && selectedQuestion && (
        <ConfirmationModal
          message={`Are you sure you want to delete this question?`}
          onClose={() => setShowDeleteQuestionModal(false)}
          onConfirm={handleDeleteQuestion}
        />
      )}
    </div>
  )
}
