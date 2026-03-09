import type { Subject } from '../subject/subject_port';

export type ReaderSettings = {
  typingIntervalMs: number;
};

export type ReaderPort = {
  loadSubjectForReading(id: string): Promise<Subject | null>;
};
