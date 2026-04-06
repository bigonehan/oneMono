import type { Subject, SubjectPort } from '../subject_port';

export const getSubjectByIdUseCase = async (
  port: SubjectPort,
  id: string
): Promise<Subject | null> => {
  return port.getById(id);
};
