
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model TCOMPETITORS
 * 
 */
export type TCOMPETITORS = {
  C_IDX: number
  C_NUM: number | null
  C_TRANSPONDER1: string | null
  C_TRANSPONDER2: string | null
  C_LAST_NAME: string | null
  C_FIRST_NAME: string | null
  C_CODE: string | null
  C_SEX: number | null
  C_YEAR: number | null
  C_CATEGORY: string | null
  C_SERIE: string | null
  C_NATION: string | null
  C_COMMITTEE: string | null
  C_CLUB: string | null
  C_TEAM: string | null
  C_I15: number | null
  C_I16: number | null
  C_I17: string | null
  C_I18: string | null
  C_I19: number | null
  C_I20: number | null
  C_I21: number | null
  C_I22: number | null
  C_I23: number | null
  C_I24: number | null
  C_I25: number | null
  C_I26: number | null
  C_I27: string | null
  C_I28: string | null
  C_I29: string | null
  C_I30: string | null
  C_I31: string | null
  C_I32: string | null
  C_I33: string | null
  C_I34: string | null
  C_I35: string | null
  C_I36: string | null
  C_I37: string | null
}

/**
 * Model TEDITINGFORMATS
 * 
 */
export type TEDITINGFORMATS = {
  C_NUMEDIT: number
  C_PARAM: string
  C_VALUE: string | null
}

/**
 * Model TEDITINGPARAMETERS
 * 
 */
export type TEDITINGPARAMETERS = {
  C_PARAM: string
  C_VALUE: string | null
}

/**
 * Model TKEYVALUES
 * 
 */
export type TKEYVALUES = {
  TABLENAME: string
  KEYVALUE: number
}

/**
 * Model TPARAMETERS
 * 
 */
export type TPARAMETERS = {
  C_PARAM: string
  C_VALUE: string | null
}

/**
 * Model TPARAMETERS_HEAT
 * 
 */
export type TPARAMETERS_HEAT = {
  C_PARAM: string
  C_VALUE: string | null
}

/**
 * Model TUPDATEVALUES
 * 
 */
