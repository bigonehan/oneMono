import { Injectable } from '@nestjs/common';
import { reviews } from '@domains/review';
import { users } from '@domains/user';
import { courses, upsertCourse } from '@domains/study/course';
import { lectures } from '@domains/study/lecture';
import { enrollments } from '@domains/study/enrollment';
import { progresses } from '@domains/study/progress';
import { certifications } from '@domains/study/certification';
import { notifications } from '@domains/study/notification';
import { coupons } from '@domains/study/coupon';
import { cartItems } from '@domains/study/cart';
import { categories } from '@domains/study/category';
import { CourseConnection, CourseNode, decodeCursor, encodeCursor } from '../common/relay';
import { TempStudyInput } from './lecture.types';

@Injectable()
export class LectureService {
  registerTempStudy(input: TempStudyInput): CourseNode {
    const course = upsertCourse({
      id: input.id,
      title: input.title,
      intro: input.intro,
      detail: input.detail,
      category: input.category,
      price: input.price
    });

    const baseIndex = lectures.filter((item) => item.courseId === input.id).length;
    input.lectureTitles.forEach((title, index) => {
      const lectureId = `${input.id}-l${index + 1}`;
      if (!lectures.find((item) => item.id === lectureId)) {
        lectures.push({
          id: lectureId,
          courseId: input.id,
          title,
          durationSec: 900 + (baseIndex + index) * 120
        });
      }
    });

    return { ...course };
  }

  getMainCourses(first: number, after?: string | null): CourseConnection {
    const start = decodeCursor(after) + 1;
    const slice = courses.slice(start, start + first);
    const edges = slice.map((course, idx) => ({
      node: { ...course } as CourseNode,
      cursor: encodeCursor(start + idx)
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: start + first < courses.length,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null
      },
      totalCount: courses.length
    };
  }

  getCourseIntro(id: string) {
    return courses.find((course) => course.id === id) ?? null;
  }

  getCourseDetail(id: string) {
    const course = courses.find((item) => item.id === id);
    if (!course) return null;
    return {
      ...course,
      lectures: lectures.filter((lecture) => lecture.courseId === id),
      reviews: reviews.filter((review) => review.courseId === id)
    };
  }

  getUserPage(userId: string) {
    const user = users.find((item) => item.id === userId);
    if (!user) return null;

    const ownedEnrollments = enrollments.filter((item) => item.userId === userId);
    const enrollmentIds = ownedEnrollments.map((item) => item.id);

    return {
      user,
      enrollments: ownedEnrollments,
      progresses: progresses.filter((item) => enrollmentIds.includes(item.enrollmentId)),
      certifications: certifications.filter((item) => item.userId === userId),
      notifications: notifications.filter((item) => item.userId === userId),
      cart: cartItems.filter((item) => item.userId === userId),
      coupons,
      categories
    };
  }
}
