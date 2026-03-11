import { supabase } from '../supabase/client'
import type { Question } from '../types'

export async function fetchQuestionsByCategory(category_guid: number): Promise<Question[]> {
  const { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('category_guid', category_guid)
  if (error) throw error
  return (questions as Question[]) ?? []
}

export async function deleteQuestion(guid: number): Promise<void> {
  const { error } = await supabase.from('questions').delete().eq('guid', guid)
  if (error) throw error
}

export type CreateQuestionPayload = Omit<Question, 'guid' | 'category_guid'>

export async function createQuestion(payload: CreateQuestionPayload, category_guid: number): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .insert([{ ...payload, category_guid }])
    .select()
  if (error) throw error
  return (data as Question[]) ?? []
}

export async function copyQuestion(question: Question): Promise<Question[]> {
  const { guid: _guid, ...payload } = question
  const { data, error } = await supabase
    .from('questions')
    .insert([payload])
    .select()
  if (error) throw error
  return (data as Question[]) ?? []
}

export async function updateQuestion(guid: number, payload: Partial<CreateQuestionPayload>): Promise<Question> {
  const { data, error } = await supabase
    .from('questions')
    .update(payload)
    .eq('guid', guid)
    .select()
  if (error) throw error
  return (data as Question[])[0]
}
