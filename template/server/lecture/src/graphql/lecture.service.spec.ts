import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { GelService } from '../db/gel.service';
import { LectureService } from './lecture.service';

describe('temp-study flow', () => {
  const gel_service = new GelService();
  const lecture_service = new LectureService(gel_service);

  beforeAll(async () => {
    await gel_service.onModuleInit();
  });

  afterAll(async () => {
    await gel_service.onModuleDestroy();
  });

  it('registers temp-study and exposes it in main and detail queries', async () => {
    const created = await lecture_service.registerTempStudy({
      id: 'temp-study',
      title: 'Temp Study Course',
      intro: '테스트 강의 소개',
      detail: '테스트 강의 상세',
      category: '개발',
      price: 1000,
      lectureTitles: ['테스트 강의 1', '테스트 강의 2']
    });

    expect(created.id).toBe('temp-study');

    const main = await lecture_service.getMainCourses(20);
    expect(main.edges.some((edge) => edge.node.id === 'temp-study')).toBe(true);

    const detail = await lecture_service.getCourseDetail('temp-study');
    expect(detail?.title).toBe('Temp Study Course');
    expect(detail?.lectures.length).toBeGreaterThanOrEqual(2);
  });

  it('does not duplicate course when re-registering the same id', async () => {
    await lecture_service.registerTempStudy({
      id: 'temp-study',
      title: 'Temp Study Course',
      intro: '테스트 강의 소개',
      detail: '테스트 강의 상세',
      category: '개발',
      price: 1000,
      lectureTitles: ['중복 테스트 강의']
    });

    const all = (await lecture_service.getMainCourses(100)).edges.filter((edge) => edge.node.id === 'temp-study');
    expect(all).toHaveLength(1);

    const detail = await lecture_service.getCourseDetail('temp-study');
    expect(detail?.lectures).toHaveLength(1);
  });
});
