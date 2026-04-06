import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import type { Subject, SubjectPort } from '../domains/subject/subject_port';
import { SEED_DOCUMENTS } from '../constants/seedDocuments';

const WEB_STORAGE_PREFIX = 'reader-seed-document:';

const getSeedDirectory = (): string => {
  const base = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!base) {
    throw new Error('File system directory is unavailable.');
  }
  return `${base}reader-seed-documents/`;
};

const getWebStorage = (): Storage | null => {
  if (typeof globalThis === 'undefined') {
    return null;
  }
  return globalThis.localStorage ?? null;
};

const ensureDocumentContent = async (
  subjectId: string,
  fileName: string,
  seedContent: string
): Promise<string> => {
  if (Platform.OS === 'web') {
    const storage = getWebStorage();
    if (!storage) {
      return seedContent;
    }

    const key = `${WEB_STORAGE_PREFIX}${subjectId}`;
    const current = storage.getItem(key);
    if (current === null) {
      storage.setItem(key, seedContent);
      return seedContent;
    }

    return current;
  }

  const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;

  if (!directory) {
    throw new Error('File system directory is unavailable.');
  }

  const seedDirectory = getSeedDirectory();
  await FileSystem.makeDirectoryAsync(seedDirectory, { intermediates: true });
  const path = `${seedDirectory}${fileName}`;
  const info = await FileSystem.getInfoAsync(path);

  if (!info.exists) {
    await FileSystem.writeAsStringAsync(path, seedContent, {
      encoding: FileSystem.EncodingType.UTF8
    });
  }

  return FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.UTF8
  });
};

const ensureDocumentFile = async (subjectId: string): Promise<Subject | null> => {
  const seed = SEED_DOCUMENTS.find((item) => item.id === subjectId);
  if (!seed) {
    return null;
  }

  const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  const path = directory ? `${getSeedDirectory()}${seed.fileName}` : `web-storage://${seed.fileName}`;
  const content = await ensureDocumentContent(subjectId, seed.fileName, seed.content);

  return {
    id: seed.id,
    title: seed.title,
    fileName: seed.fileName,
    path,
    description: seed.description,
    tags: seed.tags,
    content
  };
};

export const fileSubjectRepository: SubjectPort = {
  async ensureSeed() {
    const results = await Promise.allSettled(SEED_DOCUMENTS.map((item) => ensureDocumentFile(item.id)));
    return results
      .filter((result): result is PromiseFulfilledResult<Subject | null> => result.status === 'fulfilled')
      .map((result) => result.value)
      .filter((item): item is Subject => item !== null);
  },
  async getById(id) {
    return ensureDocumentFile(id);
  }
};
