import { describe, expect, it } from 'vitest';
import { LectureService } from './lecture.service';

describe('temp-study flow', () => {
  it('registers temp-study and exposes it in main and detail queries', () => {
    const service = new LectureService();

    const created = service.registerTempStudy({
      id: 'temp-study',
      title: 'Temp Study Course',
      intro: '테스트 강의 소개',
      detail: '테스트 강의 상세',
      category: '개발',
      price: 1000,
      lectureTitles: ['테스트 강의 1', '테스트 강의 2']
    });

    expect(created.id).toBe('temp-study');

    const main = service.getMainCourses(20);
    expect(main.edges.some((edge) => edge.node.id === 'temp-study')).toBe(true);

    const detail = service.getCourseDetail('temp-study');
    expect(detail?.title).toBe('Temp Study Course');
    expect(detail?.lectures.length).toBeGreaterThanOrEqual(2);
  });

  it('does not duplicate course when re-registering the same id', () => {
    const service = new LectureService();

    service.registerTempStudy({
      id: 'temp-study',
      title: 'Temp Study Course',
      intro: '테스트 강의 소개',
      detail: '테스트 강의 상세',
      category: '개발',
      price: 1000,
      lectureTitles: ['중복 테스트 강의']
    });

    const all = service.getMainCourses(100).edges.filter((edge) => edge.node.id === 'temp-study');
    expect(all).toHaveLength(1);
  });
});
