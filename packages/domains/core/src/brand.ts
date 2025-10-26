import * as Brand from "effect/Brand"

/**
 * Convenience alias for branded string identifiers.
 */
export type StringId<Name extends string> = string & Brand.Brand<Name>

/**
 * Factory to create a nominal brand constructor without additional runtime validation.
 */
export const makeStringId = <Name extends string>() =>
  Brand.nominal<StringId<Name>>()
