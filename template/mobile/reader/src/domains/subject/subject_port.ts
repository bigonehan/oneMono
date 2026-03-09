export type Subject = {
  id: string;
  title: string;
  fileName: string;
  path: string;
  content: string;
};

export type SubjectPort = {
  ensureSeed(): Promise<Subject[]>;
  getById(id: string): Promise<Subject | null>;
};
