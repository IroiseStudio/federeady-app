export interface Skill {
  id: string
  user_id: string
  experience_id?: string
  name: string
  source?: 'llm' | 'manual'
  category?: string
  created_at?: string
}