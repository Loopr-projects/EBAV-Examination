import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchCategories } from '../../api/categories'
import { fetchQuestionsByCategory } from '../../api/questions'
import type { Category, Question } from '../../types'
import DashboardHeader from '../../components/DashboardHeader'
import CategoryList from '../../components/CategoryList'
import QuestionItem from '../../components/QuestionItem'
import StudentExamination from './StudentExamination'

export default function StudentDashboard() {
  const { user, signOut } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [categoryError, setCategoryError] = useState('')
  const [questionError, setQuestionError] = useState('')
  const [examActive, setExamActive] = useState(false)

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

  if (examActive && questions.length > 0) {
    return <StudentExamination questions={questions} onExit={() => setExamActive(false)} />
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader email={user?.email ?? ''} onSignOut={signOut} />

      <main className="dashboard-main">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card-header">
              <h3>Categories</h3>
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
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </div>

          {selectedCategory && (
            <div className="info-grid-column">
              <div className="info-card practice-card">
                <span className="practice-card-label">Practice exam for this category</span>
                <button
                  className="btn-primary"
                  disabled={questions.length === 0 || loadingQuestions}
                  onClick={() => setExamActive(true)}
                >
                  Start
                </button>
              </div>

              <div className="info-card">
              <div className="info-card-header">
                <h3>Questions</h3>
              </div>
              {loadingQuestions ? (
                <p>Loading…</p>
              ) : questionError ? (
                <p className="error-message">{questionError}</p>
              ) : questions.length === 0 ? (
                <p>No questions in this category.</p>
              ) : (
                <ol className="question-list">
                  {questions.map((q) => (
                    <QuestionItem
                      key={q.guid}
                      question={q}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </ol>
              )}
            </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
