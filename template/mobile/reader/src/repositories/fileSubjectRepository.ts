import * as FileSystem from 'expo-file-system';
import { NATION_SONG_CONTENT, NATION_SONG_FILENAME } from '../constants/nationSong';
import type { Subject, SubjectPort } from '../domains/subject/subject_port';

const SUBJECT_ID = 'nation_song';

const getNationSongPath = (): string => {
  const base = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!base) {
    throw new Error('File system directory is unavailable.');
  }
  return `${base}${NATION_SONG_FILENAME}`;
};

const ensureNationSongSubject = async (): Promise<Subject> => {
  const path = getNationSongPath();
  const info = await FileSystem.getInfoAsync(path);

  if (!info.exists) {
    await FileSystem.writeAsStringAsync(path, NATION_SONG_CONTENT, {
      encoding: FileSystem.EncodingType.UTF8
    });
  }

  const content = await FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.UTF8
  });

  return {
    id: SUBJECT_ID,
    title: '애국가',
    fileName: NATION_SONG_FILENAME,
    path,
    content
  };
};

export const fileSubjectRepository: SubjectPort = {
  async ensureSeed() {
    const nationSong = await ensureNationSongSubject();
    return [nationSong];
  },
  async getById(id) {
    if (id !== SUBJECT_ID) {
      return null;
    }
    return ensureNationSongSubject();
  }
};
