import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'gel';

@Injectable()
export class GelService implements OnModuleInit, OnModuleDestroy {
  private readonly client = createClient({
    instanceName: process.env.GEL_INSTANCE ?? 'lecture-backend'
  });

  async onModuleInit() {
    await this.client.ensureConnected();
    await this.load_seed_data();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  get_client() {
    return this.client;
  }

  async get_json_many<T>(query: string, args: Record<string, unknown> = {}) {
    const raw = Object.keys(args).length
      ? await this.client.queryJSON(query, args)
      : await this.client.queryJSON(query);
    return JSON.parse(raw) as T[];
  }

  async get_json_single<T>(query: string, args: Record<string, unknown> = {}) {
    const raw = Object.keys(args).length
      ? await this.client.querySingleJSON(query, args)
      : await this.client.querySingleJSON(query);
    return raw === 'null' ? null : (JSON.parse(raw) as T);
  }

  private async load_seed_data() {
    const user_count = await this.client.queryRequiredSingle<number>('with module default select count(User)');
    if (user_count > 0) {
      return;
    }

    await this.client.transaction(async (tx) => {
      await tx.execute(`
        with module default
        insert User {
          code := 'u1',
          name := 'Lee Student',
          email := 'student@lecture.dev',
          role := UserRole.student
        };

        with module default
        insert User {
          code := 'u2',
          name := 'Kim Instructor',
          email := 'instructor@lecture.dev',
          role := UserRole.instructor
        };

        with module default
        insert User {
          code := 'u3',
          name := 'Park Admin',
          email := 'admin@lecture.dev',
          role := UserRole.admin
        };

        with module default
        insert Category {
          code := 'cat-dev',
          name := '개발'
        };

        with module default
        insert Category {
          code := 'cat-design',
          name := '디자인'
        };

        with module default,
          category := assert_single((select Category filter .code = 'cat-dev')),
          instructor := assert_single((select User filter .code = 'u2'))
        insert Course {
          slug := 'c1',
          title := 'NestJS GraphQL 실전',
          intro := 'NestJS로 GraphQL API를 구축합니다.',
          detail := 'Relay pagination, 인증, 도메인 분리까지 실습합니다.',
          price := 99000,
          status := CourseStatus.published,
          category := category,
          instructor := instructor
        };

        with module default,
          category := assert_single((select Category filter .code = 'cat-dev')),
          instructor := assert_single((select User filter .code = 'u2'))
        insert Course {
          slug := 'c2',
          title := 'Astro 강의 사이트 제작',
          intro := 'Astro 기반 SSR 페이지를 구성합니다.',
          detail := '메인/인트로/디테일/유저 페이지와 API 연동을 구현합니다.',
          price := 79000,
          status := CourseStatus.published,
          category := category,
          instructor := instructor
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c1'))
        insert Lecture {
          code := 'l1',
          title := 'Relay 기본 구조',
          duration_sec := 1200,
          sort_order := 1,
          status := LectureStatus.published,
          course := course
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c1'))
        insert Lecture {
          code := 'l2',
          title := 'Cursor Pagination',
          duration_sec := 1500,
          sort_order := 2,
          status := LectureStatus.published,
          course := course
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c2'))
        insert Lecture {
          code := 'l3',
          title := 'Astro SSR',
          duration_sec := 1100,
          sort_order := 1,
          status := LectureStatus.published,
          course := course
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c1')),
          user := assert_single((select User filter .code = 'u1'))
        insert Review {
          code := 'r1',
          rating := 5,
          content := '실전 예제가 좋아서 끝까지 수강했습니다.',
          course := course,
          user := user
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c2')),
          user := assert_single((select User filter .code = 'u1'))
        insert Review {
          code := 'r2',
          rating := 4,
          content := '기초 개념을 빠르게 정리하기 좋습니다.',
          course := course,
          user := user
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c1')),
          user := assert_single((select User filter .code = 'u1'))
        insert Enrollment {
          code := 'e1',
          status := EnrollmentStatus.active,
          course := course,
          user := user
        };

        with module default,
          course := assert_single((select Course filter .slug = 'c2')),
          user := assert_single((select User filter .code = 'u1'))
        insert Enrollment {
          code := 'e2',
          status := EnrollmentStatus.completed,
          course := course,
          user := user
        };

        with module default,
          enrollment := assert_single((select Enrollment filter .code = 'e1')),
          lecture := assert_single((select Lecture filter .code = 'l1'))
        insert Progress {
          code := 'p1',
          percent := 45,
          enrollment := enrollment,
          lecture := lecture
        };

        with module default,
          enrollment := assert_single((select Enrollment filter .code = 'e2')),
          lecture := assert_single((select Lecture filter .code = 'l3'))
        insert Progress {
          code := 'p2',
          percent := 100,
          enrollment := enrollment,
          lecture := lecture
        };

        with module default
        insert Coupon {
          code := 'WELCOME10',
          discount_percent := 10,
          is_active := true
        };

        with module default,
          user := assert_single((select User filter .code = 'u1')),
          course := assert_single((select Course filter .slug = 'c1')),
          coupon := assert_single((select Coupon filter .code = 'WELCOME10'))
        insert Cart {
          code := 'cart1',
          user := user,
          courses := {course},
          coupon := coupon
        };

        with module default,
          user := assert_single((select User filter .code = 'u1')),
          course := assert_single((select Course filter .slug = 'c2'))
        insert Certification {
          code := 'cert1',
          verify_url := '/verify/uuid-cert1',
          user := user,
          course := course
        };

        with module default,
          user := assert_single((select User filter .code = 'u1'))
        insert Notification {
          code := 'n1',
          message := '새 강의 업데이트가 등록되었습니다.',
          user := user
        };
      `);
    });
  }
}
