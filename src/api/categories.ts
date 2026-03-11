import { supabase } from '../supabase/client'
import type { Category } from '../types'

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*')
  if (error) throw error
  return (data as Category[]) ?? []
}

export async function createCategory(name: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
  if (error) throw error
  return (data as Category[]) ?? []
}

export async function updateCategory(guid: number, name: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('guid', guid)
    .select()
  if (error) throw error
  return (data as Category[]) ?? []
}

export async function deleteCategory(guid: number): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('guid', guid)
  if (error) throw error
}