export type TUPDATEVALUES = {
  TABLENAME: string
  UPDATEVALUE: number
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more TCOMPETITORS
 * const tCOMPETITORS = await prisma.tCOMPETITORS.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more TCOMPETITORS
   * const tCOMPETITORS = await prisma.tCOMPETITORS.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;

      /**
   * `prisma.tCOMPETITORS`: Exposes CRUD operations for the **TCOMPETITORS** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TCOMPETITORS
    * const tCOMPETITORS = await prisma.tCOMPETITORS.findMany()
    * ```
    */
  get tCOMPETITORS(): Prisma.TCOMPETITORSDelegate<GlobalReject>;

  /**
   * `prisma.tEDITINGFORMATS`: Exposes CRUD operations for the **TEDITINGFORMATS** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TEDITINGFORMATS
    * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.findMany()
    * ```
    */
  get tEDITINGFORMATS(): Prisma.TEDITINGFORMATSDelegate<GlobalReject>;

  /**
   * `prisma.tEDITINGPARAMETERS`: Exposes CRUD operations for the **TEDITINGPARAMETERS** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TEDITINGPARAMETERS
    * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.findMany()
    * ```
    */
  get tEDITINGPARAMETERS(): Prisma.TEDITINGPARAMETERSDelegate<GlobalReject>;

  /**
   * `prisma.tKEYVALUES`: Exposes CRUD operations for the **TKEYVALUES** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TKEYVALUES
    * const tKEYVALUES = await prisma.tKEYVALUES.findMany()
    * ```
    */
  get tKEYVALUES(): Prisma.TKEYVALUESDelegate<GlobalReject>;

  /**
   * `prisma.tPARAMETERS`: Exposes CRUD operations for the **TPARAMETERS** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TPARAMETERS
    * const tPARAMETERS = await prisma.tPARAMETERS.findMany()
    * ```
    */
  get tPARAMETERS(): Prisma.TPARAMETERSDelegate<GlobalReject>;

  /**
   * `prisma.tPARAMETERS_HEAT`: Exposes CRUD operations for the **TPARAMETERS_HEAT** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TPARAMETERS_HEATS
    * const tPARAMETERS_HEATS = await prisma.tPARAMETERS_HEAT.findMany()
    * ```
    */
  get tPARAMETERS_HEAT(): Prisma.TPARAMETERS_HEATDelegate<GlobalReject>;

  /**
   * `prisma.tUPDATEVALUES`: Exposes CRUD operations for the **TUPDATEVALUES** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TUPDATEVALUES
    * const tUPDATEVALUES = await prisma.tUPDATEVALUES.findMany()
    * ```
    */
  get tUPDATEVALUES(): Prisma.TUPDATEVALUESDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Prisma Client JS version: 3.15.2
   * Query Engine version: 461d6a05159055555eb7dfb337c9fb271cbd4d7e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: 'DbNull'

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: 'JsonNull'

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: 'AnyNull'

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Buffer
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    TCOMPETITORS: 'TCOMPETITORS',
    TEDITINGFORMATS: 'TEDITINGFORMATS',
    TEDITINGPARAMETERS: 'TEDITINGPARAMETERS',
    TKEYVALUES: 'TKEYVALUES',
    TPARAMETERS: 'TPARAMETERS',
    TPARAMETERS_HEAT: 'TPARAMETERS_HEAT',
    TUPDATEVALUES: 'TUPDATEVALUES'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model TCOMPETITORS
   */


  export type AggregateTCOMPETITORS = {
    _count: TCOMPETITORSCountAggregateOutputType | null
    _avg: TCOMPETITORSAvgAggregateOutputType | null
    _sum: TCOMPETITORSSumAggregateOutputType | null
    _min: TCOMPETITORSMinAggregateOutputType | null
    _max: TCOMPETITORSMaxAggregateOutputType | null
  }

  export type TCOMPETITORSAvgAggregateOutputType = {
    C_IDX: number | null
    C_NUM: number | null
    C_SEX: number | null
    C_YEAR: number | null
    C_I15: number | null
    C_I16: number | null
    C_I19: number | null
    C_I20: number | null
    C_I21: number | null
    C_I22: number | null
    C_I23: number | null
    C_I24: number | null
    C_I25: number | null
    C_I26: number | null
  }

  export type TCOMPETITORSSumAggregateOutputType = {
    C_IDX: number | null
    C_NUM: number | null
    C_SEX: number | null
    C_YEAR: number | null
    C_I15: number | null
    C_I16: number | null
    C_I19: number | null
    C_I20: number | null
    C_I21: number | null
    C_I22: number | null
    C_I23: number | null
    C_I24: number | null
    C_I25: number | null
    C_I26: number | null
  }

  export type TCOMPETITORSMinAggregateOutputType = {
    C_IDX: number | null
    C_NUM: number | null
    C_TRANSPONDER1: string | null
    C_TRANSPONDER2: string | null
    C_LAST_NAME: string | null
    C_FIRST_NAME: string | null
    C_CODE: string | null
    C_SEX: number | null
    C_YEAR: number | null
    C_CATEGORY: string | null
    C_SERIE: string | null
    C_NATION: string | null
    C_COMMITTEE: string | null
    C_CLUB: string | null
    C_TEAM: string | null
    C_I15: number | null
    C_I16: number | null
    C_I17: string | null
    C_I18: string | null
    C_I19: number | null
    C_I20: number | null
    C_I21: number | null
    C_I22: number | null
    C_I23: number | null
    C_I24: number | null
    C_I25: number | null
    C_I26: number | null
    C_I27: string | null
    C_I28: string | null
    C_I29: string | null
    C_I30: string | null
    C_I31: string | null
    C_I32: string | null
    C_I33: string | null
    C_I34: string | null
    C_I35: string | null
    C_I36: string | null
    C_I37: string | null
  }

  export type TCOMPETITORSMaxAggregateOutputType = {
    C_IDX: number | null
    C_NUM: number | null
    C_TRANSPONDER1: string | null
    C_TRANSPONDER2: string | null
    C_LAST_NAME: string | null
    C_FIRST_NAME: string | null
    C_CODE: string | null
    C_SEX: number | null
    C_YEAR: number | null
    C_CATEGORY: string | null
    C_SERIE: string | null
    C_NATION: string | null
    C_COMMITTEE: string | null
    C_CLUB: string | null
    C_TEAM: string | null
    C_I15: number | null
    C_I16: number | null
    C_I17: string | null
    C_I18: string | null
    C_I19: number | null
    C_I20: number | null
    C_I21: number | null
    C_I22: number | null
    C_I23: number | null
    C_I24: number | null
    C_I25: number | null
    C_I26: number | null
    C_I27: string | null
    C_I28: string | null
    C_I29: string | null
    C_I30: string | null
    C_I31: string | null
    C_I32: string | null
    C_I33: string | null
    C_I34: string | null
    C_I35: string | null
    C_I36: string | null
    C_I37: string | null
  }

  export type TCOMPETITORSCountAggregateOutputType = {
    C_IDX: number
    C_NUM: number
    C_TRANSPONDER1: number
    C_TRANSPONDER2: number
    C_LAST_NAME: number
    C_FIRST_NAME: number
    C_CODE: number
    C_SEX: number
    C_YEAR: number
    C_CATEGORY: number
    C_SERIE: number
    C_NATION: number
    C_COMMITTEE: number
    C_CLUB: number
    C_TEAM: number
    C_I15: number
    C_I16: number
    C_I17: number
    C_I18: number
    C_I19: number
    C_I20: number
    C_I21: number
    C_I22: number
    C_I23: number
    C_I24: number
    C_I25: number
    C_I26: number
    C_I27: number
    C_I28: number
    C_I29: number
    C_I30: number
    C_I31: number
    C_I32: number
    C_I33: number
    C_I34: number
    C_I35: number
    C_I36: number
    C_I37: number
    _all: number
  }


  export type TCOMPETITORSAvgAggregateInputType = {
    C_IDX?: true
    C_NUM?: true
    C_SEX?: true
    C_YEAR?: true
    C_I15?: true
    C_I16?: true
    C_I19?: true
    C_I20?: true
    C_I21?: true
    C_I22?: true
    C_I23?: true
    C_I24?: true
    C_I25?: true
    C_I26?: true
  }

  export type TCOMPETITORSSumAggregateInputType = {
    C_IDX?: true
    C_NUM?: true
    C_SEX?: true
    C_YEAR?: true
    C_I15?: true
    C_I16?: true
    C_I19?: true
    C_I20?: true
    C_I21?: true
    C_I22?: true
    C_I23?: true
    C_I24?: true
    C_I25?: true
    C_I26?: true
  }

  export type TCOMPETITORSMinAggregateInputType = {
    C_IDX?: true
    C_NUM?: true
    C_TRANSPONDER1?: true
    C_TRANSPONDER2?: true
    C_LAST_NAME?: true
    C_FIRST_NAME?: true
    C_CODE?: true
    C_SEX?: true
    C_YEAR?: true
    C_CATEGORY?: true
    C_SERIE?: true
    C_NATION?: true
    C_COMMITTEE?: true
    C_CLUB?: true
    C_TEAM?: true
    C_I15?: true
    C_I16?: true
    C_I17?: true
    C_I18?: true
    C_I19?: true
    C_I20?: true
    C_I21?: true
    C_I22?: true
    C_I23?: true
    C_I24?: true
    C_I25?: true
    C_I26?: true
    C_I27?: true
    C_I28?: true
    C_I29?: true
    C_I30?: true
    C_I31?: true
    C_I32?: true
    C_I33?: true
    C_I34?: true
    C_I35?: true
    C_I36?: true
    C_I37?: true
  }

  export type TCOMPETITORSMaxAggregateInputType = {
    C_IDX?: true
    C_NUM?: true
    C_TRANSPONDER1?: true
    C_TRANSPONDER2?: true
    C_LAST_NAME?: true
    C_FIRST_NAME?: true
    C_CODE?: true
    C_SEX?: true
    C_YEAR?: true
    C_CATEGORY?: true
    C_SERIE?: true
    C_NATION?: true
    C_COMMITTEE?: true
    C_CLUB?: true
    C_TEAM?: true
    C_I15?: true
    C_I16?: true
    C_I17?: true
    C_I18?: true
    C_I19?: true
    C_I20?: true
    C_I21?: true
    C_I22?: true
    C_I23?: true
    C_I24?: true
    C_I25?: true
    C_I26?: true
    C_I27?: true
    C_I28?: true
    C_I29?: true
    C_I30?: true
    C_I31?: true
    C_I32?: true
    C_I33?: true
    C_I34?: true
    C_I35?: true
    C_I36?: true
    C_I37?: true
  }

  export type TCOMPETITORSCountAggregateInputType = {
    C_IDX?: true
    C_NUM?: true
    C_TRANSPONDER1?: true
    C_TRANSPONDER2?: true
    C_LAST_NAME?: true
    C_FIRST_NAME?: true
    C_CODE?: true
    C_SEX?: true
    C_YEAR?: true
    C_CATEGORY?: true
    C_SERIE?: true
    C_NATION?: true
    C_COMMITTEE?: true
    C_CLUB?: true
    C_TEAM?: true
    C_I15?: true
    C_I16?: true
    C_I17?: true
    C_I18?: true
    C_I19?: true
    C_I20?: true
    C_I21?: true
    C_I22?: true
    C_I23?: true
    C_I24?: true
    C_I25?: true
    C_I26?: true
    C_I27?: true
    C_I28?: true
    C_I29?: true
    C_I30?: true
    C_I31?: true
    C_I32?: true
    C_I33?: true
    C_I34?: true
    C_I35?: true
    C_I36?: true
    C_I37?: true
    _all?: true
  }

  export type TCOMPETITORSAggregateArgs = {
    /**
     * Filter which TCOMPETITORS to aggregate.
     * 
    **/
    where?: TCOMPETITORSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TCOMPETITORS to fetch.
     * 
    **/
    orderBy?: Enumerable<TCOMPETITORSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TCOMPETITORSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TCOMPETITORS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TCOMPETITORS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TCOMPETITORS
    **/
    _count?: true | TCOMPETITORSCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TCOMPETITORSAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TCOMPETITORSSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TCOMPETITORSMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TCOMPETITORSMaxAggregateInputType
  }

  export type GetTCOMPETITORSAggregateType<T extends TCOMPETITORSAggregateArgs> = {
        [P in keyof T & keyof AggregateTCOMPETITORS]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTCOMPETITORS[P]>
      : GetScalarType<T[P], AggregateTCOMPETITORS[P]>
  }




  export type TCOMPETITORSGroupByArgs = {
    where?: TCOMPETITORSWhereInput
    orderBy?: Enumerable<TCOMPETITORSOrderByWithAggregationInput>
    by: Array<TCOMPETITORSScalarFieldEnum>
    having?: TCOMPETITORSScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TCOMPETITORSCountAggregateInputType | true
    _avg?: TCOMPETITORSAvgAggregateInputType
    _sum?: TCOMPETITORSSumAggregateInputType
    _min?: TCOMPETITORSMinAggregateInputType
    _max?: TCOMPETITORSMaxAggregateInputType
  }


  export type TCOMPETITORSGroupByOutputType = {
    C_IDX: number
    C_NUM: number | null
    C_TRANSPONDER1: string | null
    C_TRANSPONDER2: string | null
    C_LAST_NAME: string | null
    C_FIRST_NAME: string | null
    C_CODE: string | null
    C_SEX: number | null
    C_YEAR: number | null
    C_CATEGORY: string | null
    C_SERIE: string | null
    C_NATION: string | null
    C_COMMITTEE: string | null
    C_CLUB: string | null
    C_TEAM: string | null
    C_I15: number | null
    C_I16: number | null
    C_I17: string | null
    C_I18: string | null
    C_I19: number | null
    C_I20: number | null
    C_I21: number | null
    C_I22: number | null
    C_I23: number | null
    C_I24: number | null
    C_I25: number | null
    C_I26: number | null
    C_I27: string | null
    C_I28: string | null
    C_I29: string | null
    C_I30: string | null
    C_I31: string | null
    C_I32: string | null
    C_I33: string | null
    C_I34: string | null
    C_I35: string | null
    C_I36: string | null
    C_I37: string | null
    _count: TCOMPETITORSCountAggregateOutputType | null
    _avg: TCOMPETITORSAvgAggregateOutputType | null
    _sum: TCOMPETITORSSumAggregateOutputType | null
    _min: TCOMPETITORSMinAggregateOutputType | null
    _max: TCOMPETITORSMaxAggregateOutputType | null
  }

  type GetTCOMPETITORSGroupByPayload<T extends TCOMPETITORSGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TCOMPETITORSGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TCOMPETITORSGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TCOMPETITORSGroupByOutputType[P]>
            : GetScalarType<T[P], TCOMPETITORSGroupByOutputType[P]>
        }
      >
    >


  export type TCOMPETITORSSelect = {
    C_IDX?: boolean
    C_NUM?: boolean
    C_TRANSPONDER1?: boolean
    C_TRANSPONDER2?: boolean
    C_LAST_NAME?: boolean
    C_FIRST_NAME?: boolean
    C_CODE?: boolean
    C_SEX?: boolean
    C_YEAR?: boolean
    C_CATEGORY?: boolean
    C_SERIE?: boolean
    C_NATION?: boolean
    C_COMMITTEE?: boolean
    C_CLUB?: boolean
    C_TEAM?: boolean
    C_I15?: boolean
    C_I16?: boolean
    C_I17?: boolean
    C_I18?: boolean
    C_I19?: boolean
    C_I20?: boolean
    C_I21?: boolean
    C_I22?: boolean
    C_I23?: boolean
    C_I24?: boolean
    C_I25?: boolean
    C_I26?: boolean
    C_I27?: boolean
    C_I28?: boolean
    C_I29?: boolean
    C_I30?: boolean
    C_I31?: boolean
    C_I32?: boolean
    C_I33?: boolean
    C_I34?: boolean
    C_I35?: boolean
    C_I36?: boolean
    C_I37?: boolean
  }

  export type TCOMPETITORSGetPayload<
    S extends boolean | null | undefined | TCOMPETITORSArgs,
    U = keyof S
      > = S extends true
        ? TCOMPETITORS
    : S extends undefined
    ? never
    : S extends TCOMPETITORSArgs | TCOMPETITORSFindManyArgs
    ?'include' extends U
    ? TCOMPETITORS 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TCOMPETITORS ? TCOMPETITORS[P] : never
  } 
    : TCOMPETITORS
  : TCOMPETITORS


  type TCOMPETITORSCountArgs = Merge<
    Omit<TCOMPETITORSFindManyArgs, 'select' | 'include'> & {
      select?: TCOMPETITORSCountAggregateInputType | true
    }
  >

  export interface TCOMPETITORSDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TCOMPETITORS that matches the filter.
     * @param {TCOMPETITORSFindUniqueArgs} args - Arguments to find a TCOMPETITORS
     * @example
     * // Get one TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TCOMPETITORSFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TCOMPETITORSFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TCOMPETITORS'> extends True ? CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS>, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T>>> : CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS | null >, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T> | null >>

    /**
     * Find the first TCOMPETITORS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TCOMPETITORSFindFirstArgs} args - Arguments to find a TCOMPETITORS
     * @example
     * // Get one TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TCOMPETITORSFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TCOMPETITORSFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TCOMPETITORS'> extends True ? CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS>, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T>>> : CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS | null >, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T> | null >>

    /**
     * Find zero or more TCOMPETITORS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TCOMPETITORSFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.findMany()
     * 
     * // Get first 10 TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.findMany({ take: 10 })
     * 
     * // Only select the `C_IDX`
     * const tCOMPETITORSWithC_IDXOnly = await prisma.tCOMPETITORS.findMany({ select: { C_IDX: true } })
     * 
    **/
    findMany<T extends TCOMPETITORSFindManyArgs>(
      args?: SelectSubset<T, TCOMPETITORSFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TCOMPETITORS>>, PrismaPromise<Array<TCOMPETITORSGetPayload<T>>>>

    /**
     * Create a TCOMPETITORS.
     * @param {TCOMPETITORSCreateArgs} args - Arguments to create a TCOMPETITORS.
     * @example
     * // Create one TCOMPETITORS
     * const TCOMPETITORS = await prisma.tCOMPETITORS.create({
     *   data: {
     *     // ... data to create a TCOMPETITORS
     *   }
     * })
     * 
    **/
    create<T extends TCOMPETITORSCreateArgs>(
      args: SelectSubset<T, TCOMPETITORSCreateArgs>
    ): CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS>, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T>>>

    /**
     * Delete a TCOMPETITORS.
     * @param {TCOMPETITORSDeleteArgs} args - Arguments to delete one TCOMPETITORS.
     * @example
     * // Delete one TCOMPETITORS
     * const TCOMPETITORS = await prisma.tCOMPETITORS.delete({
     *   where: {
     *     // ... filter to delete one TCOMPETITORS
     *   }
     * })
     * 
    **/
    delete<T extends TCOMPETITORSDeleteArgs>(
      args: SelectSubset<T, TCOMPETITORSDeleteArgs>
    ): CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS>, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T>>>

    /**
     * Update one TCOMPETITORS.
     * @param {TCOMPETITORSUpdateArgs} args - Arguments to update one TCOMPETITORS.
     * @example
     * // Update one TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TCOMPETITORSUpdateArgs>(
      args: SelectSubset<T, TCOMPETITORSUpdateArgs>
    ): CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS>, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T>>>

    /**
     * Delete zero or more TCOMPETITORS.
     * @param {TCOMPETITORSDeleteManyArgs} args - Arguments to filter TCOMPETITORS to delete.
     * @example
     * // Delete a few TCOMPETITORS
     * const { count } = await prisma.tCOMPETITORS.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TCOMPETITORSDeleteManyArgs>(
      args?: SelectSubset<T, TCOMPETITORSDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TCOMPETITORS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TCOMPETITORSUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TCOMPETITORSUpdateManyArgs>(
      args: SelectSubset<T, TCOMPETITORSUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TCOMPETITORS.
     * @param {TCOMPETITORSUpsertArgs} args - Arguments to update or create a TCOMPETITORS.
     * @example
     * // Update or create a TCOMPETITORS
     * const tCOMPETITORS = await prisma.tCOMPETITORS.upsert({
     *   create: {
     *     // ... data to create a TCOMPETITORS
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TCOMPETITORS we want to update
     *   }
     * })
    **/
    upsert<T extends TCOMPETITORSUpsertArgs>(
      args: SelectSubset<T, TCOMPETITORSUpsertArgs>
    ): CheckSelect<T, Prisma__TCOMPETITORSClient<TCOMPETITORS>, Prisma__TCOMPETITORSClient<TCOMPETITORSGetPayload<T>>>

    /**
     * Count the number of TCOMPETITORS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TCOMPETITORSCountArgs} args - Arguments to filter TCOMPETITORS to count.
     * @example
     * // Count the number of TCOMPETITORS
     * const count = await prisma.tCOMPETITORS.count({
     *   where: {
     *     // ... the filter for the TCOMPETITORS we want to count
     *   }
     * })
    **/
    count<T extends TCOMPETITORSCountArgs>(
      args?: Subset<T, TCOMPETITORSCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TCOMPETITORSCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TCOMPETITORS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TCOMPETITORSAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TCOMPETITORSAggregateArgs>(args: Subset<T, TCOMPETITORSAggregateArgs>): PrismaPromise<GetTCOMPETITORSAggregateType<T>>

    /**
     * Group by TCOMPETITORS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TCOMPETITORSGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TCOMPETITORSGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TCOMPETITORSGroupByArgs['orderBy'] }
        : { orderBy?: TCOMPETITORSGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TCOMPETITORSGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTCOMPETITORSGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TCOMPETITORS.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TCOMPETITORSClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TCOMPETITORS findUnique
   */
  export type TCOMPETITORSFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * Throw an Error if a TCOMPETITORS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TCOMPETITORS to fetch.
     * 
    **/
    where: TCOMPETITORSWhereUniqueInput
  }


  /**
   * TCOMPETITORS findFirst
   */
  export type TCOMPETITORSFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * Throw an Error if a TCOMPETITORS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TCOMPETITORS to fetch.
     * 
    **/
    where?: TCOMPETITORSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TCOMPETITORS to fetch.
     * 
    **/
    orderBy?: Enumerable<TCOMPETITORSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TCOMPETITORS.
     * 
    **/
    cursor?: TCOMPETITORSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TCOMPETITORS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TCOMPETITORS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TCOMPETITORS.
     * 
    **/
    distinct?: Enumerable<TCOMPETITORSScalarFieldEnum>
  }


  /**
   * TCOMPETITORS findMany
   */
  export type TCOMPETITORSFindManyArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * Filter, which TCOMPETITORS to fetch.
     * 
    **/
    where?: TCOMPETITORSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TCOMPETITORS to fetch.
     * 
    **/
    orderBy?: Enumerable<TCOMPETITORSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TCOMPETITORS.
     * 
    **/
    cursor?: TCOMPETITORSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TCOMPETITORS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TCOMPETITORS.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TCOMPETITORSScalarFieldEnum>
  }


  /**
   * TCOMPETITORS create
   */
  export type TCOMPETITORSCreateArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * The data needed to create a TCOMPETITORS.
     * 
    **/
    data: XOR<TCOMPETITORSCreateInput, TCOMPETITORSUncheckedCreateInput>
  }


  /**
   * TCOMPETITORS update
   */
  export type TCOMPETITORSUpdateArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * The data needed to update a TCOMPETITORS.
     * 
    **/
    data: XOR<TCOMPETITORSUpdateInput, TCOMPETITORSUncheckedUpdateInput>
    /**
     * Choose, which TCOMPETITORS to update.
     * 
    **/
    where: TCOMPETITORSWhereUniqueInput
  }


  /**
   * TCOMPETITORS updateMany
   */
  export type TCOMPETITORSUpdateManyArgs = {
    /**
     * The data used to update TCOMPETITORS.
     * 
    **/
    data: XOR<TCOMPETITORSUpdateManyMutationInput, TCOMPETITORSUncheckedUpdateManyInput>
    /**
     * Filter which TCOMPETITORS to update
     * 
    **/
    where?: TCOMPETITORSWhereInput
  }


  /**
   * TCOMPETITORS upsert
   */
  export type TCOMPETITORSUpsertArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * The filter to search for the TCOMPETITORS to update in case it exists.
     * 
    **/
    where: TCOMPETITORSWhereUniqueInput
    /**
     * In case the TCOMPETITORS found by the `where` argument doesn't exist, create a new TCOMPETITORS with this data.
     * 
    **/
    create: XOR<TCOMPETITORSCreateInput, TCOMPETITORSUncheckedCreateInput>
    /**
     * In case the TCOMPETITORS was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TCOMPETITORSUpdateInput, TCOMPETITORSUncheckedUpdateInput>
  }


  /**
   * TCOMPETITORS delete
   */
  export type TCOMPETITORSDeleteArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
    /**
     * Filter which TCOMPETITORS to delete.
     * 
    **/
    where: TCOMPETITORSWhereUniqueInput
  }


  /**
   * TCOMPETITORS deleteMany
   */
  export type TCOMPETITORSDeleteManyArgs = {
    /**
     * Filter which TCOMPETITORS to delete
     * 
    **/
    where?: TCOMPETITORSWhereInput
  }


  /**
   * TCOMPETITORS without action
   */
  export type TCOMPETITORSArgs = {
    /**
     * Select specific fields to fetch from the TCOMPETITORS
     * 
    **/
    select?: TCOMPETITORSSelect | null
  }



  /**
   * Model TEDITINGFORMATS
   */


  export type AggregateTEDITINGFORMATS = {
    _count: TEDITINGFORMATSCountAggregateOutputType | null
    _avg: TEDITINGFORMATSAvgAggregateOutputType | null
    _sum: TEDITINGFORMATSSumAggregateOutputType | null
    _min: TEDITINGFORMATSMinAggregateOutputType | null
    _max: TEDITINGFORMATSMaxAggregateOutputType | null
  }

  export type TEDITINGFORMATSAvgAggregateOutputType = {
    C_NUMEDIT: number | null
  }

  export type TEDITINGFORMATSSumAggregateOutputType = {
    C_NUMEDIT: number | null
  }

  export type TEDITINGFORMATSMinAggregateOutputType = {
    C_NUMEDIT: number | null
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TEDITINGFORMATSMaxAggregateOutputType = {
    C_NUMEDIT: number | null
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TEDITINGFORMATSCountAggregateOutputType = {
    C_NUMEDIT: number
    C_PARAM: number
    C_VALUE: number
    _all: number
  }


  export type TEDITINGFORMATSAvgAggregateInputType = {
    C_NUMEDIT?: true
  }

  export type TEDITINGFORMATSSumAggregateInputType = {
    C_NUMEDIT?: true
  }

  export type TEDITINGFORMATSMinAggregateInputType = {
    C_NUMEDIT?: true
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TEDITINGFORMATSMaxAggregateInputType = {
    C_NUMEDIT?: true
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TEDITINGFORMATSCountAggregateInputType = {
    C_NUMEDIT?: true
    C_PARAM?: true
    C_VALUE?: true
    _all?: true
  }

  export type TEDITINGFORMATSAggregateArgs = {
    /**
     * Filter which TEDITINGFORMATS to aggregate.
     * 
    **/
    where?: TEDITINGFORMATSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TEDITINGFORMATS to fetch.
     * 
    **/
    orderBy?: Enumerable<TEDITINGFORMATSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TEDITINGFORMATSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TEDITINGFORMATS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TEDITINGFORMATS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TEDITINGFORMATS
    **/
    _count?: true | TEDITINGFORMATSCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TEDITINGFORMATSAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TEDITINGFORMATSSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TEDITINGFORMATSMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TEDITINGFORMATSMaxAggregateInputType
  }

  export type GetTEDITINGFORMATSAggregateType<T extends TEDITINGFORMATSAggregateArgs> = {
        [P in keyof T & keyof AggregateTEDITINGFORMATS]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTEDITINGFORMATS[P]>
      : GetScalarType<T[P], AggregateTEDITINGFORMATS[P]>
  }




  export type TEDITINGFORMATSGroupByArgs = {
    where?: TEDITINGFORMATSWhereInput
    orderBy?: Enumerable<TEDITINGFORMATSOrderByWithAggregationInput>
    by: Array<TEDITINGFORMATSScalarFieldEnum>
    having?: TEDITINGFORMATSScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TEDITINGFORMATSCountAggregateInputType | true
    _avg?: TEDITINGFORMATSAvgAggregateInputType
    _sum?: TEDITINGFORMATSSumAggregateInputType
    _min?: TEDITINGFORMATSMinAggregateInputType
    _max?: TEDITINGFORMATSMaxAggregateInputType
  }


  export type TEDITINGFORMATSGroupByOutputType = {
    C_NUMEDIT: number
    C_PARAM: string
    C_VALUE: string | null
    _count: TEDITINGFORMATSCountAggregateOutputType | null
    _avg: TEDITINGFORMATSAvgAggregateOutputType | null
    _sum: TEDITINGFORMATSSumAggregateOutputType | null
    _min: TEDITINGFORMATSMinAggregateOutputType | null
    _max: TEDITINGFORMATSMaxAggregateOutputType | null
  }

  type GetTEDITINGFORMATSGroupByPayload<T extends TEDITINGFORMATSGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TEDITINGFORMATSGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TEDITINGFORMATSGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TEDITINGFORMATSGroupByOutputType[P]>
            : GetScalarType<T[P], TEDITINGFORMATSGroupByOutputType[P]>
        }
      >
    >


  export type TEDITINGFORMATSSelect = {
    C_NUMEDIT?: boolean
    C_PARAM?: boolean
    C_VALUE?: boolean
  }

  export type TEDITINGFORMATSGetPayload<
    S extends boolean | null | undefined | TEDITINGFORMATSArgs,
    U = keyof S
      > = S extends true
        ? TEDITINGFORMATS
    : S extends undefined
    ? never
    : S extends TEDITINGFORMATSArgs | TEDITINGFORMATSFindManyArgs
    ?'include' extends U
    ? TEDITINGFORMATS 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TEDITINGFORMATS ? TEDITINGFORMATS[P] : never
  } 
    : TEDITINGFORMATS
  : TEDITINGFORMATS


  type TEDITINGFORMATSCountArgs = Merge<
    Omit<TEDITINGFORMATSFindManyArgs, 'select' | 'include'> & {
      select?: TEDITINGFORMATSCountAggregateInputType | true
    }
  >

  export interface TEDITINGFORMATSDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TEDITINGFORMATS that matches the filter.
     * @param {TEDITINGFORMATSFindUniqueArgs} args - Arguments to find a TEDITINGFORMATS
     * @example
     * // Get one TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TEDITINGFORMATSFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TEDITINGFORMATSFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TEDITINGFORMATS'> extends True ? CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS>, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T>>> : CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS | null >, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T> | null >>

    /**
     * Find the first TEDITINGFORMATS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGFORMATSFindFirstArgs} args - Arguments to find a TEDITINGFORMATS
     * @example
     * // Get one TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TEDITINGFORMATSFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TEDITINGFORMATSFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TEDITINGFORMATS'> extends True ? CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS>, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T>>> : CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS | null >, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T> | null >>

    /**
     * Find zero or more TEDITINGFORMATS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGFORMATSFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.findMany()
     * 
     * // Get first 10 TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.findMany({ take: 10 })
     * 
     * // Only select the `C_NUMEDIT`
     * const tEDITINGFORMATSWithC_NUMEDITOnly = await prisma.tEDITINGFORMATS.findMany({ select: { C_NUMEDIT: true } })
     * 
    **/
    findMany<T extends TEDITINGFORMATSFindManyArgs>(
      args?: SelectSubset<T, TEDITINGFORMATSFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TEDITINGFORMATS>>, PrismaPromise<Array<TEDITINGFORMATSGetPayload<T>>>>

    /**
     * Create a TEDITINGFORMATS.
     * @param {TEDITINGFORMATSCreateArgs} args - Arguments to create a TEDITINGFORMATS.
     * @example
     * // Create one TEDITINGFORMATS
     * const TEDITINGFORMATS = await prisma.tEDITINGFORMATS.create({
     *   data: {
     *     // ... data to create a TEDITINGFORMATS
     *   }
     * })
     * 
    **/
    create<T extends TEDITINGFORMATSCreateArgs>(
      args: SelectSubset<T, TEDITINGFORMATSCreateArgs>
    ): CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS>, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T>>>

    /**
     * Delete a TEDITINGFORMATS.
     * @param {TEDITINGFORMATSDeleteArgs} args - Arguments to delete one TEDITINGFORMATS.
     * @example
     * // Delete one TEDITINGFORMATS
     * const TEDITINGFORMATS = await prisma.tEDITINGFORMATS.delete({
     *   where: {
     *     // ... filter to delete one TEDITINGFORMATS
     *   }
     * })
     * 
    **/
    delete<T extends TEDITINGFORMATSDeleteArgs>(
      args: SelectSubset<T, TEDITINGFORMATSDeleteArgs>
    ): CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS>, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T>>>

    /**
     * Update one TEDITINGFORMATS.
     * @param {TEDITINGFORMATSUpdateArgs} args - Arguments to update one TEDITINGFORMATS.
     * @example
     * // Update one TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TEDITINGFORMATSUpdateArgs>(
      args: SelectSubset<T, TEDITINGFORMATSUpdateArgs>
    ): CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS>, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T>>>

    /**
     * Delete zero or more TEDITINGFORMATS.
     * @param {TEDITINGFORMATSDeleteManyArgs} args - Arguments to filter TEDITINGFORMATS to delete.
     * @example
     * // Delete a few TEDITINGFORMATS
     * const { count } = await prisma.tEDITINGFORMATS.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TEDITINGFORMATSDeleteManyArgs>(
      args?: SelectSubset<T, TEDITINGFORMATSDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TEDITINGFORMATS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGFORMATSUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TEDITINGFORMATSUpdateManyArgs>(
      args: SelectSubset<T, TEDITINGFORMATSUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TEDITINGFORMATS.
     * @param {TEDITINGFORMATSUpsertArgs} args - Arguments to update or create a TEDITINGFORMATS.
     * @example
     * // Update or create a TEDITINGFORMATS
     * const tEDITINGFORMATS = await prisma.tEDITINGFORMATS.upsert({
     *   create: {
     *     // ... data to create a TEDITINGFORMATS
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TEDITINGFORMATS we want to update
     *   }
     * })
    **/
    upsert<T extends TEDITINGFORMATSUpsertArgs>(
      args: SelectSubset<T, TEDITINGFORMATSUpsertArgs>
    ): CheckSelect<T, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATS>, Prisma__TEDITINGFORMATSClient<TEDITINGFORMATSGetPayload<T>>>

    /**
     * Count the number of TEDITINGFORMATS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGFORMATSCountArgs} args - Arguments to filter TEDITINGFORMATS to count.
     * @example
     * // Count the number of TEDITINGFORMATS
     * const count = await prisma.tEDITINGFORMATS.count({
     *   where: {
     *     // ... the filter for the TEDITINGFORMATS we want to count
     *   }
     * })
    **/
    count<T extends TEDITINGFORMATSCountArgs>(
      args?: Subset<T, TEDITINGFORMATSCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TEDITINGFORMATSCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TEDITINGFORMATS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGFORMATSAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TEDITINGFORMATSAggregateArgs>(args: Subset<T, TEDITINGFORMATSAggregateArgs>): PrismaPromise<GetTEDITINGFORMATSAggregateType<T>>

    /**
     * Group by TEDITINGFORMATS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGFORMATSGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TEDITINGFORMATSGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TEDITINGFORMATSGroupByArgs['orderBy'] }
        : { orderBy?: TEDITINGFORMATSGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TEDITINGFORMATSGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTEDITINGFORMATSGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TEDITINGFORMATS.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TEDITINGFORMATSClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TEDITINGFORMATS findUnique
   */
  export type TEDITINGFORMATSFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * Throw an Error if a TEDITINGFORMATS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TEDITINGFORMATS to fetch.
     * 
    **/
    where: TEDITINGFORMATSWhereUniqueInput
  }


  /**
   * TEDITINGFORMATS findFirst
   */
  export type TEDITINGFORMATSFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * Throw an Error if a TEDITINGFORMATS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TEDITINGFORMATS to fetch.
     * 
    **/
    where?: TEDITINGFORMATSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TEDITINGFORMATS to fetch.
     * 
    **/
    orderBy?: Enumerable<TEDITINGFORMATSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TEDITINGFORMATS.
     * 
    **/
    cursor?: TEDITINGFORMATSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TEDITINGFORMATS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TEDITINGFORMATS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TEDITINGFORMATS.
     * 
    **/
    distinct?: Enumerable<TEDITINGFORMATSScalarFieldEnum>
  }


  /**
   * TEDITINGFORMATS findMany
   */
  export type TEDITINGFORMATSFindManyArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * Filter, which TEDITINGFORMATS to fetch.
     * 
    **/
    where?: TEDITINGFORMATSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TEDITINGFORMATS to fetch.
     * 
    **/
    orderBy?: Enumerable<TEDITINGFORMATSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TEDITINGFORMATS.
     * 
    **/
    cursor?: TEDITINGFORMATSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TEDITINGFORMATS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TEDITINGFORMATS.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TEDITINGFORMATSScalarFieldEnum>
  }


  /**
   * TEDITINGFORMATS create
   */
  export type TEDITINGFORMATSCreateArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * The data needed to create a TEDITINGFORMATS.
     * 
    **/
    data: XOR<TEDITINGFORMATSCreateInput, TEDITINGFORMATSUncheckedCreateInput>
  }


  /**
   * TEDITINGFORMATS update
   */
  export type TEDITINGFORMATSUpdateArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * The data needed to update a TEDITINGFORMATS.
     * 
    **/
    data: XOR<TEDITINGFORMATSUpdateInput, TEDITINGFORMATSUncheckedUpdateInput>
    /**
     * Choose, which TEDITINGFORMATS to update.
     * 
    **/
    where: TEDITINGFORMATSWhereUniqueInput
  }


  /**
   * TEDITINGFORMATS updateMany
   */
  export type TEDITINGFORMATSUpdateManyArgs = {
    /**
     * The data used to update TEDITINGFORMATS.
     * 
    **/
    data: XOR<TEDITINGFORMATSUpdateManyMutationInput, TEDITINGFORMATSUncheckedUpdateManyInput>
    /**
     * Filter which TEDITINGFORMATS to update
     * 
    **/
    where?: TEDITINGFORMATSWhereInput
  }


  /**
   * TEDITINGFORMATS upsert
   */
  export type TEDITINGFORMATSUpsertArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * The filter to search for the TEDITINGFORMATS to update in case it exists.
     * 
    **/
    where: TEDITINGFORMATSWhereUniqueInput
    /**
     * In case the TEDITINGFORMATS found by the `where` argument doesn't exist, create a new TEDITINGFORMATS with this data.
     * 
    **/
    create: XOR<TEDITINGFORMATSCreateInput, TEDITINGFORMATSUncheckedCreateInput>
    /**
     * In case the TEDITINGFORMATS was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TEDITINGFORMATSUpdateInput, TEDITINGFORMATSUncheckedUpdateInput>
  }


  /**
   * TEDITINGFORMATS delete
   */
  export type TEDITINGFORMATSDeleteArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
    /**
     * Filter which TEDITINGFORMATS to delete.
     * 
    **/
    where: TEDITINGFORMATSWhereUniqueInput
  }


  /**
   * TEDITINGFORMATS deleteMany
   */
  export type TEDITINGFORMATSDeleteManyArgs = {
    /**
     * Filter which TEDITINGFORMATS to delete
     * 
    **/
    where?: TEDITINGFORMATSWhereInput
  }


  /**
   * TEDITINGFORMATS without action
   */
  export type TEDITINGFORMATSArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGFORMATS
     * 
    **/
    select?: TEDITINGFORMATSSelect | null
  }



  /**
   * Model TEDITINGPARAMETERS
   */


  export type AggregateTEDITINGPARAMETERS = {
    _count: TEDITINGPARAMETERSCountAggregateOutputType | null
    _min: TEDITINGPARAMETERSMinAggregateOutputType | null
    _max: TEDITINGPARAMETERSMaxAggregateOutputType | null
  }

  export type TEDITINGPARAMETERSMinAggregateOutputType = {
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TEDITINGPARAMETERSMaxAggregateOutputType = {
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TEDITINGPARAMETERSCountAggregateOutputType = {
    C_PARAM: number
    C_VALUE: number
    _all: number
  }


  export type TEDITINGPARAMETERSMinAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TEDITINGPARAMETERSMaxAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TEDITINGPARAMETERSCountAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
    _all?: true
  }

  export type TEDITINGPARAMETERSAggregateArgs = {
    /**
     * Filter which TEDITINGPARAMETERS to aggregate.
     * 
    **/
    where?: TEDITINGPARAMETERSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TEDITINGPARAMETERS to fetch.
     * 
    **/
    orderBy?: Enumerable<TEDITINGPARAMETERSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TEDITINGPARAMETERSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TEDITINGPARAMETERS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TEDITINGPARAMETERS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TEDITINGPARAMETERS
    **/
    _count?: true | TEDITINGPARAMETERSCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TEDITINGPARAMETERSMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TEDITINGPARAMETERSMaxAggregateInputType
  }

  export type GetTEDITINGPARAMETERSAggregateType<T extends TEDITINGPARAMETERSAggregateArgs> = {
        [P in keyof T & keyof AggregateTEDITINGPARAMETERS]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTEDITINGPARAMETERS[P]>
      : GetScalarType<T[P], AggregateTEDITINGPARAMETERS[P]>
  }




  export type TEDITINGPARAMETERSGroupByArgs = {
    where?: TEDITINGPARAMETERSWhereInput
    orderBy?: Enumerable<TEDITINGPARAMETERSOrderByWithAggregationInput>
    by: Array<TEDITINGPARAMETERSScalarFieldEnum>
    having?: TEDITINGPARAMETERSScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TEDITINGPARAMETERSCountAggregateInputType | true
    _min?: TEDITINGPARAMETERSMinAggregateInputType
    _max?: TEDITINGPARAMETERSMaxAggregateInputType
  }


  export type TEDITINGPARAMETERSGroupByOutputType = {
    C_PARAM: string
    C_VALUE: string | null
    _count: TEDITINGPARAMETERSCountAggregateOutputType | null
    _min: TEDITINGPARAMETERSMinAggregateOutputType | null
    _max: TEDITINGPARAMETERSMaxAggregateOutputType | null
  }

  type GetTEDITINGPARAMETERSGroupByPayload<T extends TEDITINGPARAMETERSGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TEDITINGPARAMETERSGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TEDITINGPARAMETERSGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TEDITINGPARAMETERSGroupByOutputType[P]>
            : GetScalarType<T[P], TEDITINGPARAMETERSGroupByOutputType[P]>
        }
      >
    >


  export type TEDITINGPARAMETERSSelect = {
    C_PARAM?: boolean
    C_VALUE?: boolean
  }

  export type TEDITINGPARAMETERSGetPayload<
    S extends boolean | null | undefined | TEDITINGPARAMETERSArgs,
    U = keyof S
      > = S extends true
        ? TEDITINGPARAMETERS
    : S extends undefined
    ? never
    : S extends TEDITINGPARAMETERSArgs | TEDITINGPARAMETERSFindManyArgs
    ?'include' extends U
    ? TEDITINGPARAMETERS 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TEDITINGPARAMETERS ? TEDITINGPARAMETERS[P] : never
  } 
    : TEDITINGPARAMETERS
  : TEDITINGPARAMETERS


  type TEDITINGPARAMETERSCountArgs = Merge<
    Omit<TEDITINGPARAMETERSFindManyArgs, 'select' | 'include'> & {
      select?: TEDITINGPARAMETERSCountAggregateInputType | true
    }
  >

  export interface TEDITINGPARAMETERSDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TEDITINGPARAMETERS that matches the filter.
     * @param {TEDITINGPARAMETERSFindUniqueArgs} args - Arguments to find a TEDITINGPARAMETERS
     * @example
     * // Get one TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TEDITINGPARAMETERSFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TEDITINGPARAMETERSFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TEDITINGPARAMETERS'> extends True ? CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS>, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T>>> : CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS | null >, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T> | null >>

    /**
     * Find the first TEDITINGPARAMETERS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGPARAMETERSFindFirstArgs} args - Arguments to find a TEDITINGPARAMETERS
     * @example
     * // Get one TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TEDITINGPARAMETERSFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TEDITINGPARAMETERSFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TEDITINGPARAMETERS'> extends True ? CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS>, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T>>> : CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS | null >, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T> | null >>

    /**
     * Find zero or more TEDITINGPARAMETERS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGPARAMETERSFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.findMany()
     * 
     * // Get first 10 TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.findMany({ take: 10 })
     * 
     * // Only select the `C_PARAM`
     * const tEDITINGPARAMETERSWithC_PARAMOnly = await prisma.tEDITINGPARAMETERS.findMany({ select: { C_PARAM: true } })
     * 
    **/
    findMany<T extends TEDITINGPARAMETERSFindManyArgs>(
      args?: SelectSubset<T, TEDITINGPARAMETERSFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TEDITINGPARAMETERS>>, PrismaPromise<Array<TEDITINGPARAMETERSGetPayload<T>>>>

    /**
     * Create a TEDITINGPARAMETERS.
     * @param {TEDITINGPARAMETERSCreateArgs} args - Arguments to create a TEDITINGPARAMETERS.
     * @example
     * // Create one TEDITINGPARAMETERS
     * const TEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.create({
     *   data: {
     *     // ... data to create a TEDITINGPARAMETERS
     *   }
     * })
     * 
    **/
    create<T extends TEDITINGPARAMETERSCreateArgs>(
      args: SelectSubset<T, TEDITINGPARAMETERSCreateArgs>
    ): CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS>, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T>>>

    /**
     * Delete a TEDITINGPARAMETERS.
     * @param {TEDITINGPARAMETERSDeleteArgs} args - Arguments to delete one TEDITINGPARAMETERS.
     * @example
     * // Delete one TEDITINGPARAMETERS
     * const TEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.delete({
     *   where: {
     *     // ... filter to delete one TEDITINGPARAMETERS
     *   }
     * })
     * 
    **/
    delete<T extends TEDITINGPARAMETERSDeleteArgs>(
      args: SelectSubset<T, TEDITINGPARAMETERSDeleteArgs>
    ): CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS>, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T>>>

    /**
     * Update one TEDITINGPARAMETERS.
     * @param {TEDITINGPARAMETERSUpdateArgs} args - Arguments to update one TEDITINGPARAMETERS.
     * @example
     * // Update one TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TEDITINGPARAMETERSUpdateArgs>(
      args: SelectSubset<T, TEDITINGPARAMETERSUpdateArgs>
    ): CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS>, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T>>>

    /**
     * Delete zero or more TEDITINGPARAMETERS.
     * @param {TEDITINGPARAMETERSDeleteManyArgs} args - Arguments to filter TEDITINGPARAMETERS to delete.
     * @example
     * // Delete a few TEDITINGPARAMETERS
     * const { count } = await prisma.tEDITINGPARAMETERS.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TEDITINGPARAMETERSDeleteManyArgs>(
      args?: SelectSubset<T, TEDITINGPARAMETERSDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TEDITINGPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGPARAMETERSUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TEDITINGPARAMETERSUpdateManyArgs>(
      args: SelectSubset<T, TEDITINGPARAMETERSUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TEDITINGPARAMETERS.
     * @param {TEDITINGPARAMETERSUpsertArgs} args - Arguments to update or create a TEDITINGPARAMETERS.
     * @example
     * // Update or create a TEDITINGPARAMETERS
     * const tEDITINGPARAMETERS = await prisma.tEDITINGPARAMETERS.upsert({
     *   create: {
     *     // ... data to create a TEDITINGPARAMETERS
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TEDITINGPARAMETERS we want to update
     *   }
     * })
    **/
    upsert<T extends TEDITINGPARAMETERSUpsertArgs>(
      args: SelectSubset<T, TEDITINGPARAMETERSUpsertArgs>
    ): CheckSelect<T, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERS>, Prisma__TEDITINGPARAMETERSClient<TEDITINGPARAMETERSGetPayload<T>>>

    /**
     * Count the number of TEDITINGPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGPARAMETERSCountArgs} args - Arguments to filter TEDITINGPARAMETERS to count.
     * @example
     * // Count the number of TEDITINGPARAMETERS
     * const count = await prisma.tEDITINGPARAMETERS.count({
     *   where: {
     *     // ... the filter for the TEDITINGPARAMETERS we want to count
     *   }
     * })
    **/
    count<T extends TEDITINGPARAMETERSCountArgs>(
      args?: Subset<T, TEDITINGPARAMETERSCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TEDITINGPARAMETERSCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TEDITINGPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGPARAMETERSAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TEDITINGPARAMETERSAggregateArgs>(args: Subset<T, TEDITINGPARAMETERSAggregateArgs>): PrismaPromise<GetTEDITINGPARAMETERSAggregateType<T>>

    /**
     * Group by TEDITINGPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TEDITINGPARAMETERSGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TEDITINGPARAMETERSGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TEDITINGPARAMETERSGroupByArgs['orderBy'] }
        : { orderBy?: TEDITINGPARAMETERSGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TEDITINGPARAMETERSGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTEDITINGPARAMETERSGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TEDITINGPARAMETERS.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TEDITINGPARAMETERSClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TEDITINGPARAMETERS findUnique
   */
  export type TEDITINGPARAMETERSFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * Throw an Error if a TEDITINGPARAMETERS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TEDITINGPARAMETERS to fetch.
     * 
    **/
    where: TEDITINGPARAMETERSWhereUniqueInput
  }


  /**
   * TEDITINGPARAMETERS findFirst
   */
  export type TEDITINGPARAMETERSFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * Throw an Error if a TEDITINGPARAMETERS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TEDITINGPARAMETERS to fetch.
     * 
    **/
    where?: TEDITINGPARAMETERSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TEDITINGPARAMETERS to fetch.
     * 
    **/
    orderBy?: Enumerable<TEDITINGPARAMETERSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TEDITINGPARAMETERS.
     * 
    **/
    cursor?: TEDITINGPARAMETERSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TEDITINGPARAMETERS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TEDITINGPARAMETERS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TEDITINGPARAMETERS.
     * 
    **/
    distinct?: Enumerable<TEDITINGPARAMETERSScalarFieldEnum>
  }


  /**
   * TEDITINGPARAMETERS findMany
   */
  export type TEDITINGPARAMETERSFindManyArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * Filter, which TEDITINGPARAMETERS to fetch.
     * 
    **/
    where?: TEDITINGPARAMETERSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TEDITINGPARAMETERS to fetch.
     * 
    **/
    orderBy?: Enumerable<TEDITINGPARAMETERSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TEDITINGPARAMETERS.
     * 
    **/
    cursor?: TEDITINGPARAMETERSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TEDITINGPARAMETERS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TEDITINGPARAMETERS.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TEDITINGPARAMETERSScalarFieldEnum>
  }


  /**
   * TEDITINGPARAMETERS create
   */
  export type TEDITINGPARAMETERSCreateArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * The data needed to create a TEDITINGPARAMETERS.
     * 
    **/
    data: XOR<TEDITINGPARAMETERSCreateInput, TEDITINGPARAMETERSUncheckedCreateInput>
  }


  /**
   * TEDITINGPARAMETERS update
   */
  export type TEDITINGPARAMETERSUpdateArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * The data needed to update a TEDITINGPARAMETERS.
     * 
    **/
    data: XOR<TEDITINGPARAMETERSUpdateInput, TEDITINGPARAMETERSUncheckedUpdateInput>
    /**
     * Choose, which TEDITINGPARAMETERS to update.
     * 
    **/
    where: TEDITINGPARAMETERSWhereUniqueInput
  }


  /**
   * TEDITINGPARAMETERS updateMany
   */
  export type TEDITINGPARAMETERSUpdateManyArgs = {
    /**
     * The data used to update TEDITINGPARAMETERS.
     * 
    **/
    data: XOR<TEDITINGPARAMETERSUpdateManyMutationInput, TEDITINGPARAMETERSUncheckedUpdateManyInput>
    /**
     * Filter which TEDITINGPARAMETERS to update
     * 
    **/
    where?: TEDITINGPARAMETERSWhereInput
  }


  /**
   * TEDITINGPARAMETERS upsert
   */
  export type TEDITINGPARAMETERSUpsertArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * The filter to search for the TEDITINGPARAMETERS to update in case it exists.
     * 
    **/
    where: TEDITINGPARAMETERSWhereUniqueInput
    /**
     * In case the TEDITINGPARAMETERS found by the `where` argument doesn't exist, create a new TEDITINGPARAMETERS with this data.
     * 
    **/
    create: XOR<TEDITINGPARAMETERSCreateInput, TEDITINGPARAMETERSUncheckedCreateInput>
    /**
     * In case the TEDITINGPARAMETERS was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TEDITINGPARAMETERSUpdateInput, TEDITINGPARAMETERSUncheckedUpdateInput>
  }


  /**
   * TEDITINGPARAMETERS delete
   */
  export type TEDITINGPARAMETERSDeleteArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
    /**
     * Filter which TEDITINGPARAMETERS to delete.
     * 
    **/
    where: TEDITINGPARAMETERSWhereUniqueInput
  }


  /**
   * TEDITINGPARAMETERS deleteMany
   */
  export type TEDITINGPARAMETERSDeleteManyArgs = {
    /**
     * Filter which TEDITINGPARAMETERS to delete
     * 
    **/
    where?: TEDITINGPARAMETERSWhereInput
  }


  /**
   * TEDITINGPARAMETERS without action
   */
  export type TEDITINGPARAMETERSArgs = {
    /**
     * Select specific fields to fetch from the TEDITINGPARAMETERS
     * 
    **/
    select?: TEDITINGPARAMETERSSelect | null
  }



  /**
   * Model TKEYVALUES
   */


  export type AggregateTKEYVALUES = {
    _count: TKEYVALUESCountAggregateOutputType | null
    _avg: TKEYVALUESAvgAggregateOutputType | null
    _sum: TKEYVALUESSumAggregateOutputType | null
    _min: TKEYVALUESMinAggregateOutputType | null
    _max: TKEYVALUESMaxAggregateOutputType | null
  }

  export type TKEYVALUESAvgAggregateOutputType = {
    KEYVALUE: number | null
  }

  export type TKEYVALUESSumAggregateOutputType = {
    KEYVALUE: number | null
  }

  export type TKEYVALUESMinAggregateOutputType = {
    TABLENAME: string | null
    KEYVALUE: number | null
  }

  export type TKEYVALUESMaxAggregateOutputType = {
    TABLENAME: string | null
    KEYVALUE: number | null
  }

  export type TKEYVALUESCountAggregateOutputType = {
    TABLENAME: number
    KEYVALUE: number
    _all: number
  }


  export type TKEYVALUESAvgAggregateInputType = {
    KEYVALUE?: true
  }

  export type TKEYVALUESSumAggregateInputType = {
    KEYVALUE?: true
  }

  export type TKEYVALUESMinAggregateInputType = {
    TABLENAME?: true
    KEYVALUE?: true
  }

  export type TKEYVALUESMaxAggregateInputType = {
    TABLENAME?: true
    KEYVALUE?: true
  }

  export type TKEYVALUESCountAggregateInputType = {
    TABLENAME?: true
    KEYVALUE?: true
    _all?: true
  }

  export type TKEYVALUESAggregateArgs = {
    /**
     * Filter which TKEYVALUES to aggregate.
     * 
    **/
    where?: TKEYVALUESWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TKEYVALUES to fetch.
     * 
    **/
    orderBy?: Enumerable<TKEYVALUESOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TKEYVALUESWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TKEYVALUES from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TKEYVALUES.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TKEYVALUES
    **/
    _count?: true | TKEYVALUESCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TKEYVALUESAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TKEYVALUESSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TKEYVALUESMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TKEYVALUESMaxAggregateInputType
  }

  export type GetTKEYVALUESAggregateType<T extends TKEYVALUESAggregateArgs> = {
        [P in keyof T & keyof AggregateTKEYVALUES]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTKEYVALUES[P]>
      : GetScalarType<T[P], AggregateTKEYVALUES[P]>
  }




  export type TKEYVALUESGroupByArgs = {
    where?: TKEYVALUESWhereInput
    orderBy?: Enumerable<TKEYVALUESOrderByWithAggregationInput>
    by: Array<TKEYVALUESScalarFieldEnum>
    having?: TKEYVALUESScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TKEYVALUESCountAggregateInputType | true
    _avg?: TKEYVALUESAvgAggregateInputType
    _sum?: TKEYVALUESSumAggregateInputType
    _min?: TKEYVALUESMinAggregateInputType
    _max?: TKEYVALUESMaxAggregateInputType
  }


  export type TKEYVALUESGroupByOutputType = {
    TABLENAME: string
    KEYVALUE: number
    _count: TKEYVALUESCountAggregateOutputType | null
    _avg: TKEYVALUESAvgAggregateOutputType | null
    _sum: TKEYVALUESSumAggregateOutputType | null
    _min: TKEYVALUESMinAggregateOutputType | null
    _max: TKEYVALUESMaxAggregateOutputType | null
  }

  type GetTKEYVALUESGroupByPayload<T extends TKEYVALUESGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TKEYVALUESGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TKEYVALUESGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TKEYVALUESGroupByOutputType[P]>
            : GetScalarType<T[P], TKEYVALUESGroupByOutputType[P]>
        }
      >
    >


  export type TKEYVALUESSelect = {
    TABLENAME?: boolean
    KEYVALUE?: boolean
  }

  export type TKEYVALUESGetPayload<
    S extends boolean | null | undefined | TKEYVALUESArgs,
    U = keyof S
      > = S extends true
        ? TKEYVALUES
    : S extends undefined
    ? never
    : S extends TKEYVALUESArgs | TKEYVALUESFindManyArgs
    ?'include' extends U
    ? TKEYVALUES 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TKEYVALUES ? TKEYVALUES[P] : never
  } 
    : TKEYVALUES
  : TKEYVALUES


  type TKEYVALUESCountArgs = Merge<
    Omit<TKEYVALUESFindManyArgs, 'select' | 'include'> & {
      select?: TKEYVALUESCountAggregateInputType | true
    }
  >

  export interface TKEYVALUESDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TKEYVALUES that matches the filter.
     * @param {TKEYVALUESFindUniqueArgs} args - Arguments to find a TKEYVALUES
     * @example
     * // Get one TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TKEYVALUESFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TKEYVALUESFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TKEYVALUES'> extends True ? CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES>, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T>>> : CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES | null >, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T> | null >>

    /**
     * Find the first TKEYVALUES that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TKEYVALUESFindFirstArgs} args - Arguments to find a TKEYVALUES
     * @example
     * // Get one TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TKEYVALUESFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TKEYVALUESFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TKEYVALUES'> extends True ? CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES>, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T>>> : CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES | null >, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T> | null >>

    /**
     * Find zero or more TKEYVALUES that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TKEYVALUESFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.findMany()
     * 
     * // Get first 10 TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.findMany({ take: 10 })
     * 
     * // Only select the `TABLENAME`
     * const tKEYVALUESWithTABLENAMEOnly = await prisma.tKEYVALUES.findMany({ select: { TABLENAME: true } })
     * 
    **/
    findMany<T extends TKEYVALUESFindManyArgs>(
      args?: SelectSubset<T, TKEYVALUESFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TKEYVALUES>>, PrismaPromise<Array<TKEYVALUESGetPayload<T>>>>

    /**
     * Create a TKEYVALUES.
     * @param {TKEYVALUESCreateArgs} args - Arguments to create a TKEYVALUES.
     * @example
     * // Create one TKEYVALUES
     * const TKEYVALUES = await prisma.tKEYVALUES.create({
     *   data: {
     *     // ... data to create a TKEYVALUES
     *   }
     * })
     * 
    **/
    create<T extends TKEYVALUESCreateArgs>(
      args: SelectSubset<T, TKEYVALUESCreateArgs>
    ): CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES>, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T>>>

    /**
     * Delete a TKEYVALUES.
     * @param {TKEYVALUESDeleteArgs} args - Arguments to delete one TKEYVALUES.
     * @example
     * // Delete one TKEYVALUES
     * const TKEYVALUES = await prisma.tKEYVALUES.delete({
     *   where: {
     *     // ... filter to delete one TKEYVALUES
     *   }
     * })
     * 
    **/
    delete<T extends TKEYVALUESDeleteArgs>(
      args: SelectSubset<T, TKEYVALUESDeleteArgs>
    ): CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES>, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T>>>

    /**
     * Update one TKEYVALUES.
     * @param {TKEYVALUESUpdateArgs} args - Arguments to update one TKEYVALUES.
     * @example
     * // Update one TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TKEYVALUESUpdateArgs>(
      args: SelectSubset<T, TKEYVALUESUpdateArgs>
    ): CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES>, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T>>>

    /**
     * Delete zero or more TKEYVALUES.
     * @param {TKEYVALUESDeleteManyArgs} args - Arguments to filter TKEYVALUES to delete.
     * @example
     * // Delete a few TKEYVALUES
     * const { count } = await prisma.tKEYVALUES.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TKEYVALUESDeleteManyArgs>(
      args?: SelectSubset<T, TKEYVALUESDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TKEYVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TKEYVALUESUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TKEYVALUESUpdateManyArgs>(
      args: SelectSubset<T, TKEYVALUESUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TKEYVALUES.
     * @param {TKEYVALUESUpsertArgs} args - Arguments to update or create a TKEYVALUES.
     * @example
     * // Update or create a TKEYVALUES
     * const tKEYVALUES = await prisma.tKEYVALUES.upsert({
     *   create: {
     *     // ... data to create a TKEYVALUES
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TKEYVALUES we want to update
     *   }
     * })
    **/
    upsert<T extends TKEYVALUESUpsertArgs>(
      args: SelectSubset<T, TKEYVALUESUpsertArgs>
    ): CheckSelect<T, Prisma__TKEYVALUESClient<TKEYVALUES>, Prisma__TKEYVALUESClient<TKEYVALUESGetPayload<T>>>

    /**
     * Count the number of TKEYVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TKEYVALUESCountArgs} args - Arguments to filter TKEYVALUES to count.
     * @example
     * // Count the number of TKEYVALUES
     * const count = await prisma.tKEYVALUES.count({
     *   where: {
     *     // ... the filter for the TKEYVALUES we want to count
     *   }
     * })
    **/
    count<T extends TKEYVALUESCountArgs>(
      args?: Subset<T, TKEYVALUESCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TKEYVALUESCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TKEYVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TKEYVALUESAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TKEYVALUESAggregateArgs>(args: Subset<T, TKEYVALUESAggregateArgs>): PrismaPromise<GetTKEYVALUESAggregateType<T>>

    /**
     * Group by TKEYVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TKEYVALUESGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TKEYVALUESGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TKEYVALUESGroupByArgs['orderBy'] }
        : { orderBy?: TKEYVALUESGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TKEYVALUESGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTKEYVALUESGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TKEYVALUES.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TKEYVALUESClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TKEYVALUES findUnique
   */
  export type TKEYVALUESFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * Throw an Error if a TKEYVALUES can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TKEYVALUES to fetch.
     * 
    **/
    where: TKEYVALUESWhereUniqueInput
  }


  /**
   * TKEYVALUES findFirst
   */
  export type TKEYVALUESFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * Throw an Error if a TKEYVALUES can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TKEYVALUES to fetch.
     * 
    **/
    where?: TKEYVALUESWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TKEYVALUES to fetch.
     * 
    **/
    orderBy?: Enumerable<TKEYVALUESOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TKEYVALUES.
     * 
    **/
    cursor?: TKEYVALUESWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TKEYVALUES from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TKEYVALUES.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TKEYVALUES.
     * 
    **/
    distinct?: Enumerable<TKEYVALUESScalarFieldEnum>
  }


  /**
   * TKEYVALUES findMany
   */
  export type TKEYVALUESFindManyArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * Filter, which TKEYVALUES to fetch.
     * 
    **/
    where?: TKEYVALUESWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TKEYVALUES to fetch.
     * 
    **/
    orderBy?: Enumerable<TKEYVALUESOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TKEYVALUES.
     * 
    **/
    cursor?: TKEYVALUESWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TKEYVALUES from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TKEYVALUES.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TKEYVALUESScalarFieldEnum>
  }


  /**
   * TKEYVALUES create
   */
  export type TKEYVALUESCreateArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * The data needed to create a TKEYVALUES.
     * 
    **/
    data: XOR<TKEYVALUESCreateInput, TKEYVALUESUncheckedCreateInput>
  }


  /**
   * TKEYVALUES update
   */
  export type TKEYVALUESUpdateArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * The data needed to update a TKEYVALUES.
     * 
    **/
    data: XOR<TKEYVALUESUpdateInput, TKEYVALUESUncheckedUpdateInput>
    /**
     * Choose, which TKEYVALUES to update.
     * 
    **/
    where: TKEYVALUESWhereUniqueInput
  }


  /**
   * TKEYVALUES updateMany
   */
  export type TKEYVALUESUpdateManyArgs = {
    /**
     * The data used to update TKEYVALUES.
     * 
    **/
    data: XOR<TKEYVALUESUpdateManyMutationInput, TKEYVALUESUncheckedUpdateManyInput>
    /**
     * Filter which TKEYVALUES to update
     * 
    **/
    where?: TKEYVALUESWhereInput
  }


  /**
   * TKEYVALUES upsert
   */
  export type TKEYVALUESUpsertArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * The filter to search for the TKEYVALUES to update in case it exists.
     * 
    **/
    where: TKEYVALUESWhereUniqueInput
    /**
     * In case the TKEYVALUES found by the `where` argument doesn't exist, create a new TKEYVALUES with this data.
     * 
    **/
    create: XOR<TKEYVALUESCreateInput, TKEYVALUESUncheckedCreateInput>
    /**
     * In case the TKEYVALUES was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TKEYVALUESUpdateInput, TKEYVALUESUncheckedUpdateInput>
  }


  /**
   * TKEYVALUES delete
   */
  export type TKEYVALUESDeleteArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
    /**
     * Filter which TKEYVALUES to delete.
     * 
    **/
    where: TKEYVALUESWhereUniqueInput
  }


  /**
   * TKEYVALUES deleteMany
   */
  export type TKEYVALUESDeleteManyArgs = {
    /**
     * Filter which TKEYVALUES to delete
     * 
    **/
    where?: TKEYVALUESWhereInput
  }


  /**
   * TKEYVALUES without action
   */
  export type TKEYVALUESArgs = {
    /**
     * Select specific fields to fetch from the TKEYVALUES
     * 
    **/
    select?: TKEYVALUESSelect | null
  }



  /**
   * Model TPARAMETERS
   */


  export type AggregateTPARAMETERS = {
    _count: TPARAMETERSCountAggregateOutputType | null
    _min: TPARAMETERSMinAggregateOutputType | null
    _max: TPARAMETERSMaxAggregateOutputType | null
  }

  export type TPARAMETERSMinAggregateOutputType = {
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TPARAMETERSMaxAggregateOutputType = {
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TPARAMETERSCountAggregateOutputType = {
    C_PARAM: number
    C_VALUE: number
    _all: number
  }


  export type TPARAMETERSMinAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TPARAMETERSMaxAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TPARAMETERSCountAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
    _all?: true
  }

  export type TPARAMETERSAggregateArgs = {
    /**
     * Filter which TPARAMETERS to aggregate.
     * 
    **/
    where?: TPARAMETERSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TPARAMETERS to fetch.
     * 
    **/
    orderBy?: Enumerable<TPARAMETERSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TPARAMETERSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TPARAMETERS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TPARAMETERS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TPARAMETERS
    **/
    _count?: true | TPARAMETERSCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TPARAMETERSMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TPARAMETERSMaxAggregateInputType
  }

  export type GetTPARAMETERSAggregateType<T extends TPARAMETERSAggregateArgs> = {
        [P in keyof T & keyof AggregateTPARAMETERS]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTPARAMETERS[P]>
      : GetScalarType<T[P], AggregateTPARAMETERS[P]>
  }




  export type TPARAMETERSGroupByArgs = {
    where?: TPARAMETERSWhereInput
    orderBy?: Enumerable<TPARAMETERSOrderByWithAggregationInput>
    by: Array<TPARAMETERSScalarFieldEnum>
    having?: TPARAMETERSScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TPARAMETERSCountAggregateInputType | true
    _min?: TPARAMETERSMinAggregateInputType
    _max?: TPARAMETERSMaxAggregateInputType
  }


  export type TPARAMETERSGroupByOutputType = {
    C_PARAM: string
    C_VALUE: string | null
    _count: TPARAMETERSCountAggregateOutputType | null
    _min: TPARAMETERSMinAggregateOutputType | null
    _max: TPARAMETERSMaxAggregateOutputType | null
  }

  type GetTPARAMETERSGroupByPayload<T extends TPARAMETERSGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TPARAMETERSGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TPARAMETERSGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TPARAMETERSGroupByOutputType[P]>
            : GetScalarType<T[P], TPARAMETERSGroupByOutputType[P]>
        }
      >
    >


  export type TPARAMETERSSelect = {
    C_PARAM?: boolean
    C_VALUE?: boolean
  }

  export type TPARAMETERSGetPayload<
    S extends boolean | null | undefined | TPARAMETERSArgs,
    U = keyof S
      > = S extends true
        ? TPARAMETERS
    : S extends undefined
    ? never
    : S extends TPARAMETERSArgs | TPARAMETERSFindManyArgs
    ?'include' extends U
    ? TPARAMETERS 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TPARAMETERS ? TPARAMETERS[P] : never
  } 
    : TPARAMETERS
  : TPARAMETERS


  type TPARAMETERSCountArgs = Merge<
    Omit<TPARAMETERSFindManyArgs, 'select' | 'include'> & {
      select?: TPARAMETERSCountAggregateInputType | true
    }
  >

  export interface TPARAMETERSDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TPARAMETERS that matches the filter.
     * @param {TPARAMETERSFindUniqueArgs} args - Arguments to find a TPARAMETERS
     * @example
     * // Get one TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TPARAMETERSFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TPARAMETERSFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TPARAMETERS'> extends True ? CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS>, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T>>> : CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS | null >, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T> | null >>

    /**
     * Find the first TPARAMETERS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERSFindFirstArgs} args - Arguments to find a TPARAMETERS
     * @example
     * // Get one TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TPARAMETERSFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TPARAMETERSFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TPARAMETERS'> extends True ? CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS>, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T>>> : CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS | null >, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T> | null >>

    /**
     * Find zero or more TPARAMETERS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERSFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.findMany()
     * 
     * // Get first 10 TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.findMany({ take: 10 })
     * 
     * // Only select the `C_PARAM`
     * const tPARAMETERSWithC_PARAMOnly = await prisma.tPARAMETERS.findMany({ select: { C_PARAM: true } })
     * 
    **/
    findMany<T extends TPARAMETERSFindManyArgs>(
      args?: SelectSubset<T, TPARAMETERSFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TPARAMETERS>>, PrismaPromise<Array<TPARAMETERSGetPayload<T>>>>

    /**
     * Create a TPARAMETERS.
     * @param {TPARAMETERSCreateArgs} args - Arguments to create a TPARAMETERS.
     * @example
     * // Create one TPARAMETERS
     * const TPARAMETERS = await prisma.tPARAMETERS.create({
     *   data: {
     *     // ... data to create a TPARAMETERS
     *   }
     * })
     * 
    **/
    create<T extends TPARAMETERSCreateArgs>(
      args: SelectSubset<T, TPARAMETERSCreateArgs>
    ): CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS>, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T>>>

    /**
     * Delete a TPARAMETERS.
     * @param {TPARAMETERSDeleteArgs} args - Arguments to delete one TPARAMETERS.
     * @example
     * // Delete one TPARAMETERS
     * const TPARAMETERS = await prisma.tPARAMETERS.delete({
     *   where: {
     *     // ... filter to delete one TPARAMETERS
     *   }
     * })
     * 
    **/
    delete<T extends TPARAMETERSDeleteArgs>(
      args: SelectSubset<T, TPARAMETERSDeleteArgs>
    ): CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS>, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T>>>

    /**
     * Update one TPARAMETERS.
     * @param {TPARAMETERSUpdateArgs} args - Arguments to update one TPARAMETERS.
     * @example
     * // Update one TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TPARAMETERSUpdateArgs>(
      args: SelectSubset<T, TPARAMETERSUpdateArgs>
    ): CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS>, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T>>>

    /**
     * Delete zero or more TPARAMETERS.
     * @param {TPARAMETERSDeleteManyArgs} args - Arguments to filter TPARAMETERS to delete.
     * @example
     * // Delete a few TPARAMETERS
     * const { count } = await prisma.tPARAMETERS.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TPARAMETERSDeleteManyArgs>(
      args?: SelectSubset<T, TPARAMETERSDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERSUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TPARAMETERSUpdateManyArgs>(
      args: SelectSubset<T, TPARAMETERSUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TPARAMETERS.
     * @param {TPARAMETERSUpsertArgs} args - Arguments to update or create a TPARAMETERS.
     * @example
     * // Update or create a TPARAMETERS
     * const tPARAMETERS = await prisma.tPARAMETERS.upsert({
     *   create: {
     *     // ... data to create a TPARAMETERS
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TPARAMETERS we want to update
     *   }
     * })
    **/
    upsert<T extends TPARAMETERSUpsertArgs>(
      args: SelectSubset<T, TPARAMETERSUpsertArgs>
    ): CheckSelect<T, Prisma__TPARAMETERSClient<TPARAMETERS>, Prisma__TPARAMETERSClient<TPARAMETERSGetPayload<T>>>

    /**
     * Count the number of TPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERSCountArgs} args - Arguments to filter TPARAMETERS to count.
     * @example
     * // Count the number of TPARAMETERS
     * const count = await prisma.tPARAMETERS.count({
     *   where: {
     *     // ... the filter for the TPARAMETERS we want to count
     *   }
     * })
    **/
    count<T extends TPARAMETERSCountArgs>(
      args?: Subset<T, TPARAMETERSCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TPARAMETERSCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERSAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TPARAMETERSAggregateArgs>(args: Subset<T, TPARAMETERSAggregateArgs>): PrismaPromise<GetTPARAMETERSAggregateType<T>>

    /**
     * Group by TPARAMETERS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERSGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TPARAMETERSGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TPARAMETERSGroupByArgs['orderBy'] }
        : { orderBy?: TPARAMETERSGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TPARAMETERSGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTPARAMETERSGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TPARAMETERS.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TPARAMETERSClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TPARAMETERS findUnique
   */
  export type TPARAMETERSFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * Throw an Error if a TPARAMETERS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TPARAMETERS to fetch.
     * 
    **/
    where: TPARAMETERSWhereUniqueInput
  }


  /**
   * TPARAMETERS findFirst
   */
  export type TPARAMETERSFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * Throw an Error if a TPARAMETERS can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TPARAMETERS to fetch.
     * 
    **/
    where?: TPARAMETERSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TPARAMETERS to fetch.
     * 
    **/
    orderBy?: Enumerable<TPARAMETERSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TPARAMETERS.
     * 
    **/
    cursor?: TPARAMETERSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TPARAMETERS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TPARAMETERS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TPARAMETERS.
     * 
    **/
    distinct?: Enumerable<TPARAMETERSScalarFieldEnum>
  }


  /**
   * TPARAMETERS findMany
   */
  export type TPARAMETERSFindManyArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * Filter, which TPARAMETERS to fetch.
     * 
    **/
    where?: TPARAMETERSWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TPARAMETERS to fetch.
     * 
    **/
    orderBy?: Enumerable<TPARAMETERSOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TPARAMETERS.
     * 
    **/
    cursor?: TPARAMETERSWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TPARAMETERS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TPARAMETERS.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TPARAMETERSScalarFieldEnum>
  }


  /**
   * TPARAMETERS create
   */
  export type TPARAMETERSCreateArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * The data needed to create a TPARAMETERS.
     * 
    **/
    data: XOR<TPARAMETERSCreateInput, TPARAMETERSUncheckedCreateInput>
  }


  /**
   * TPARAMETERS update
   */
  export type TPARAMETERSUpdateArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * The data needed to update a TPARAMETERS.
     * 
    **/
    data: XOR<TPARAMETERSUpdateInput, TPARAMETERSUncheckedUpdateInput>
    /**
     * Choose, which TPARAMETERS to update.
     * 
    **/
    where: TPARAMETERSWhereUniqueInput
  }


  /**
   * TPARAMETERS updateMany
   */
  export type TPARAMETERSUpdateManyArgs = {
    /**
     * The data used to update TPARAMETERS.
     * 
    **/
    data: XOR<TPARAMETERSUpdateManyMutationInput, TPARAMETERSUncheckedUpdateManyInput>
    /**
     * Filter which TPARAMETERS to update
     * 
    **/
    where?: TPARAMETERSWhereInput
  }


  /**
   * TPARAMETERS upsert
   */
  export type TPARAMETERSUpsertArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * The filter to search for the TPARAMETERS to update in case it exists.
     * 
    **/
    where: TPARAMETERSWhereUniqueInput
    /**
     * In case the TPARAMETERS found by the `where` argument doesn't exist, create a new TPARAMETERS with this data.
     * 
    **/
    create: XOR<TPARAMETERSCreateInput, TPARAMETERSUncheckedCreateInput>
    /**
     * In case the TPARAMETERS was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TPARAMETERSUpdateInput, TPARAMETERSUncheckedUpdateInput>
  }


  /**
   * TPARAMETERS delete
   */
  export type TPARAMETERSDeleteArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
    /**
     * Filter which TPARAMETERS to delete.
     * 
    **/
    where: TPARAMETERSWhereUniqueInput
  }


  /**
   * TPARAMETERS deleteMany
   */
  export type TPARAMETERSDeleteManyArgs = {
    /**
     * Filter which TPARAMETERS to delete
     * 
    **/
    where?: TPARAMETERSWhereInput
  }


  /**
   * TPARAMETERS without action
   */
  export type TPARAMETERSArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS
     * 
    **/
    select?: TPARAMETERSSelect | null
  }



  /**
   * Model TPARAMETERS_HEAT
   */


  export type AggregateTPARAMETERS_HEAT = {
    _count: TPARAMETERS_HEATCountAggregateOutputType | null
    _min: TPARAMETERS_HEATMinAggregateOutputType | null
    _max: TPARAMETERS_HEATMaxAggregateOutputType | null
  }

  export type TPARAMETERS_HEATMinAggregateOutputType = {
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TPARAMETERS_HEATMaxAggregateOutputType = {
    C_PARAM: string | null
    C_VALUE: string | null
  }

  export type TPARAMETERS_HEATCountAggregateOutputType = {
    C_PARAM: number
    C_VALUE: number
    _all: number
  }


  export type TPARAMETERS_HEATMinAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TPARAMETERS_HEATMaxAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
  }

  export type TPARAMETERS_HEATCountAggregateInputType = {
    C_PARAM?: true
    C_VALUE?: true
    _all?: true
  }

  export type TPARAMETERS_HEATAggregateArgs = {
    /**
     * Filter which TPARAMETERS_HEAT to aggregate.
     * 
    **/
    where?: TPARAMETERS_HEATWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TPARAMETERS_HEATS to fetch.
     * 
    **/
    orderBy?: Enumerable<TPARAMETERS_HEATOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TPARAMETERS_HEATWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TPARAMETERS_HEATS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TPARAMETERS_HEATS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TPARAMETERS_HEATS
    **/
    _count?: true | TPARAMETERS_HEATCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TPARAMETERS_HEATMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TPARAMETERS_HEATMaxAggregateInputType
  }

  export type GetTPARAMETERS_HEATAggregateType<T extends TPARAMETERS_HEATAggregateArgs> = {
        [P in keyof T & keyof AggregateTPARAMETERS_HEAT]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTPARAMETERS_HEAT[P]>
      : GetScalarType<T[P], AggregateTPARAMETERS_HEAT[P]>
  }




  export type TPARAMETERS_HEATGroupByArgs = {
    where?: TPARAMETERS_HEATWhereInput
    orderBy?: Enumerable<TPARAMETERS_HEATOrderByWithAggregationInput>
    by: Array<TPARAMETERS_HEATScalarFieldEnum>
    having?: TPARAMETERS_HEATScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TPARAMETERS_HEATCountAggregateInputType | true
    _min?: TPARAMETERS_HEATMinAggregateInputType
    _max?: TPARAMETERS_HEATMaxAggregateInputType
  }


  export type TPARAMETERS_HEATGroupByOutputType = {
    C_PARAM: string
    C_VALUE: string | null
    _count: TPARAMETERS_HEATCountAggregateOutputType | null
    _min: TPARAMETERS_HEATMinAggregateOutputType | null
    _max: TPARAMETERS_HEATMaxAggregateOutputType | null
  }

  type GetTPARAMETERS_HEATGroupByPayload<T extends TPARAMETERS_HEATGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TPARAMETERS_HEATGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TPARAMETERS_HEATGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TPARAMETERS_HEATGroupByOutputType[P]>
            : GetScalarType<T[P], TPARAMETERS_HEATGroupByOutputType[P]>
        }
      >
    >


  export type TPARAMETERS_HEATSelect = {
    C_PARAM?: boolean
    C_VALUE?: boolean
  }

  export type TPARAMETERS_HEATGetPayload<
    S extends boolean | null | undefined | TPARAMETERS_HEATArgs,
    U = keyof S
      > = S extends true
        ? TPARAMETERS_HEAT
    : S extends undefined
    ? never
    : S extends TPARAMETERS_HEATArgs | TPARAMETERS_HEATFindManyArgs
    ?'include' extends U
    ? TPARAMETERS_HEAT 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TPARAMETERS_HEAT ? TPARAMETERS_HEAT[P] : never
  } 
    : TPARAMETERS_HEAT
  : TPARAMETERS_HEAT


  type TPARAMETERS_HEATCountArgs = Merge<
    Omit<TPARAMETERS_HEATFindManyArgs, 'select' | 'include'> & {
      select?: TPARAMETERS_HEATCountAggregateInputType | true
    }
  >

  export interface TPARAMETERS_HEATDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TPARAMETERS_HEAT that matches the filter.
     * @param {TPARAMETERS_HEATFindUniqueArgs} args - Arguments to find a TPARAMETERS_HEAT
     * @example
     * // Get one TPARAMETERS_HEAT
     * const tPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TPARAMETERS_HEATFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TPARAMETERS_HEATFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TPARAMETERS_HEAT'> extends True ? CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT>, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T>>> : CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT | null >, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T> | null >>

    /**
     * Find the first TPARAMETERS_HEAT that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERS_HEATFindFirstArgs} args - Arguments to find a TPARAMETERS_HEAT
     * @example
     * // Get one TPARAMETERS_HEAT
     * const tPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TPARAMETERS_HEATFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TPARAMETERS_HEATFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TPARAMETERS_HEAT'> extends True ? CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT>, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T>>> : CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT | null >, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T> | null >>

    /**
     * Find zero or more TPARAMETERS_HEATS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERS_HEATFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TPARAMETERS_HEATS
     * const tPARAMETERS_HEATS = await prisma.tPARAMETERS_HEAT.findMany()
     * 
     * // Get first 10 TPARAMETERS_HEATS
     * const tPARAMETERS_HEATS = await prisma.tPARAMETERS_HEAT.findMany({ take: 10 })
     * 
     * // Only select the `C_PARAM`
     * const tPARAMETERS_HEATWithC_PARAMOnly = await prisma.tPARAMETERS_HEAT.findMany({ select: { C_PARAM: true } })
     * 
    **/
    findMany<T extends TPARAMETERS_HEATFindManyArgs>(
      args?: SelectSubset<T, TPARAMETERS_HEATFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TPARAMETERS_HEAT>>, PrismaPromise<Array<TPARAMETERS_HEATGetPayload<T>>>>

    /**
     * Create a TPARAMETERS_HEAT.
     * @param {TPARAMETERS_HEATCreateArgs} args - Arguments to create a TPARAMETERS_HEAT.
     * @example
     * // Create one TPARAMETERS_HEAT
     * const TPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.create({
     *   data: {
     *     // ... data to create a TPARAMETERS_HEAT
     *   }
     * })
     * 
    **/
    create<T extends TPARAMETERS_HEATCreateArgs>(
      args: SelectSubset<T, TPARAMETERS_HEATCreateArgs>
    ): CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT>, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T>>>

    /**
     * Delete a TPARAMETERS_HEAT.
     * @param {TPARAMETERS_HEATDeleteArgs} args - Arguments to delete one TPARAMETERS_HEAT.
     * @example
     * // Delete one TPARAMETERS_HEAT
     * const TPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.delete({
     *   where: {
     *     // ... filter to delete one TPARAMETERS_HEAT
     *   }
     * })
     * 
    **/
    delete<T extends TPARAMETERS_HEATDeleteArgs>(
      args: SelectSubset<T, TPARAMETERS_HEATDeleteArgs>
    ): CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT>, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T>>>

    /**
     * Update one TPARAMETERS_HEAT.
     * @param {TPARAMETERS_HEATUpdateArgs} args - Arguments to update one TPARAMETERS_HEAT.
     * @example
     * // Update one TPARAMETERS_HEAT
     * const tPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TPARAMETERS_HEATUpdateArgs>(
      args: SelectSubset<T, TPARAMETERS_HEATUpdateArgs>
    ): CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT>, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T>>>

    /**
     * Delete zero or more TPARAMETERS_HEATS.
     * @param {TPARAMETERS_HEATDeleteManyArgs} args - Arguments to filter TPARAMETERS_HEATS to delete.
     * @example
     * // Delete a few TPARAMETERS_HEATS
     * const { count } = await prisma.tPARAMETERS_HEAT.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TPARAMETERS_HEATDeleteManyArgs>(
      args?: SelectSubset<T, TPARAMETERS_HEATDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TPARAMETERS_HEATS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERS_HEATUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TPARAMETERS_HEATS
     * const tPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TPARAMETERS_HEATUpdateManyArgs>(
      args: SelectSubset<T, TPARAMETERS_HEATUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TPARAMETERS_HEAT.
     * @param {TPARAMETERS_HEATUpsertArgs} args - Arguments to update or create a TPARAMETERS_HEAT.
     * @example
     * // Update or create a TPARAMETERS_HEAT
     * const tPARAMETERS_HEAT = await prisma.tPARAMETERS_HEAT.upsert({
     *   create: {
     *     // ... data to create a TPARAMETERS_HEAT
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TPARAMETERS_HEAT we want to update
     *   }
     * })
    **/
    upsert<T extends TPARAMETERS_HEATUpsertArgs>(
      args: SelectSubset<T, TPARAMETERS_HEATUpsertArgs>
    ): CheckSelect<T, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEAT>, Prisma__TPARAMETERS_HEATClient<TPARAMETERS_HEATGetPayload<T>>>

    /**
     * Count the number of TPARAMETERS_HEATS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERS_HEATCountArgs} args - Arguments to filter TPARAMETERS_HEATS to count.
     * @example
     * // Count the number of TPARAMETERS_HEATS
     * const count = await prisma.tPARAMETERS_HEAT.count({
     *   where: {
     *     // ... the filter for the TPARAMETERS_HEATS we want to count
     *   }
     * })
    **/
    count<T extends TPARAMETERS_HEATCountArgs>(
      args?: Subset<T, TPARAMETERS_HEATCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TPARAMETERS_HEATCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TPARAMETERS_HEAT.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERS_HEATAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TPARAMETERS_HEATAggregateArgs>(args: Subset<T, TPARAMETERS_HEATAggregateArgs>): PrismaPromise<GetTPARAMETERS_HEATAggregateType<T>>

    /**
     * Group by TPARAMETERS_HEAT.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TPARAMETERS_HEATGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TPARAMETERS_HEATGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TPARAMETERS_HEATGroupByArgs['orderBy'] }
        : { orderBy?: TPARAMETERS_HEATGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TPARAMETERS_HEATGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTPARAMETERS_HEATGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TPARAMETERS_HEAT.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TPARAMETERS_HEATClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TPARAMETERS_HEAT findUnique
   */
  export type TPARAMETERS_HEATFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * Throw an Error if a TPARAMETERS_HEAT can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TPARAMETERS_HEAT to fetch.
     * 
    **/
    where: TPARAMETERS_HEATWhereUniqueInput
  }


  /**
   * TPARAMETERS_HEAT findFirst
   */
  export type TPARAMETERS_HEATFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * Throw an Error if a TPARAMETERS_HEAT can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TPARAMETERS_HEAT to fetch.
     * 
    **/
    where?: TPARAMETERS_HEATWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TPARAMETERS_HEATS to fetch.
     * 
    **/
    orderBy?: Enumerable<TPARAMETERS_HEATOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TPARAMETERS_HEATS.
     * 
    **/
    cursor?: TPARAMETERS_HEATWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TPARAMETERS_HEATS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TPARAMETERS_HEATS.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TPARAMETERS_HEATS.
     * 
    **/
    distinct?: Enumerable<TPARAMETERS_HEATScalarFieldEnum>
  }


  /**
   * TPARAMETERS_HEAT findMany
   */
  export type TPARAMETERS_HEATFindManyArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * Filter, which TPARAMETERS_HEATS to fetch.
     * 
    **/
    where?: TPARAMETERS_HEATWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TPARAMETERS_HEATS to fetch.
     * 
    **/
    orderBy?: Enumerable<TPARAMETERS_HEATOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TPARAMETERS_HEATS.
     * 
    **/
    cursor?: TPARAMETERS_HEATWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TPARAMETERS_HEATS from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TPARAMETERS_HEATS.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TPARAMETERS_HEATScalarFieldEnum>
  }


  /**
   * TPARAMETERS_HEAT create
   */
  export type TPARAMETERS_HEATCreateArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * The data needed to create a TPARAMETERS_HEAT.
     * 
    **/
    data: XOR<TPARAMETERS_HEATCreateInput, TPARAMETERS_HEATUncheckedCreateInput>
  }


  /**
   * TPARAMETERS_HEAT update
   */
  export type TPARAMETERS_HEATUpdateArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * The data needed to update a TPARAMETERS_HEAT.
     * 
    **/
    data: XOR<TPARAMETERS_HEATUpdateInput, TPARAMETERS_HEATUncheckedUpdateInput>
    /**
     * Choose, which TPARAMETERS_HEAT to update.
     * 
    **/
    where: TPARAMETERS_HEATWhereUniqueInput
  }


  /**
   * TPARAMETERS_HEAT updateMany
   */
  export type TPARAMETERS_HEATUpdateManyArgs = {
    /**
     * The data used to update TPARAMETERS_HEATS.
     * 
    **/
    data: XOR<TPARAMETERS_HEATUpdateManyMutationInput, TPARAMETERS_HEATUncheckedUpdateManyInput>
    /**
     * Filter which TPARAMETERS_HEATS to update
     * 
    **/
    where?: TPARAMETERS_HEATWhereInput
  }


  /**
   * TPARAMETERS_HEAT upsert
   */
  export type TPARAMETERS_HEATUpsertArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * The filter to search for the TPARAMETERS_HEAT to update in case it exists.
     * 
    **/
    where: TPARAMETERS_HEATWhereUniqueInput
    /**
     * In case the TPARAMETERS_HEAT found by the `where` argument doesn't exist, create a new TPARAMETERS_HEAT with this data.
     * 
    **/
    create: XOR<TPARAMETERS_HEATCreateInput, TPARAMETERS_HEATUncheckedCreateInput>
    /**
     * In case the TPARAMETERS_HEAT was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TPARAMETERS_HEATUpdateInput, TPARAMETERS_HEATUncheckedUpdateInput>
  }


  /**
   * TPARAMETERS_HEAT delete
   */
  export type TPARAMETERS_HEATDeleteArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
    /**
     * Filter which TPARAMETERS_HEAT to delete.
     * 
    **/
    where: TPARAMETERS_HEATWhereUniqueInput
  }


  /**
   * TPARAMETERS_HEAT deleteMany
   */
  export type TPARAMETERS_HEATDeleteManyArgs = {
    /**
     * Filter which TPARAMETERS_HEATS to delete
     * 
    **/
    where?: TPARAMETERS_HEATWhereInput
  }


  /**
   * TPARAMETERS_HEAT without action
   */
  export type TPARAMETERS_HEATArgs = {
    /**
     * Select specific fields to fetch from the TPARAMETERS_HEAT
     * 
    **/
    select?: TPARAMETERS_HEATSelect | null
  }



  /**
   * Model TUPDATEVALUES
   */


  export type AggregateTUPDATEVALUES = {
    _count: TUPDATEVALUESCountAggregateOutputType | null
    _avg: TUPDATEVALUESAvgAggregateOutputType | null
    _sum: TUPDATEVALUESSumAggregateOutputType | null
    _min: TUPDATEVALUESMinAggregateOutputType | null
    _max: TUPDATEVALUESMaxAggregateOutputType | null
  }

  export type TUPDATEVALUESAvgAggregateOutputType = {
    UPDATEVALUE: number | null
  }

  export type TUPDATEVALUESSumAggregateOutputType = {
    UPDATEVALUE: number | null
  }

  export type TUPDATEVALUESMinAggregateOutputType = {
    TABLENAME: string | null
    UPDATEVALUE: number | null
  }

  export type TUPDATEVALUESMaxAggregateOutputType = {
    TABLENAME: string | null
    UPDATEVALUE: number | null
  }

  export type TUPDATEVALUESCountAggregateOutputType = {
    TABLENAME: number
    UPDATEVALUE: number
    _all: number
  }


  export type TUPDATEVALUESAvgAggregateInputType = {
    UPDATEVALUE?: true
  }

  export type TUPDATEVALUESSumAggregateInputType = {
    UPDATEVALUE?: true
  }

  export type TUPDATEVALUESMinAggregateInputType = {
    TABLENAME?: true
    UPDATEVALUE?: true
  }

  export type TUPDATEVALUESMaxAggregateInputType = {
    TABLENAME?: true
    UPDATEVALUE?: true
  }

  export type TUPDATEVALUESCountAggregateInputType = {
    TABLENAME?: true
    UPDATEVALUE?: true
    _all?: true
  }

  export type TUPDATEVALUESAggregateArgs = {
    /**
     * Filter which TUPDATEVALUES to aggregate.
     * 
    **/
    where?: TUPDATEVALUESWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TUPDATEVALUES to fetch.
     * 
    **/
    orderBy?: Enumerable<TUPDATEVALUESOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: TUPDATEVALUESWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TUPDATEVALUES from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TUPDATEVALUES.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TUPDATEVALUES
    **/
    _count?: true | TUPDATEVALUESCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TUPDATEVALUESAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TUPDATEVALUESSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TUPDATEVALUESMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TUPDATEVALUESMaxAggregateInputType
  }

  export type GetTUPDATEVALUESAggregateType<T extends TUPDATEVALUESAggregateArgs> = {
        [P in keyof T & keyof AggregateTUPDATEVALUES]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTUPDATEVALUES[P]>
      : GetScalarType<T[P], AggregateTUPDATEVALUES[P]>
  }




  export type TUPDATEVALUESGroupByArgs = {
    where?: TUPDATEVALUESWhereInput
    orderBy?: Enumerable<TUPDATEVALUESOrderByWithAggregationInput>
    by: Array<TUPDATEVALUESScalarFieldEnum>
    having?: TUPDATEVALUESScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TUPDATEVALUESCountAggregateInputType | true
    _avg?: TUPDATEVALUESAvgAggregateInputType
    _sum?: TUPDATEVALUESSumAggregateInputType
    _min?: TUPDATEVALUESMinAggregateInputType
    _max?: TUPDATEVALUESMaxAggregateInputType
  }


  export type TUPDATEVALUESGroupByOutputType = {
    TABLENAME: string
    UPDATEVALUE: number
    _count: TUPDATEVALUESCountAggregateOutputType | null
    _avg: TUPDATEVALUESAvgAggregateOutputType | null
    _sum: TUPDATEVALUESSumAggregateOutputType | null
    _min: TUPDATEVALUESMinAggregateOutputType | null
    _max: TUPDATEVALUESMaxAggregateOutputType | null
  }

  type GetTUPDATEVALUESGroupByPayload<T extends TUPDATEVALUESGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TUPDATEVALUESGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TUPDATEVALUESGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TUPDATEVALUESGroupByOutputType[P]>
            : GetScalarType<T[P], TUPDATEVALUESGroupByOutputType[P]>
        }
      >
    >


  export type TUPDATEVALUESSelect = {
    TABLENAME?: boolean
    UPDATEVALUE?: boolean
  }

  export type TUPDATEVALUESGetPayload<
    S extends boolean | null | undefined | TUPDATEVALUESArgs,
    U = keyof S
      > = S extends true
        ? TUPDATEVALUES
    : S extends undefined
    ? never
    : S extends TUPDATEVALUESArgs | TUPDATEVALUESFindManyArgs
    ?'include' extends U
    ? TUPDATEVALUES 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof TUPDATEVALUES ? TUPDATEVALUES[P] : never
  } 
    : TUPDATEVALUES
  : TUPDATEVALUES


  type TUPDATEVALUESCountArgs = Merge<
    Omit<TUPDATEVALUESFindManyArgs, 'select' | 'include'> & {
      select?: TUPDATEVALUESCountAggregateInputType | true
    }
  >

  export interface TUPDATEVALUESDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one TUPDATEVALUES that matches the filter.
     * @param {TUPDATEVALUESFindUniqueArgs} args - Arguments to find a TUPDATEVALUES
     * @example
     * // Get one TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TUPDATEVALUESFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TUPDATEVALUESFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TUPDATEVALUES'> extends True ? CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES>, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T>>> : CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES | null >, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T> | null >>

    /**
     * Find the first TUPDATEVALUES that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TUPDATEVALUESFindFirstArgs} args - Arguments to find a TUPDATEVALUES
     * @example
     * // Get one TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TUPDATEVALUESFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TUPDATEVALUESFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TUPDATEVALUES'> extends True ? CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES>, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T>>> : CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES | null >, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T> | null >>

    /**
     * Find zero or more TUPDATEVALUES that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TUPDATEVALUESFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.findMany()
     * 
     * // Get first 10 TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.findMany({ take: 10 })
     * 
     * // Only select the `TABLENAME`
     * const tUPDATEVALUESWithTABLENAMEOnly = await prisma.tUPDATEVALUES.findMany({ select: { TABLENAME: true } })
     * 
    **/
    findMany<T extends TUPDATEVALUESFindManyArgs>(
      args?: SelectSubset<T, TUPDATEVALUESFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<TUPDATEVALUES>>, PrismaPromise<Array<TUPDATEVALUESGetPayload<T>>>>

    /**
     * Create a TUPDATEVALUES.
     * @param {TUPDATEVALUESCreateArgs} args - Arguments to create a TUPDATEVALUES.
     * @example
     * // Create one TUPDATEVALUES
     * const TUPDATEVALUES = await prisma.tUPDATEVALUES.create({
     *   data: {
     *     // ... data to create a TUPDATEVALUES
     *   }
     * })
     * 
    **/
    create<T extends TUPDATEVALUESCreateArgs>(
      args: SelectSubset<T, TUPDATEVALUESCreateArgs>
    ): CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES>, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T>>>

    /**
     * Delete a TUPDATEVALUES.
     * @param {TUPDATEVALUESDeleteArgs} args - Arguments to delete one TUPDATEVALUES.
     * @example
     * // Delete one TUPDATEVALUES
     * const TUPDATEVALUES = await prisma.tUPDATEVALUES.delete({
     *   where: {
     *     // ... filter to delete one TUPDATEVALUES
     *   }
     * })
     * 
    **/
    delete<T extends TUPDATEVALUESDeleteArgs>(
      args: SelectSubset<T, TUPDATEVALUESDeleteArgs>
    ): CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES>, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T>>>

    /**
     * Update one TUPDATEVALUES.
     * @param {TUPDATEVALUESUpdateArgs} args - Arguments to update one TUPDATEVALUES.
     * @example
     * // Update one TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TUPDATEVALUESUpdateArgs>(
      args: SelectSubset<T, TUPDATEVALUESUpdateArgs>
    ): CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES>, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T>>>

    /**
     * Delete zero or more TUPDATEVALUES.
     * @param {TUPDATEVALUESDeleteManyArgs} args - Arguments to filter TUPDATEVALUES to delete.
     * @example
     * // Delete a few TUPDATEVALUES
     * const { count } = await prisma.tUPDATEVALUES.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TUPDATEVALUESDeleteManyArgs>(
      args?: SelectSubset<T, TUPDATEVALUESDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more TUPDATEVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TUPDATEVALUESUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TUPDATEVALUESUpdateManyArgs>(
      args: SelectSubset<T, TUPDATEVALUESUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one TUPDATEVALUES.
     * @param {TUPDATEVALUESUpsertArgs} args - Arguments to update or create a TUPDATEVALUES.
     * @example
     * // Update or create a TUPDATEVALUES
     * const tUPDATEVALUES = await prisma.tUPDATEVALUES.upsert({
     *   create: {
     *     // ... data to create a TUPDATEVALUES
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TUPDATEVALUES we want to update
     *   }
     * })
    **/
    upsert<T extends TUPDATEVALUESUpsertArgs>(
      args: SelectSubset<T, TUPDATEVALUESUpsertArgs>
    ): CheckSelect<T, Prisma__TUPDATEVALUESClient<TUPDATEVALUES>, Prisma__TUPDATEVALUESClient<TUPDATEVALUESGetPayload<T>>>

    /**
     * Count the number of TUPDATEVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TUPDATEVALUESCountArgs} args - Arguments to filter TUPDATEVALUES to count.
     * @example
     * // Count the number of TUPDATEVALUES
     * const count = await prisma.tUPDATEVALUES.count({
     *   where: {
     *     // ... the filter for the TUPDATEVALUES we want to count
     *   }
     * })
    **/
    count<T extends TUPDATEVALUESCountArgs>(
      args?: Subset<T, TUPDATEVALUESCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TUPDATEVALUESCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TUPDATEVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TUPDATEVALUESAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TUPDATEVALUESAggregateArgs>(args: Subset<T, TUPDATEVALUESAggregateArgs>): PrismaPromise<GetTUPDATEVALUESAggregateType<T>>

    /**
     * Group by TUPDATEVALUES.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TUPDATEVALUESGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TUPDATEVALUESGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TUPDATEVALUESGroupByArgs['orderBy'] }
        : { orderBy?: TUPDATEVALUESGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TUPDATEVALUESGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTUPDATEVALUESGroupByPayload<T> : PrismaPromise<InputErrors>
  }

  /**
   * The delegate class that acts as a "Promise-like" for TUPDATEVALUES.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TUPDATEVALUESClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';


    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * TUPDATEVALUES findUnique
   */
  export type TUPDATEVALUESFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * Throw an Error if a TUPDATEVALUES can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TUPDATEVALUES to fetch.
     * 
    **/
    where: TUPDATEVALUESWhereUniqueInput
  }


  /**
   * TUPDATEVALUES findFirst
   */
  export type TUPDATEVALUESFindFirstArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * Throw an Error if a TUPDATEVALUES can't be found
     * 
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which TUPDATEVALUES to fetch.
     * 
    **/
    where?: TUPDATEVALUESWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TUPDATEVALUES to fetch.
     * 
    **/
    orderBy?: Enumerable<TUPDATEVALUESOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TUPDATEVALUES.
     * 
    **/
    cursor?: TUPDATEVALUESWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TUPDATEVALUES from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TUPDATEVALUES.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TUPDATEVALUES.
     * 
    **/
    distinct?: Enumerable<TUPDATEVALUESScalarFieldEnum>
  }


  /**
   * TUPDATEVALUES findMany
   */
  export type TUPDATEVALUESFindManyArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * Filter, which TUPDATEVALUES to fetch.
     * 
    **/
    where?: TUPDATEVALUESWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TUPDATEVALUES to fetch.
     * 
    **/
    orderBy?: Enumerable<TUPDATEVALUESOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TUPDATEVALUES.
     * 
    **/
    cursor?: TUPDATEVALUESWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TUPDATEVALUES from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TUPDATEVALUES.
     * 
    **/
    skip?: number
    distinct?: Enumerable<TUPDATEVALUESScalarFieldEnum>
  }


  /**
   * TUPDATEVALUES create
   */
  export type TUPDATEVALUESCreateArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * The data needed to create a TUPDATEVALUES.
     * 
    **/
    data: XOR<TUPDATEVALUESCreateInput, TUPDATEVALUESUncheckedCreateInput>
  }


  /**
   * TUPDATEVALUES update
   */
  export type TUPDATEVALUESUpdateArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * The data needed to update a TUPDATEVALUES.
     * 
    **/
    data: XOR<TUPDATEVALUESUpdateInput, TUPDATEVALUESUncheckedUpdateInput>
    /**
     * Choose, which TUPDATEVALUES to update.
     * 
    **/
    where: TUPDATEVALUESWhereUniqueInput
  }


  /**
   * TUPDATEVALUES updateMany
   */
  export type TUPDATEVALUESUpdateManyArgs = {
    /**
     * The data used to update TUPDATEVALUES.
     * 
    **/
    data: XOR<TUPDATEVALUESUpdateManyMutationInput, TUPDATEVALUESUncheckedUpdateManyInput>
    /**
     * Filter which TUPDATEVALUES to update
     * 
    **/
    where?: TUPDATEVALUESWhereInput
  }


  /**
   * TUPDATEVALUES upsert
   */
  export type TUPDATEVALUESUpsertArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * The filter to search for the TUPDATEVALUES to update in case it exists.
     * 
    **/
    where: TUPDATEVALUESWhereUniqueInput
    /**
     * In case the TUPDATEVALUES found by the `where` argument doesn't exist, create a new TUPDATEVALUES with this data.
     * 
    **/
    create: XOR<TUPDATEVALUESCreateInput, TUPDATEVALUESUncheckedCreateInput>
    /**
     * In case the TUPDATEVALUES was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<TUPDATEVALUESUpdateInput, TUPDATEVALUESUncheckedUpdateInput>
  }


  /**
   * TUPDATEVALUES delete
   */
  export type TUPDATEVALUESDeleteArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
    /**
     * Filter which TUPDATEVALUES to delete.
     * 
    **/
    where: TUPDATEVALUESWhereUniqueInput
  }


  /**
   * TUPDATEVALUES deleteMany
   */
  export type TUPDATEVALUESDeleteManyArgs = {
    /**
     * Filter which TUPDATEVALUES to delete
     * 
    **/
    where?: TUPDATEVALUESWhereInput
  }


  /**
   * TUPDATEVALUES without action
   */
  export type TUPDATEVALUESArgs = {
    /**
     * Select specific fields to fetch from the TUPDATEVALUES
     * 
    **/
    select?: TUPDATEVALUESSelect | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const TCOMPETITORSScalarFieldEnum: {
    C_IDX: 'C_IDX',
    C_NUM: 'C_NUM',
    C_TRANSPONDER1: 'C_TRANSPONDER1',
    C_TRANSPONDER2: 'C_TRANSPONDER2',
    C_LAST_NAME: 'C_LAST_NAME',
    C_FIRST_NAME: 'C_FIRST_NAME',
    C_CODE: 'C_CODE',
    C_SEX: 'C_SEX',
    C_YEAR: 'C_YEAR',
    C_CATEGORY: 'C_CATEGORY',
    C_SERIE: 'C_SERIE',
    C_NATION: 'C_NATION',
    C_COMMITTEE: 'C_COMMITTEE',
    C_CLUB: 'C_CLUB',
    C_TEAM: 'C_TEAM',
    C_I15: 'C_I15',
    C_I16: 'C_I16',
    C_I17: 'C_I17',
    C_I18: 'C_I18',
    C_I19: 'C_I19',
    C_I20: 'C_I20',
    C_I21: 'C_I21',
    C_I22: 'C_I22',
    C_I23: 'C_I23',
    C_I24: 'C_I24',
    C_I25: 'C_I25',
    C_I26: 'C_I26',
    C_I27: 'C_I27',
    C_I28: 'C_I28',
    C_I29: 'C_I29',
    C_I30: 'C_I30',
    C_I31: 'C_I31',
    C_I32: 'C_I32',
    C_I33: 'C_I33',
    C_I34: 'C_I34',
    C_I35: 'C_I35',
    C_I36: 'C_I36',
    C_I37: 'C_I37'
  };

  export type TCOMPETITORSScalarFieldEnum = (typeof TCOMPETITORSScalarFieldEnum)[keyof typeof TCOMPETITORSScalarFieldEnum]


  export const TEDITINGFORMATSScalarFieldEnum: {
    C_NUMEDIT: 'C_NUMEDIT',
    C_PARAM: 'C_PARAM',
    C_VALUE: 'C_VALUE'
  };

  export type TEDITINGFORMATSScalarFieldEnum = (typeof TEDITINGFORMATSScalarFieldEnum)[keyof typeof TEDITINGFORMATSScalarFieldEnum]


  export const TEDITINGPARAMETERSScalarFieldEnum: {
    C_PARAM: 'C_PARAM',
    C_VALUE: 'C_VALUE'
  };

  export type TEDITINGPARAMETERSScalarFieldEnum = (typeof TEDITINGPARAMETERSScalarFieldEnum)[keyof typeof TEDITINGPARAMETERSScalarFieldEnum]


  export const TKEYVALUESScalarFieldEnum: {
    TABLENAME: 'TABLENAME',
    KEYVALUE: 'KEYVALUE'
  };

  export type TKEYVALUESScalarFieldEnum = (typeof TKEYVALUESScalarFieldEnum)[keyof typeof TKEYVALUESScalarFieldEnum]


  export const TPARAMETERSScalarFieldEnum: {
    C_PARAM: 'C_PARAM',
    C_VALUE: 'C_VALUE'
  };

  export type TPARAMETERSScalarFieldEnum = (typeof TPARAMETERSScalarFieldEnum)[keyof typeof TPARAMETERSScalarFieldEnum]


  export const TPARAMETERS_HEATScalarFieldEnum: {
    C_PARAM: 'C_PARAM',
    C_VALUE: 'C_VALUE'
  };

  export type TPARAMETERS_HEATScalarFieldEnum = (typeof TPARAMETERS_HEATScalarFieldEnum)[keyof typeof TPARAMETERS_HEATScalarFieldEnum]


  export const TUPDATEVALUESScalarFieldEnum: {
    TABLENAME: 'TABLENAME',
    UPDATEVALUE: 'UPDATEVALUE'
  };

  export type TUPDATEVALUESScalarFieldEnum = (typeof TUPDATEVALUESScalarFieldEnum)[keyof typeof TUPDATEVALUESScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Deep Input Types
   */


  export type TCOMPETITORSWhereInput = {
    AND?: Enumerable<TCOMPETITORSWhereInput>
    OR?: Enumerable<TCOMPETITORSWhereInput>
    NOT?: Enumerable<TCOMPETITORSWhereInput>
    C_IDX?: IntFilter | number
    C_NUM?: IntNullableFilter | number | null
    C_TRANSPONDER1?: StringNullableFilter | string | null
    C_TRANSPONDER2?: StringNullableFilter | string | null
    C_LAST_NAME?: StringNullableFilter | string | null
    C_FIRST_NAME?: StringNullableFilter | string | null
    C_CODE?: StringNullableFilter | string | null
    C_SEX?: IntNullableFilter | number | null
    C_YEAR?: IntNullableFilter | number | null
    C_CATEGORY?: StringNullableFilter | string | null
    C_SERIE?: StringNullableFilter | string | null
    C_NATION?: StringNullableFilter | string | null
    C_COMMITTEE?: StringNullableFilter | string | null
    C_CLUB?: StringNullableFilter | string | null
    C_TEAM?: StringNullableFilter | string | null
    C_I15?: IntNullableFilter | number | null
    C_I16?: IntNullableFilter | number | null
    C_I17?: StringNullableFilter | string | null
    C_I18?: StringNullableFilter | string | null
    C_I19?: IntNullableFilter | number | null
    C_I20?: IntNullableFilter | number | null
    C_I21?: IntNullableFilter | number | null
    C_I22?: IntNullableFilter | number | null
    C_I23?: IntNullableFilter | number | null
    C_I24?: IntNullableFilter | number | null
    C_I25?: IntNullableFilter | number | null
    C_I26?: IntNullableFilter | number | null
    C_I27?: StringNullableFilter | string | null
    C_I28?: StringNullableFilter | string | null
    C_I29?: StringNullableFilter | string | null
    C_I30?: StringNullableFilter | string | null
    C_I31?: StringNullableFilter | string | null
    C_I32?: StringNullableFilter | string | null
    C_I33?: StringNullableFilter | string | null
    C_I34?: StringNullableFilter | string | null
    C_I35?: StringNullableFilter | string | null
    C_I36?: StringNullableFilter | string | null
    C_I37?: StringNullableFilter | string | null
  }

  export type TCOMPETITORSOrderByWithRelationInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_TRANSPONDER1?: SortOrder
    C_TRANSPONDER2?: SortOrder
    C_LAST_NAME?: SortOrder
    C_FIRST_NAME?: SortOrder
    C_CODE?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_CATEGORY?: SortOrder
    C_SERIE?: SortOrder
    C_NATION?: SortOrder
    C_COMMITTEE?: SortOrder
    C_CLUB?: SortOrder
    C_TEAM?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I17?: SortOrder
    C_I18?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
    C_I27?: SortOrder
    C_I28?: SortOrder
    C_I29?: SortOrder
    C_I30?: SortOrder
    C_I31?: SortOrder
    C_I32?: SortOrder
    C_I33?: SortOrder
    C_I34?: SortOrder
    C_I35?: SortOrder
    C_I36?: SortOrder
    C_I37?: SortOrder
  }

  export type TCOMPETITORSWhereUniqueInput = {
    C_IDX?: number
  }

  export type TCOMPETITORSOrderByWithAggregationInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_TRANSPONDER1?: SortOrder
    C_TRANSPONDER2?: SortOrder
    C_LAST_NAME?: SortOrder
    C_FIRST_NAME?: SortOrder
    C_CODE?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_CATEGORY?: SortOrder
    C_SERIE?: SortOrder
    C_NATION?: SortOrder
    C_COMMITTEE?: SortOrder
    C_CLUB?: SortOrder
    C_TEAM?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I17?: SortOrder
    C_I18?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
    C_I27?: SortOrder
    C_I28?: SortOrder
    C_I29?: SortOrder
    C_I30?: SortOrder
    C_I31?: SortOrder
    C_I32?: SortOrder
    C_I33?: SortOrder
    C_I34?: SortOrder
    C_I35?: SortOrder
    C_I36?: SortOrder
    C_I37?: SortOrder
    _count?: TCOMPETITORSCountOrderByAggregateInput
    _avg?: TCOMPETITORSAvgOrderByAggregateInput
    _max?: TCOMPETITORSMaxOrderByAggregateInput
    _min?: TCOMPETITORSMinOrderByAggregateInput
    _sum?: TCOMPETITORSSumOrderByAggregateInput
  }

  export type TCOMPETITORSScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TCOMPETITORSScalarWhereWithAggregatesInput>
    OR?: Enumerable<TCOMPETITORSScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TCOMPETITORSScalarWhereWithAggregatesInput>
    C_IDX?: IntWithAggregatesFilter | number
    C_NUM?: IntNullableWithAggregatesFilter | number | null
    C_TRANSPONDER1?: StringNullableWithAggregatesFilter | string | null
    C_TRANSPONDER2?: StringNullableWithAggregatesFilter | string | null
    C_LAST_NAME?: StringNullableWithAggregatesFilter | string | null
    C_FIRST_NAME?: StringNullableWithAggregatesFilter | string | null
    C_CODE?: StringNullableWithAggregatesFilter | string | null
    C_SEX?: IntNullableWithAggregatesFilter | number | null
    C_YEAR?: IntNullableWithAggregatesFilter | number | null
    C_CATEGORY?: StringNullableWithAggregatesFilter | string | null
    C_SERIE?: StringNullableWithAggregatesFilter | string | null
    C_NATION?: StringNullableWithAggregatesFilter | string | null
    C_COMMITTEE?: StringNullableWithAggregatesFilter | string | null
    C_CLUB?: StringNullableWithAggregatesFilter | string | null
    C_TEAM?: StringNullableWithAggregatesFilter | string | null
    C_I15?: IntNullableWithAggregatesFilter | number | null
    C_I16?: IntNullableWithAggregatesFilter | number | null
    C_I17?: StringNullableWithAggregatesFilter | string | null
    C_I18?: StringNullableWithAggregatesFilter | string | null
    C_I19?: IntNullableWithAggregatesFilter | number | null
    C_I20?: IntNullableWithAggregatesFilter | number | null
    C_I21?: IntNullableWithAggregatesFilter | number | null
    C_I22?: IntNullableWithAggregatesFilter | number | null
    C_I23?: IntNullableWithAggregatesFilter | number | null
    C_I24?: IntNullableWithAggregatesFilter | number | null
    C_I25?: IntNullableWithAggregatesFilter | number | null
    C_I26?: IntNullableWithAggregatesFilter | number | null
    C_I27?: StringNullableWithAggregatesFilter | string | null
    C_I28?: StringNullableWithAggregatesFilter | string | null
    C_I29?: StringNullableWithAggregatesFilter | string | null
    C_I30?: StringNullableWithAggregatesFilter | string | null
    C_I31?: StringNullableWithAggregatesFilter | string | null
    C_I32?: StringNullableWithAggregatesFilter | string | null
    C_I33?: StringNullableWithAggregatesFilter | string | null
    C_I34?: StringNullableWithAggregatesFilter | string | null
    C_I35?: StringNullableWithAggregatesFilter | string | null
    C_I36?: StringNullableWithAggregatesFilter | string | null
    C_I37?: StringNullableWithAggregatesFilter | string | null
  }

  export type TEDITINGFORMATSWhereInput = {
    AND?: Enumerable<TEDITINGFORMATSWhereInput>
    OR?: Enumerable<TEDITINGFORMATSWhereInput>
    NOT?: Enumerable<TEDITINGFORMATSWhereInput>
    C_NUMEDIT?: IntFilter | number
    C_PARAM?: StringFilter | string
    C_VALUE?: StringNullableFilter | string | null
  }

  export type TEDITINGFORMATSOrderByWithRelationInput = {
    C_NUMEDIT?: SortOrder
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGFORMATSWhereUniqueInput = {
    C_NUMEDIT_C_PARAM?: TEDITINGFORMATSC_NUMEDITC_PARAMCompoundUniqueInput
  }

  export type TEDITINGFORMATSOrderByWithAggregationInput = {
    C_NUMEDIT?: SortOrder
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
    _count?: TEDITINGFORMATSCountOrderByAggregateInput
    _avg?: TEDITINGFORMATSAvgOrderByAggregateInput
    _max?: TEDITINGFORMATSMaxOrderByAggregateInput
    _min?: TEDITINGFORMATSMinOrderByAggregateInput
    _sum?: TEDITINGFORMATSSumOrderByAggregateInput
  }

  export type TEDITINGFORMATSScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TEDITINGFORMATSScalarWhereWithAggregatesInput>
    OR?: Enumerable<TEDITINGFORMATSScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TEDITINGFORMATSScalarWhereWithAggregatesInput>
    C_NUMEDIT?: IntWithAggregatesFilter | number
    C_PARAM?: StringWithAggregatesFilter | string
    C_VALUE?: StringNullableWithAggregatesFilter | string | null
  }

  export type TEDITINGPARAMETERSWhereInput = {
    AND?: Enumerable<TEDITINGPARAMETERSWhereInput>
    OR?: Enumerable<TEDITINGPARAMETERSWhereInput>
    NOT?: Enumerable<TEDITINGPARAMETERSWhereInput>
    C_PARAM?: StringFilter | string
    C_VALUE?: StringNullableFilter | string | null
  }

  export type TEDITINGPARAMETERSOrderByWithRelationInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGPARAMETERSWhereUniqueInput = {
    C_PARAM?: string
  }

  export type TEDITINGPARAMETERSOrderByWithAggregationInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
    _count?: TEDITINGPARAMETERSCountOrderByAggregateInput
    _max?: TEDITINGPARAMETERSMaxOrderByAggregateInput
    _min?: TEDITINGPARAMETERSMinOrderByAggregateInput
  }

  export type TEDITINGPARAMETERSScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TEDITINGPARAMETERSScalarWhereWithAggregatesInput>
    OR?: Enumerable<TEDITINGPARAMETERSScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TEDITINGPARAMETERSScalarWhereWithAggregatesInput>
    C_PARAM?: StringWithAggregatesFilter | string
    C_VALUE?: StringNullableWithAggregatesFilter | string | null
  }

  export type TKEYVALUESWhereInput = {
    AND?: Enumerable<TKEYVALUESWhereInput>
    OR?: Enumerable<TKEYVALUESWhereInput>
    NOT?: Enumerable<TKEYVALUESWhereInput>
    TABLENAME?: StringFilter | string
    KEYVALUE?: IntFilter | number
  }

  export type TKEYVALUESOrderByWithRelationInput = {
    TABLENAME?: SortOrder
    KEYVALUE?: SortOrder
  }

  export type TKEYVALUESWhereUniqueInput = {
    TABLENAME?: string
  }

  export type TKEYVALUESOrderByWithAggregationInput = {
    TABLENAME?: SortOrder
    KEYVALUE?: SortOrder
    _count?: TKEYVALUESCountOrderByAggregateInput
    _avg?: TKEYVALUESAvgOrderByAggregateInput
    _max?: TKEYVALUESMaxOrderByAggregateInput
    _min?: TKEYVALUESMinOrderByAggregateInput
    _sum?: TKEYVALUESSumOrderByAggregateInput
  }

  export type TKEYVALUESScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TKEYVALUESScalarWhereWithAggregatesInput>
    OR?: Enumerable<TKEYVALUESScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TKEYVALUESScalarWhereWithAggregatesInput>
    TABLENAME?: StringWithAggregatesFilter | string
    KEYVALUE?: IntWithAggregatesFilter | number
  }

  export type TPARAMETERSWhereInput = {
    AND?: Enumerable<TPARAMETERSWhereInput>
    OR?: Enumerable<TPARAMETERSWhereInput>
    NOT?: Enumerable<TPARAMETERSWhereInput>
    C_PARAM?: StringFilter | string
    C_VALUE?: StringNullableFilter | string | null
  }

  export type TPARAMETERSOrderByWithRelationInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERSWhereUniqueInput = {
    C_PARAM?: string
  }

  export type TPARAMETERSOrderByWithAggregationInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
    _count?: TPARAMETERSCountOrderByAggregateInput
    _max?: TPARAMETERSMaxOrderByAggregateInput
    _min?: TPARAMETERSMinOrderByAggregateInput
  }

  export type TPARAMETERSScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TPARAMETERSScalarWhereWithAggregatesInput>
    OR?: Enumerable<TPARAMETERSScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TPARAMETERSScalarWhereWithAggregatesInput>
    C_PARAM?: StringWithAggregatesFilter | string
    C_VALUE?: StringNullableWithAggregatesFilter | string | null
  }

  export type TPARAMETERS_HEATWhereInput = {
    AND?: Enumerable<TPARAMETERS_HEATWhereInput>
    OR?: Enumerable<TPARAMETERS_HEATWhereInput>
    NOT?: Enumerable<TPARAMETERS_HEATWhereInput>
    C_PARAM?: StringFilter | string
    C_VALUE?: StringNullableFilter | string | null
  }

  export type TPARAMETERS_HEATOrderByWithRelationInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERS_HEATWhereUniqueInput = {
    C_PARAM?: string
  }

  export type TPARAMETERS_HEATOrderByWithAggregationInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
    _count?: TPARAMETERS_HEATCountOrderByAggregateInput
    _max?: TPARAMETERS_HEATMaxOrderByAggregateInput
    _min?: TPARAMETERS_HEATMinOrderByAggregateInput
  }

  export type TPARAMETERS_HEATScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TPARAMETERS_HEATScalarWhereWithAggregatesInput>
    OR?: Enumerable<TPARAMETERS_HEATScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TPARAMETERS_HEATScalarWhereWithAggregatesInput>
    C_PARAM?: StringWithAggregatesFilter | string
    C_VALUE?: StringNullableWithAggregatesFilter | string | null
  }

  export type TUPDATEVALUESWhereInput = {
    AND?: Enumerable<TUPDATEVALUESWhereInput>
    OR?: Enumerable<TUPDATEVALUESWhereInput>
    NOT?: Enumerable<TUPDATEVALUESWhereInput>
    TABLENAME?: StringFilter | string
    UPDATEVALUE?: IntFilter | number
  }

  export type TUPDATEVALUESOrderByWithRelationInput = {
    TABLENAME?: SortOrder
    UPDATEVALUE?: SortOrder
  }

  export type TUPDATEVALUESWhereUniqueInput = {
    TABLENAME?: string
  }

  export type TUPDATEVALUESOrderByWithAggregationInput = {
    TABLENAME?: SortOrder
    UPDATEVALUE?: SortOrder
    _count?: TUPDATEVALUESCountOrderByAggregateInput
    _avg?: TUPDATEVALUESAvgOrderByAggregateInput
    _max?: TUPDATEVALUESMaxOrderByAggregateInput
    _min?: TUPDATEVALUESMinOrderByAggregateInput
    _sum?: TUPDATEVALUESSumOrderByAggregateInput
  }

  export type TUPDATEVALUESScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TUPDATEVALUESScalarWhereWithAggregatesInput>
    OR?: Enumerable<TUPDATEVALUESScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TUPDATEVALUESScalarWhereWithAggregatesInput>
    TABLENAME?: StringWithAggregatesFilter | string
    UPDATEVALUE?: IntWithAggregatesFilter | number
  }

  export type TCOMPETITORSCreateInput = {
    C_NUM?: number | null
    C_TRANSPONDER1?: string | null
    C_TRANSPONDER2?: string | null
    C_LAST_NAME?: string | null
    C_FIRST_NAME?: string | null
    C_CODE?: string | null
    C_SEX?: number | null
    C_YEAR?: number | null
    C_CATEGORY?: string | null
    C_SERIE?: string | null
    C_NATION?: string | null
    C_COMMITTEE?: string | null
    C_CLUB?: string | null
    C_TEAM?: string | null
    C_I15?: number | null
    C_I16?: number | null
    C_I17?: string | null
    C_I18?: string | null
    C_I19?: number | null
    C_I20?: number | null
    C_I21?: number | null
    C_I22?: number | null
    C_I23?: number | null
    C_I24?: number | null
    C_I25?: number | null
    C_I26?: number | null
    C_I27?: string | null
    C_I28?: string | null
    C_I29?: string | null
    C_I30?: string | null
    C_I31?: string | null
    C_I32?: string | null
    C_I33?: string | null
    C_I34?: string | null
    C_I35?: string | null
    C_I36?: string | null
    C_I37?: string | null
  }

  export type TCOMPETITORSUncheckedCreateInput = {
    C_IDX?: number
    C_NUM?: number | null
    C_TRANSPONDER1?: string | null
    C_TRANSPONDER2?: string | null
    C_LAST_NAME?: string | null
    C_FIRST_NAME?: string | null
    C_CODE?: string | null
    C_SEX?: number | null
    C_YEAR?: number | null
    C_CATEGORY?: string | null
    C_SERIE?: string | null
    C_NATION?: string | null
    C_COMMITTEE?: string | null
    C_CLUB?: string | null
    C_TEAM?: string | null
    C_I15?: number | null
    C_I16?: number | null
    C_I17?: string | null
    C_I18?: string | null
    C_I19?: number | null
    C_I20?: number | null
    C_I21?: number | null
    C_I22?: number | null
    C_I23?: number | null
    C_I24?: number | null
    C_I25?: number | null
    C_I26?: number | null
    C_I27?: string | null
    C_I28?: string | null
    C_I29?: string | null
    C_I30?: string | null
    C_I31?: string | null
    C_I32?: string | null
    C_I33?: string | null
    C_I34?: string | null
    C_I35?: string | null
    C_I36?: string | null
    C_I37?: string | null
  }

  export type TCOMPETITORSUpdateInput = {
    C_NUM?: NullableIntFieldUpdateOperationsInput | number | null
    C_TRANSPONDER1?: NullableStringFieldUpdateOperationsInput | string | null
    C_TRANSPONDER2?: NullableStringFieldUpdateOperationsInput | string | null
    C_LAST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_FIRST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_CODE?: NullableStringFieldUpdateOperationsInput | string | null
    C_SEX?: NullableIntFieldUpdateOperationsInput | number | null
    C_YEAR?: NullableIntFieldUpdateOperationsInput | number | null
    C_CATEGORY?: NullableStringFieldUpdateOperationsInput | string | null
    C_SERIE?: NullableStringFieldUpdateOperationsInput | string | null
    C_NATION?: NullableStringFieldUpdateOperationsInput | string | null
    C_COMMITTEE?: NullableStringFieldUpdateOperationsInput | string | null
    C_CLUB?: NullableStringFieldUpdateOperationsInput | string | null
    C_TEAM?: NullableStringFieldUpdateOperationsInput | string | null
    C_I15?: NullableIntFieldUpdateOperationsInput | number | null
    C_I16?: NullableIntFieldUpdateOperationsInput | number | null
    C_I17?: NullableStringFieldUpdateOperationsInput | string | null
    C_I18?: NullableStringFieldUpdateOperationsInput | string | null
    C_I19?: NullableIntFieldUpdateOperationsInput | number | null
    C_I20?: NullableIntFieldUpdateOperationsInput | number | null
    C_I21?: NullableIntFieldUpdateOperationsInput | number | null
    C_I22?: NullableIntFieldUpdateOperationsInput | number | null
    C_I23?: NullableIntFieldUpdateOperationsInput | number | null
    C_I24?: NullableIntFieldUpdateOperationsInput | number | null
    C_I25?: NullableIntFieldUpdateOperationsInput | number | null
    C_I26?: NullableIntFieldUpdateOperationsInput | number | null
    C_I27?: NullableStringFieldUpdateOperationsInput | string | null
    C_I28?: NullableStringFieldUpdateOperationsInput | string | null
    C_I29?: NullableStringFieldUpdateOperationsInput | string | null
    C_I30?: NullableStringFieldUpdateOperationsInput | string | null
    C_I31?: NullableStringFieldUpdateOperationsInput | string | null
    C_I32?: NullableStringFieldUpdateOperationsInput | string | null
    C_I33?: NullableStringFieldUpdateOperationsInput | string | null
    C_I34?: NullableStringFieldUpdateOperationsInput | string | null
    C_I35?: NullableStringFieldUpdateOperationsInput | string | null
    C_I36?: NullableStringFieldUpdateOperationsInput | string | null
    C_I37?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TCOMPETITORSUncheckedUpdateInput = {
    C_IDX?: IntFieldUpdateOperationsInput | number
    C_NUM?: NullableIntFieldUpdateOperationsInput | number | null
    C_TRANSPONDER1?: NullableStringFieldUpdateOperationsInput | string | null
    C_TRANSPONDER2?: NullableStringFieldUpdateOperationsInput | string | null
    C_LAST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_FIRST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_CODE?: NullableStringFieldUpdateOperationsInput | string | null
    C_SEX?: NullableIntFieldUpdateOperationsInput | number | null
    C_YEAR?: NullableIntFieldUpdateOperationsInput | number | null
    C_CATEGORY?: NullableStringFieldUpdateOperationsInput | string | null
    C_SERIE?: NullableStringFieldUpdateOperationsInput | string | null
    C_NATION?: NullableStringFieldUpdateOperationsInput | string | null
    C_COMMITTEE?: NullableStringFieldUpdateOperationsInput | string | null
    C_CLUB?: NullableStringFieldUpdateOperationsInput | string | null
    C_TEAM?: NullableStringFieldUpdateOperationsInput | string | null
    C_I15?: NullableIntFieldUpdateOperationsInput | number | null
    C_I16?: NullableIntFieldUpdateOperationsInput | number | null
    C_I17?: NullableStringFieldUpdateOperationsInput | string | null
    C_I18?: NullableStringFieldUpdateOperationsInput | string | null
    C_I19?: NullableIntFieldUpdateOperationsInput | number | null
    C_I20?: NullableIntFieldUpdateOperationsInput | number | null
    C_I21?: NullableIntFieldUpdateOperationsInput | number | null
    C_I22?: NullableIntFieldUpdateOperationsInput | number | null
    C_I23?: NullableIntFieldUpdateOperationsInput | number | null
    C_I24?: NullableIntFieldUpdateOperationsInput | number | null
    C_I25?: NullableIntFieldUpdateOperationsInput | number | null
    C_I26?: NullableIntFieldUpdateOperationsInput | number | null
    C_I27?: NullableStringFieldUpdateOperationsInput | string | null
    C_I28?: NullableStringFieldUpdateOperationsInput | string | null
    C_I29?: NullableStringFieldUpdateOperationsInput | string | null
    C_I30?: NullableStringFieldUpdateOperationsInput | string | null
    C_I31?: NullableStringFieldUpdateOperationsInput | string | null
    C_I32?: NullableStringFieldUpdateOperationsInput | string | null
    C_I33?: NullableStringFieldUpdateOperationsInput | string | null
    C_I34?: NullableStringFieldUpdateOperationsInput | string | null
    C_I35?: NullableStringFieldUpdateOperationsInput | string | null
    C_I36?: NullableStringFieldUpdateOperationsInput | string | null
    C_I37?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TCOMPETITORSUpdateManyMutationInput = {
    C_NUM?: NullableIntFieldUpdateOperationsInput | number | null
    C_TRANSPONDER1?: NullableStringFieldUpdateOperationsInput | string | null
    C_TRANSPONDER2?: NullableStringFieldUpdateOperationsInput | string | null
    C_LAST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_FIRST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_CODE?: NullableStringFieldUpdateOperationsInput | string | null
    C_SEX?: NullableIntFieldUpdateOperationsInput | number | null
    C_YEAR?: NullableIntFieldUpdateOperationsInput | number | null
    C_CATEGORY?: NullableStringFieldUpdateOperationsInput | string | null
    C_SERIE?: NullableStringFieldUpdateOperationsInput | string | null
    C_NATION?: NullableStringFieldUpdateOperationsInput | string | null
    C_COMMITTEE?: NullableStringFieldUpdateOperationsInput | string | null
    C_CLUB?: NullableStringFieldUpdateOperationsInput | string | null
    C_TEAM?: NullableStringFieldUpdateOperationsInput | string | null
    C_I15?: NullableIntFieldUpdateOperationsInput | number | null
    C_I16?: NullableIntFieldUpdateOperationsInput | number | null
    C_I17?: NullableStringFieldUpdateOperationsInput | string | null
    C_I18?: NullableStringFieldUpdateOperationsInput | string | null
    C_I19?: NullableIntFieldUpdateOperationsInput | number | null
    C_I20?: NullableIntFieldUpdateOperationsInput | number | null
    C_I21?: NullableIntFieldUpdateOperationsInput | number | null
    C_I22?: NullableIntFieldUpdateOperationsInput | number | null
    C_I23?: NullableIntFieldUpdateOperationsInput | number | null
    C_I24?: NullableIntFieldUpdateOperationsInput | number | null
    C_I25?: NullableIntFieldUpdateOperationsInput | number | null
    C_I26?: NullableIntFieldUpdateOperationsInput | number | null
    C_I27?: NullableStringFieldUpdateOperationsInput | string | null
    C_I28?: NullableStringFieldUpdateOperationsInput | string | null
    C_I29?: NullableStringFieldUpdateOperationsInput | string | null
    C_I30?: NullableStringFieldUpdateOperationsInput | string | null
    C_I31?: NullableStringFieldUpdateOperationsInput | string | null
    C_I32?: NullableStringFieldUpdateOperationsInput | string | null
    C_I33?: NullableStringFieldUpdateOperationsInput | string | null
    C_I34?: NullableStringFieldUpdateOperationsInput | string | null
    C_I35?: NullableStringFieldUpdateOperationsInput | string | null
    C_I36?: NullableStringFieldUpdateOperationsInput | string | null
    C_I37?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TCOMPETITORSUncheckedUpdateManyInput = {
    C_IDX?: IntFieldUpdateOperationsInput | number
    C_NUM?: NullableIntFieldUpdateOperationsInput | number | null
    C_TRANSPONDER1?: NullableStringFieldUpdateOperationsInput | string | null
    C_TRANSPONDER2?: NullableStringFieldUpdateOperationsInput | string | null
    C_LAST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_FIRST_NAME?: NullableStringFieldUpdateOperationsInput | string | null
    C_CODE?: NullableStringFieldUpdateOperationsInput | string | null
    C_SEX?: NullableIntFieldUpdateOperationsInput | number | null
    C_YEAR?: NullableIntFieldUpdateOperationsInput | number | null
    C_CATEGORY?: NullableStringFieldUpdateOperationsInput | string | null
    C_SERIE?: NullableStringFieldUpdateOperationsInput | string | null
    C_NATION?: NullableStringFieldUpdateOperationsInput | string | null
    C_COMMITTEE?: NullableStringFieldUpdateOperationsInput | string | null
    C_CLUB?: NullableStringFieldUpdateOperationsInput | string | null
    C_TEAM?: NullableStringFieldUpdateOperationsInput | string | null
    C_I15?: NullableIntFieldUpdateOperationsInput | number | null
    C_I16?: NullableIntFieldUpdateOperationsInput | number | null
    C_I17?: NullableStringFieldUpdateOperationsInput | string | null
    C_I18?: NullableStringFieldUpdateOperationsInput | string | null
    C_I19?: NullableIntFieldUpdateOperationsInput | number | null
    C_I20?: NullableIntFieldUpdateOperationsInput | number | null
    C_I21?: NullableIntFieldUpdateOperationsInput | number | null
    C_I22?: NullableIntFieldUpdateOperationsInput | number | null
    C_I23?: NullableIntFieldUpdateOperationsInput | number | null
    C_I24?: NullableIntFieldUpdateOperationsInput | number | null
    C_I25?: NullableIntFieldUpdateOperationsInput | number | null
    C_I26?: NullableIntFieldUpdateOperationsInput | number | null
    C_I27?: NullableStringFieldUpdateOperationsInput | string | null
    C_I28?: NullableStringFieldUpdateOperationsInput | string | null
    C_I29?: NullableStringFieldUpdateOperationsInput | string | null
    C_I30?: NullableStringFieldUpdateOperationsInput | string | null
    C_I31?: NullableStringFieldUpdateOperationsInput | string | null
    C_I32?: NullableStringFieldUpdateOperationsInput | string | null
    C_I33?: NullableStringFieldUpdateOperationsInput | string | null
    C_I34?: NullableStringFieldUpdateOperationsInput | string | null
    C_I35?: NullableStringFieldUpdateOperationsInput | string | null
    C_I36?: NullableStringFieldUpdateOperationsInput | string | null
    C_I37?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGFORMATSCreateInput = {
    C_NUMEDIT: number
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TEDITINGFORMATSUncheckedCreateInput = {
    C_NUMEDIT: number
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TEDITINGFORMATSUpdateInput = {
    C_NUMEDIT?: IntFieldUpdateOperationsInput | number
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGFORMATSUncheckedUpdateInput = {
    C_NUMEDIT?: IntFieldUpdateOperationsInput | number
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGFORMATSUpdateManyMutationInput = {
    C_NUMEDIT?: IntFieldUpdateOperationsInput | number
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGFORMATSUncheckedUpdateManyInput = {
    C_NUMEDIT?: IntFieldUpdateOperationsInput | number
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGPARAMETERSCreateInput = {
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TEDITINGPARAMETERSUncheckedCreateInput = {
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TEDITINGPARAMETERSUpdateInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGPARAMETERSUncheckedUpdateInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGPARAMETERSUpdateManyMutationInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TEDITINGPARAMETERSUncheckedUpdateManyInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TKEYVALUESCreateInput = {
    TABLENAME: string
    KEYVALUE: number
  }

  export type TKEYVALUESUncheckedCreateInput = {
    TABLENAME: string
    KEYVALUE: number
  }

  export type TKEYVALUESUpdateInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    KEYVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TKEYVALUESUncheckedUpdateInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    KEYVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TKEYVALUESUpdateManyMutationInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    KEYVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TKEYVALUESUncheckedUpdateManyInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    KEYVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TPARAMETERSCreateInput = {
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TPARAMETERSUncheckedCreateInput = {
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TPARAMETERSUpdateInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERSUncheckedUpdateInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERSUpdateManyMutationInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERSUncheckedUpdateManyInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERS_HEATCreateInput = {
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TPARAMETERS_HEATUncheckedCreateInput = {
    C_PARAM: string
    C_VALUE?: string | null
  }

  export type TPARAMETERS_HEATUpdateInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERS_HEATUncheckedUpdateInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERS_HEATUpdateManyMutationInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TPARAMETERS_HEATUncheckedUpdateManyInput = {
    C_PARAM?: StringFieldUpdateOperationsInput | string
    C_VALUE?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TUPDATEVALUESCreateInput = {
    TABLENAME: string
    UPDATEVALUE: number
  }

  export type TUPDATEVALUESUncheckedCreateInput = {
    TABLENAME: string
    UPDATEVALUE: number
  }

  export type TUPDATEVALUESUpdateInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    UPDATEVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TUPDATEVALUESUncheckedUpdateInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    UPDATEVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TUPDATEVALUESUpdateManyMutationInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    UPDATEVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type TUPDATEVALUESUncheckedUpdateManyInput = {
    TABLENAME?: StringFieldUpdateOperationsInput | string
    UPDATEVALUE?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type IntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type TCOMPETITORSCountOrderByAggregateInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_TRANSPONDER1?: SortOrder
    C_TRANSPONDER2?: SortOrder
    C_LAST_NAME?: SortOrder
    C_FIRST_NAME?: SortOrder
    C_CODE?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_CATEGORY?: SortOrder
    C_SERIE?: SortOrder
    C_NATION?: SortOrder
    C_COMMITTEE?: SortOrder
    C_CLUB?: SortOrder
    C_TEAM?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I17?: SortOrder
    C_I18?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
    C_I27?: SortOrder
    C_I28?: SortOrder
    C_I29?: SortOrder
    C_I30?: SortOrder
    C_I31?: SortOrder
    C_I32?: SortOrder
    C_I33?: SortOrder
    C_I34?: SortOrder
    C_I35?: SortOrder
    C_I36?: SortOrder
    C_I37?: SortOrder
  }

  export type TCOMPETITORSAvgOrderByAggregateInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
  }

  export type TCOMPETITORSMaxOrderByAggregateInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_TRANSPONDER1?: SortOrder
    C_TRANSPONDER2?: SortOrder
    C_LAST_NAME?: SortOrder
    C_FIRST_NAME?: SortOrder
    C_CODE?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_CATEGORY?: SortOrder
    C_SERIE?: SortOrder
    C_NATION?: SortOrder
    C_COMMITTEE?: SortOrder
    C_CLUB?: SortOrder
    C_TEAM?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I17?: SortOrder
    C_I18?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
    C_I27?: SortOrder
    C_I28?: SortOrder
    C_I29?: SortOrder
    C_I30?: SortOrder
    C_I31?: SortOrder
    C_I32?: SortOrder
    C_I33?: SortOrder
    C_I34?: SortOrder
    C_I35?: SortOrder
    C_I36?: SortOrder
    C_I37?: SortOrder
  }

  export type TCOMPETITORSMinOrderByAggregateInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_TRANSPONDER1?: SortOrder
    C_TRANSPONDER2?: SortOrder
    C_LAST_NAME?: SortOrder
    C_FIRST_NAME?: SortOrder
    C_CODE?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_CATEGORY?: SortOrder
    C_SERIE?: SortOrder
    C_NATION?: SortOrder
    C_COMMITTEE?: SortOrder
    C_CLUB?: SortOrder
    C_TEAM?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I17?: SortOrder
    C_I18?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
    C_I27?: SortOrder
    C_I28?: SortOrder
    C_I29?: SortOrder
    C_I30?: SortOrder
    C_I31?: SortOrder
    C_I32?: SortOrder
    C_I33?: SortOrder
    C_I34?: SortOrder
    C_I35?: SortOrder
    C_I36?: SortOrder
    C_I37?: SortOrder
  }

  export type TCOMPETITORSSumOrderByAggregateInput = {
    C_IDX?: SortOrder
    C_NUM?: SortOrder
    C_SEX?: SortOrder
    C_YEAR?: SortOrder
    C_I15?: SortOrder
    C_I16?: SortOrder
    C_I19?: SortOrder
    C_I20?: SortOrder
    C_I21?: SortOrder
    C_I22?: SortOrder
    C_I23?: SortOrder
    C_I24?: SortOrder
    C_I25?: SortOrder
    C_I26?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type IntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type TEDITINGFORMATSC_NUMEDITC_PARAMCompoundUniqueInput = {
    C_NUMEDIT: number
    C_PARAM: string
  }

  export type TEDITINGFORMATSCountOrderByAggregateInput = {
    C_NUMEDIT?: SortOrder
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGFORMATSAvgOrderByAggregateInput = {
    C_NUMEDIT?: SortOrder
  }

  export type TEDITINGFORMATSMaxOrderByAggregateInput = {
    C_NUMEDIT?: SortOrder
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGFORMATSMinOrderByAggregateInput = {
    C_NUMEDIT?: SortOrder
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGFORMATSSumOrderByAggregateInput = {
    C_NUMEDIT?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type TEDITINGPARAMETERSCountOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGPARAMETERSMaxOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TEDITINGPARAMETERSMinOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TKEYVALUESCountOrderByAggregateInput = {
    TABLENAME?: SortOrder
    KEYVALUE?: SortOrder
  }

  export type TKEYVALUESAvgOrderByAggregateInput = {
    KEYVALUE?: SortOrder
  }

  export type TKEYVALUESMaxOrderByAggregateInput = {
    TABLENAME?: SortOrder
    KEYVALUE?: SortOrder
  }

  export type TKEYVALUESMinOrderByAggregateInput = {
    TABLENAME?: SortOrder
    KEYVALUE?: SortOrder
  }

  export type TKEYVALUESSumOrderByAggregateInput = {
    KEYVALUE?: SortOrder
  }

  export type TPARAMETERSCountOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERSMaxOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERSMinOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERS_HEATCountOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERS_HEATMaxOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TPARAMETERS_HEATMinOrderByAggregateInput = {
    C_PARAM?: SortOrder
    C_VALUE?: SortOrder
  }

  export type TUPDATEVALUESCountOrderByAggregateInput = {
    TABLENAME?: SortOrder
    UPDATEVALUE?: SortOrder
  }

  export type TUPDATEVALUESAvgOrderByAggregateInput = {
    UPDATEVALUE?: SortOrder
  }

  export type TUPDATEVALUESMaxOrderByAggregateInput = {
    TABLENAME?: SortOrder
    UPDATEVALUE?: SortOrder
  }

  export type TUPDATEVALUESMinOrderByAggregateInput = {
    TABLENAME?: SortOrder
    UPDATEVALUE?: SortOrder
  }

  export type TUPDATEVALUESSumOrderByAggregateInput = {
    UPDATEVALUE?: SortOrder
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedIntNullableWithAggregatesFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableWithAggregatesFilter | number | null
    _count?: NestedIntNullableFilter
    _avg?: NestedFloatNullableFilter
    _sum?: NestedIntNullableFilter
    _min?: NestedIntNullableFilter
    _max?: NestedIntNullableFilter
  }

  export type NestedFloatNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatNullableFilter | number | null
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}