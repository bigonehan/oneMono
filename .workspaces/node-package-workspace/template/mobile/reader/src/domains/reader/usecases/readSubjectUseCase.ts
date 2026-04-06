import type { Subject } from '../../subject/subject_port';
import type { ReaderPort } from '../reader_port';

export const readSubjectUseCase = async (
  readerPort: ReaderPort,
  id: string
): Promise<Subject | null> => {
  return readerPort.loadSubjectForReading(id);
};
