import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CourseNode } from '../common/relay';

@ObjectType()
export class ReviewType {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  rating!: number;

  @Field()
  content!: string;
}

@ObjectType()
export class LectureType {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field(() => Int)
  durationSec!: number;
}

@ObjectType()
export class CourseDetailType extends CourseNode {
  @Field()
  detail!: string;

  @Field(() => [LectureType])
  lectures!: LectureType[];

  @Field(() => [ReviewType])
  reviews!: ReviewType[];
}

@ObjectType()
export class UserType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;
}

@ObjectType()
export class EnrollmentType {
  @Field(() => ID)
  id!: string;

  @Field()
  courseId!: string;

  @Field()
  status!: string;
}

@ObjectType()
export class ProgressType {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  percent!: number;
}

@ObjectType()
export class CertificateType {
  @Field(() => ID)
  id!: string;

  @Field()
  verifyUrl!: string;
}

@ObjectType()
export class NotificationType {
  @Field(() => ID)
  id!: string;

  @Field()
  message!: string;
}

@ObjectType()
export class UserPageType {
  @Field(() => UserType)
  user!: UserType;

  @Field(() => [EnrollmentType])
  enrollments!: EnrollmentType[];

  @Field(() => [ProgressType])
  progresses!: ProgressType[];

  @Field(() => [CertificateType])
  certifications!: CertificateType[];

  @Field(() => [NotificationType])
  notifications!: NotificationType[];
}

@InputType()
export class TempStudyInput {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  intro!: string;

  @Field()
  detail!: string;

  @Field()
  category!: string;

  @Field(() => Int)
  price!: number;

  @Field(() => [String])
  lectureTitles!: string[];
}
