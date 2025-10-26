import type { SupabaseClient } from "@supabase/supabase-js"
import * as Effect from "effect/Effect"

type OrderConfig<Row> = {
  column: keyof Row & string
  ascending?: boolean
}

export type SupabaseCrudConfig<Row, Domain, Create, Id> = {
  table: string
  select: string
  idColumn: keyof Row & string
  decode: (row: Row) => Domain
  decodeMany?: (rows: ReadonlyArray<Row>) => ReadonlyArray<Domain>
  encodeCreate: (input: Create, ctx: { now: Date }) => Record<string, unknown>
  orderBy?: OrderConfig<Row>
  toQueryId?: (id: Id) => string | number
}

type CrudMethods<Domain, Create, Id> = {
  getById: (id: Id) => Effect.Effect<Domain | null, unknown, never>
  list: () => Effect.Effect<ReadonlyArray<Domain>, unknown, never>
  create: (input: Create) => Effect.Effect<Domain, unknown, never>
}

export const createSupabaseCrudRepository = <Row extends Record<string, any>, Domain, Create, Id>(
  client: SupabaseClient,
  config: SupabaseCrudConfig<Row, Domain, Create, Id>
): CrudMethods<Domain, Create, Id> => {
  const decodeMany = config.decodeMany ?? ((rows: ReadonlyArray<Row>) => rows.map(config.decode))
  const mapRow = (row: unknown): Domain => config.decode(row as Row)
  const mapRows = (rows: unknown[]): ReadonlyArray<Domain> => decodeMany(rows as Row[])
  const toId = config.toQueryId ?? ((value: Id) => value as unknown as string | number)

  return {
    getById: (id) =>
      Effect.tryPromise({
        try: async () => {
          const query = client
            .from(config.table)
            .select(config.select)
            .eq(config.idColumn, toId(id) as any)
            .maybeSingle()

          const { data, error } = await query
          if (error) {
            throw error
          }

          if (!data) {
            return null
          }

          return mapRow(data)
        },
        catch: (cause: unknown) => cause
      }),

    list: () =>
      Effect.tryPromise({
        try: async () => {
          let query = client.from(config.table).select(config.select)

          if (config.orderBy) {
            query = query.order(config.orderBy.column, {
              ascending: config.orderBy.ascending ?? true
            })
          }

          const { data, error } = await query
          if (error) {
            throw error
          }

          if (!data) {
            return []
          }

          return mapRows(data)
        },
        catch: (cause: unknown) => cause
      }),

    create: (input) =>
      Effect.tryPromise({
        try: async () => {
          const now = new Date()
          const insertPayload = config.encodeCreate(input, { now })

          const { data, error } = await client
            .from(config.table)
            .insert(insertPayload)
            .select(config.select)
            .single()

          if (error) {
            throw error
          }

          return mapRow(data)
        },
        catch: (cause: unknown) => cause
      })
  }
}
