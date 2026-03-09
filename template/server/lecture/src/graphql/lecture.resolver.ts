import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CourseConnection, CourseNode } from '../common/relay';
import { LectureService } from './lecture.service';
import { CourseDetailType, TempStudyInput, UserPageType } from './lecture.types';

@Resolver()
export class LectureResolver {
  constructor(private readonly lectureService: LectureService) {}

  @Mutation(() => CourseNode)
  registerTempStudy(@Args('input', { type: () => TempStudyInput }) input: TempStudyInput) {
    return this.lectureService.registerTempStudy(input);
  }

  @Query(() => CourseConnection)
  mainCourses(
    @Args('first', { type: () => Int, defaultValue: 10 }) first: number,
    @Args('after', { type: () => String, nullable: true }) after?: string
  ) {
    return this.lectureService.getMainCourses(first, after);
  }

  @Query(() => CourseNode, { nullable: true })
  introCourse(@Args('id', { type: () => ID }) id: string) {
    return this.lectureService.getCourseIntro(id);
  }

  @Query(() => CourseDetailType, { nullable: true })
  detailCourse(@Args('id', { type: () => ID }) id: string) {
    return this.lectureService.getCourseDetail(id);
  }

  @Query(() => UserPageType, { nullable: true })
  userPage(@Args('userId', { type: () => ID, defaultValue: 'u1' }) userId: string) {
    return this.lectureService.getUserPage(userId);
  }
}
