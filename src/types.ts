export interface Category {
  guid: number
  name: string
}

export interface Question {
  guid: number
  question: string
  category_guid: number
  correct_answer: number
  mediaurl: string | null
  answer1: string
  answer2: string
  answer3: string
  answer4: string
  answer5: string
  answer6: string
}
