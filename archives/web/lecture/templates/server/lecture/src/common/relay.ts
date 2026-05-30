import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage!: boolean;

  @Field(() => String, { nullable: true })
  endCursor!: string | null;
}

@ObjectType()
export class CourseNode {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  intro!: string;

  @Field()
  category!: string;

  @Field(() => Int)
  price!: number;
}

@ObjectType()
export class CourseEdge {
  @Field()
  cursor!: string;

  @Field(() => CourseNode)
  node!: CourseNode;
}

@ObjectType()
export class CourseConnection {
  @Field(() => [CourseEdge])
  edges!: CourseEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field(() => Int)
  totalCount!: number;
}

export const encodeCursor = (index: number) => Buffer.from(`course:${index}`).toString('base64');
export const decodeCursor = (cursor?: string | null) => {
  if (!cursor) return -1;
  const raw = Buffer.from(cursor, 'base64').toString('utf8');
  const parts = raw.split(':');
  return Number(parts[1] ?? -1);
};
