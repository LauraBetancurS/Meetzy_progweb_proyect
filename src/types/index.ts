
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};
export type Community = {
  id: string;
  name: string;
  description?: string;
  members: number;
};
export type Event = {
  id: string;
  title: string;
  date: string;
  location?: string;
  communityId?: string;
};
export type MoodAnswer = { questionId: string; answer: number };
