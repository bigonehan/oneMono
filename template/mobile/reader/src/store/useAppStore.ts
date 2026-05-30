import { create } from 'zustand';
import type { ReaderSettings } from '../domains/reader/reader_port';
import type { Subject } from '../domains/subject/subject_port';
import { readSubjectUseCase } from '../domains/reader/usecases/readSubjectUseCase';
import { ensureSubjectSeedUseCase } from '../domains/subject/usecases/ensureSubjectSeedUseCase';
import { createReaderRepository } from '../repositories/readerRepository';
import { fileSubjectRepository } from '../repositories/fileSubjectRepository';

type AppState = {
  subjects: Subject[];
  selectedSubjectId: string | null;
  currentSubject: Subject | null;
  readerSettings: ReaderSettings;
  bootstrap: () => Promise<void>;
  selectSubject: (id: string) => Promise<void>;
};

const readerRepository = createReaderRepository(fileSubjectRepository);

export const useAppStore = create<AppState>((set, get) => ({
  subjects: [],
  selectedSubjectId: null,
  currentSubject: null,
  readerSettings: {
    typingIntervalMs: 40
  },
  bootstrap: async () => {
    const subjects = await ensureSubjectSeedUseCase(fileSubjectRepository);
    const first = subjects[0] ?? null;

    set({
      subjects,
      selectedSubjectId: first?.id ?? null,
      currentSubject: first
    });
  },
  selectSubject: async (id: string) => {
    const selected = await readSubjectUseCase(readerRepository, id);
    if (!selected) {
      return;
    }

    const prev = get().subjects;
    const exists = prev.some((item) => item.id === selected.id);

    set({
      selectedSubjectId: selected.id,
      currentSubject: selected,
      subjects: exists ? prev : [...prev, selected]
    });
  }
}));
