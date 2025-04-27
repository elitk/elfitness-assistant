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