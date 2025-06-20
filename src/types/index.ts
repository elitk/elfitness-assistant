export interface PersonalInfo {
    age?: number;
    height?: number;
    weight?: number;
  }
  
  export interface Workout {
    date: Date;
    type: string;
    duration: number;
  }
  
  export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }
  
  export interface UserContext {
    personalInfo: PersonalInfo;
    workouts: Workout[];
    lastMessages: Message[];
  }

  export interface Profile {
    id: string;
    name: string | null;
    avatar_url: string | null;
    birth_date?: string | null     
    gender?: 'male' | 'female' | 'other' | null
    weight: number | null;
    height: number | null;
    fitness_goal: string | null;
    goal_target: number | null;
    experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
    goal_date: string | null;
    created_at: string;
    updated_at: string
    goal?: string | null
  }

  export interface UserStats {
    id: string;
    user_id: string;
    date: string;
    weight: number | null;
    calories_consumed: number | null;
    calories_burned: number | null;
    created_at: string;
  }
  export interface Database {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Omit<Profile, 'id' | 'created_at'> & { id?: string };
          Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
        };
        workouts: {
          Row: Workout;
          Insert: Omit<Workout, 'id' | 'created_at'> & { id?: string };
          Update: Partial<Omit<Workout, 'id' | 'created_at'>>;
        };
        user_stats: {
          Row: UserStats;
          Insert: Omit<UserStats, 'id' | 'created_at'> & { id?: string };
          Update: Partial<Omit<UserStats, 'id' | 'created_at'>>;
        };
      };
    };
  }
  