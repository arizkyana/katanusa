
export interface Expert {
  id: string;
  name: string;
  title: string;
  experience: string;
  avatarUrl: string;
  bio: string;
  specialties: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
