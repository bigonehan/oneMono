import { Injectable } from '@nestjs/common';
import { GelService } from '../db/gel.service';
import { CourseConnection, CourseNode, decodeCursor, encodeCursor } from '../common/relay';
import { TempStudyInput } from './lecture.types';

type CourseRow = {
  slug: string;
  title: string;
  intro: string;
  detail?: string;
  price: number;
  category: { name: string };
};

type LectureRow = {
  code: string;
  title: string;
  duration_sec: number;
};

type ReviewRow = {
  code: string;
  rating: number;
  content: string;
};

type EnrollmentRow = {
  code: string;
  status: string;
  course: { slug: string };
};

type ProgressRow = {
  code: string;
  percent: number;
};

type CertificationRow = {
  code: string;
  verify_url: string;
};

type NotificationRow = {
  code: string;
  message: string;
};

type UserRow = {
  code: string;
  name: string;
  email: string;
  role: string;
};

@Injectable()
export class LectureService {
  constructor(private readonly gel_service: GelService) {}

  async registerTempStudy(input: TempStudyInput): Promise<CourseNode> {
    const category_code = `category-${input.id}`;
    const client = this.gel_service.get_client();

    await client.transaction(async (tx) => {
      const has_category = await tx.queryRequiredSingle<boolean>(
        `
          with module default
          select exists(
            select Category
            filter .code = <str>$category_code
          )
        `,
        { category_code }
      );

      if (has_category) {
        await tx.execute(
          `
            with module default
            update Category
            filter .code = <str>$category_code
            set {
              name := <str>$category_name
            }
          `,
          {
            category_code,
            category_name: input.category
          }
        );
      } else {
        await tx.execute(
          `
            with module default
            insert Category {
              code := <str>$category_code,
              name := <str>$category_name
            }
          `,
          {
            category_code,
            category_name: input.category
          }
        );
      }

      const has_course = await tx.queryRequiredSingle<boolean>(
        `
          with module default
          select exists(
            select Course
            filter .slug = <str>$slug
          )
        `,
        { slug: input.id }
      );

      if (has_course) {
        await tx.execute(
          `
            with
              module default,
              category := assert_single((select Category filter .code = <str>$category_code)),
              instructor := assert_single((select User filter .code = 'u2'))
            update Course
            filter .slug = <str>$slug
            set {
              title := <str>$title,
              intro := <str>$intro,
              detail := <str>$detail,
              price := <int64>$price,
              status := <CourseStatus>'published',
              category := category,
              instructor := instructor
            }
          `,
          {
            category_code,
            slug: input.id,
            title: input.title,
            intro: input.intro,
            detail: input.detail,
            price: input.price
          }
        );
      } else {
        await tx.execute(
          `
            with
              module default,
              category := assert_single((select Category filter .code = <str>$category_code)),
              instructor := assert_single((select User filter .code = 'u2'))
            insert Course {
              slug := <str>$slug,
              title := <str>$title,
              intro := <str>$intro,
              detail := <str>$detail,
              price := <int64>$price,
              status := <CourseStatus>'published',
              category := category,
              instructor := instructor
            }
          `,
          {
            category_code,
            slug: input.id,
            title: input.title,
            intro: input.intro,
            detail: input.detail,
            price: input.price
          }
        );
      }

      await tx.execute(
        `
          with module default
          delete Lecture
          filter .course.slug = <str>$slug
        `,
        { slug: input.id }
      );

      for (const [index, title] of input.lectureTitles.entries()) {
        await tx.execute(
          `
            with
              module default,
              course := assert_single((select Course filter .slug = <str>$slug))
            insert Lecture {
              code := <str>$code,
              title := <str>$title,
              duration_sec := <int64>$duration_sec,
              sort_order := <int16>$sort_order,
              status := <LectureStatus>'published',
              course := course
            }
          `,
          {
            slug: input.id,
            code: `${input.id}-l${index + 1}`,
            title,
            duration_sec: 900 + index * 120,
            sort_order: index + 1
          }
        );
      }
    });

    const course = await this.getCourseIntro(input.id);
    if (!course) {
      throw new Error('Course registration failed');
    }
    return course;
  }

