export interface Experience {
  id: string;
  user_id: string;
  title: string;
  agency: string;
  summary: string;
  gs_level?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  current?: boolean;
}

export interface ExperienceInput {
  title: string;
  agency: string;
  summary: string;
  gs_level: string;
  start_date?: string;
  end_date?: string;
  current?: boolean;
}
