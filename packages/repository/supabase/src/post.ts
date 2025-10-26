import type { SupabaseClient } from "@supabase/supabase-js"

import type { CreatePost, Post, PostId } from "@domains/post"
import { decodePost, decodePosts } from "@domains/post"
import type { PostRepository } from "@domains/post/ports"

import { createSupabaseCrudRepository } from "./crud"

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string
  user_id: string
  user_name: string
}

const selectColumns = "id, title, body, created_at, user_id, user_name" as const

const rowToDomain = (row: PostRow): Post =>
  decodePost({
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    user: {
      id: row.user_id,
      name: row.user_name
    }
  })

const rowsToDomain = (rows: ReadonlyArray<PostRow>) =>
  decodePosts(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      createdAt: row.created_at,
      user: {
        id: row.user_id,
        name: row.user_name
      }
    }))
  )

export const createSupabasePostRepository = (
  client: SupabaseClient
): PostRepository =>
  createSupabaseCrudRepository<PostRow, Post, CreatePost, PostId>(client, {
    table: "posts",
    select: selectColumns,
    idColumn: "id",
    decode: rowToDomain,
    decodeMany: rowsToDomain,
    orderBy: {
      column: "created_at",
      ascending: false
    },
    encodeCreate: (input, { now }) => ({
      title: input.title,
      body: input.body,
      created_at: now.toISOString(),
      user_id: input.user.id,
      user_name: input.user.name
    }),
    toQueryId: (id) => id
  })
