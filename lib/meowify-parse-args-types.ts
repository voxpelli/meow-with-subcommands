import type { ParseArgsConfig } from 'node:util';

import type { AnyFlag, AnyFlags } from './flag-types.js';

export type PackageJsonLike = {
  name?: string | undefined;
  description?: string | undefined;
  version?: string | undefined;
  bin?: string | Record<string, string | undefined>;
};

export interface Meta {
  readonly description?: string | false | undefined;
  readonly indent?: number | undefined;
  readonly pkg?: PackageJsonLike | undefined;
  readonly processTitle?: string | false | undefined;
  readonly version?: string | false | undefined;
}

export interface ExtendedParseArgsConfig<Flags extends AnyFlags> extends Omit<ParseArgsConfig, 'strict'|'tokens'> {
  readonly args?: string[] | undefined;
  readonly options?: Flags | undefined;
  readonly returnRemainderArgs?: boolean | undefined;
}

export interface Options<Flags extends AnyFlags> extends ExtendedParseArgsConfig<Flags>, Meta {}

type TypedFlag<Flag extends AnyFlag> =
    // Meow extension
    // Flag extends {type: 'number'}
    //   ? number
    //   :
      Flag extends {type: 'string'}
        ? string
        : Flag extends {type: 'boolean'}
          ? boolean
          : unknown;

type PossiblyOptionalFlag<Flag extends AnyFlag, FlagType> =
    // Meow extension
    // Flag extends {isRequired: true}
    //   ? FlagType
    //   :
    Flag extends {default: unknown}
      ? FlagType
      : FlagType | undefined;

export type TypedFlags<Flags extends AnyFlags> = {
  [F in keyof Flags]: Flags[F] extends { multiple: true }
    ? PossiblyOptionalFlag<Flags[F], Array<TypedFlag<Flags[F]>>>
    : PossiblyOptionalFlag<Flags[F], TypedFlag<Flags[F]>>
};

export interface Result<Flags extends AnyFlags> {
  input: string[];
  flags: TypedFlags<Omit<Flags, 'version' | 'help'>>;
  remainderArgs: string[];
  showHelp: (exitCode?: number) => never;
}
