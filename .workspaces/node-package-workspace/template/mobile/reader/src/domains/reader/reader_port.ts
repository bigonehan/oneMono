import type { Subject } from '../subject/subject_port';

export type ReaderSettings = {
  typingIntervalMs: number;
  autoPlay: boolean;
  fontScale: number;
  fontPreset: 'sans' | 'serif' | 'mono';
};

export type ReaderPort = {
  loadSubjectForReading(id: string): Promise<Subject | null>;
};