  async getMainCourses(first: number, after?: string | null): Promise<CourseConnection> {
    const rows = await this.gel_service.get_json_many<CourseRow>(
      `
        with module default
        select Course {
          slug,
          title,
          intro,
          price,
          category: {
            name
          }
        }
        filter .status = <CourseStatus>'published'
        order by .slug
      `
    );

    const start = decodeCursor(after) + 1;
    const slice = rows.slice(start, start + first);
    const edges = slice.map((course, index) => ({
      node: this.get_course_node(course),
      cursor: encodeCursor(start + index)
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: start + first < rows.length,
        endCursor: edges.length ? edges[edges.length - 1].cursor : null
      },
      totalCount: rows.length
    };
  }

  async getCourseIntro(id: string): Promise<CourseNode | null> {
    const row = await this.gel_service.get_json_single<CourseRow>(
      `
        with module default
        select Course {
          slug,
          title,
          intro,
          price,
          category: {
            name
          }
        }
        filter .slug = <str>$slug
      `,
      { slug: id }
    );

    return row ? this.get_course_node(row) : null;
  }

  async getCourseDetail(id: string) {
    const course = await this.gel_service.get_json_single<CourseRow>(
      `
        with module default
        select Course {
          slug,
          title,
          intro,
          detail,
          price,
          category: {
            name
          }
        }
        filter .slug = <str>$slug
      `,
      { slug: id }
    );

    if (!course) {
      return null;
    }

    const lectures = await this.gel_service.get_json_many<LectureRow>(
      `
        with module default
        select Lecture {
          code,
          title,
          duration_sec
        }
        filter .course.slug = <str>$slug
        order by .sort_order
      `,
      { slug: id }
    );

    const reviews = await this.gel_service.get_json_many<ReviewRow>(
      `
        with module default
        select Review {
          code,
          rating,
          content
        }
        filter .course.slug = <str>$slug
        order by .code
      `,
      { slug: id }
    );

    return {
      ...this.get_course_node(course),
      detail: course.detail ?? '',
      lectures: lectures.map((lecture) => ({
        id: lecture.code,
        title: lecture.title,
        durationSec: lecture.duration_sec
      })),
      reviews: reviews.map((review) => ({
        id: review.code,
        rating: review.rating,
        content: review.content
      }))
    };
  }

  async getUserPage(userId: string) {
    const user = await this.gel_service.get_json_single<UserRow>(
      `
        with module default
        select User {
          code,
          name,
          email,
          role
        }
        filter .code = <str>$code
      `,
      { code: userId }
    );

    if (!user) {
      return null;
    }

    const enrollments = await this.gel_service.get_json_many<EnrollmentRow>(
      `
        with module default
        select Enrollment {
          code,
          status,
          course: {
            slug
          }
        }
        filter .user.code = <str>$code
        order by .code
      `,
      { code: userId }
    );

    const progresses = await this.gel_service.get_json_many<ProgressRow>(
      `
        with module default
        select Progress {
          code,
          percent
        }
        filter .enrollment.user.code = <str>$code
        order by .code
      `,
      { code: userId }
    );

    const certifications = await this.gel_service.get_json_many<CertificationRow>(
      `
        with module default
        select Certification {
          code,
          verify_url
        }
        filter .user.code = <str>$code
        order by .code
      `,
      { code: userId }
    );

    const notifications = await this.gel_service.get_json_many<NotificationRow>(
      `
        with module default
        select Notification {
          code,
          message
        }
        filter .user.code = <str>$code
        order by .code
      `,
      { code: userId }
    );

    return {
      user: {
        id: user.code,
        name: user.name,
        email: user.email,
        role: user.role
      },
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment.code,
        courseId: enrollment.course.slug,
        status: enrollment.status
      })),
      progresses: progresses.map((progress) => ({
        id: progress.code,
        percent: progress.percent
      })),
      certifications: certifications.map((certification) => ({
        id: certification.code,
        verifyUrl: certification.verify_url
      })),
      notifications: notifications.map((notification) => ({
        id: notification.code,
        message: notification.message
      }))
    };
  }

  private get_course_node(course: CourseRow): CourseNode {
    return {
      id: course.slug,
      title: course.title,
      intro: course.intro,
      category: course.category.name,
      price: course.price
    };
  }
}
