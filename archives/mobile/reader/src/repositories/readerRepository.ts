import type { ReaderPort } from '../domains/reader/reader_port';
import type { SubjectPort } from '../domains/subject/subject_port';
import { getSubjectByIdUseCase } from '../domains/subject/usecases/getSubjectByIdUseCase';

export const createReaderRepository = (subjectPort: SubjectPort): ReaderPort => {
  return {
    async loadSubjectForReading(id: string) {
      return getSubjectByIdUseCase(subjectPort, id);
    }
  };
};
