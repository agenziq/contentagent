export type Platform = 'Instagram' | 'Facebook' | 'LinkedIn' | 'X';
export type ContentGoal = 'engagement' | 'leads' | 'awareness' | 'promotion';
export type Tone = 'professional' | 'bold' | 'premium' | 'funny' | 'cinematic';
export type PostType = 'single post' | 'carousel' | 'ad copy';

export type ContentInput = {
  brandName: string;
  niche: string;
  targetAudience: string;
  platform: Platform;
  contentGoal: ContentGoal;
  tone: Tone;
  postType: PostType;
  topicOrOffer: string;
};

export type GeneratedContent = {
  contentIdeas: string[];
  selectedPostCaption: string;
  hook: string;
  callToAction: string;
  imageConcept: string;
  hashtagSuggestions: string[];
};

export type LibraryItem = {
  id: string;
  input: ContentInput;
  content: GeneratedContent;
  imageUrl?: string;
  favorite: boolean;
  createdAt: string;
};
