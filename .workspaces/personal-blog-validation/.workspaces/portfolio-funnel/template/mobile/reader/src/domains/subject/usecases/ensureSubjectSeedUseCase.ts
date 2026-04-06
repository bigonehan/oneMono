import type { Subject, SubjectPort } from '../subject_port';

export const ensureSubjectSeedUseCase = async (port: SubjectPort): Promise<Subject[]> => {
  return port.ensureSeed();
};
