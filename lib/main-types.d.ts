import type { Package as NormalizedPackageJson } from 'normalize-package-data';

import type { AnyFlags } from './flag-types.js';
import type { ExtendedParseArgsConfig, Meta, PackageJsonLike } from './meowify-parse-args-types.ts';

export type NormalizedPackageJsonLike = PackageJsonLike & NormalizedPackageJson;

export interface CliMetaOptions {
  cwd?: string;
  importMeta?: ImportMeta;
  name?: string;
}
export interface CliMeta extends Meta {
  pkg?: NormalizedPackageJsonLike | undefined;
}

export interface CliAlias {
  description: string;
  listGroup?: string;
  argv: readonly string[];
}
export type CliAliases = Readonly<Record<string, Readonly<CliAlias>>>;

export type CliSubcommandRun = (argv: string[], meta: CliMeta, context: {
  parentName: string;
}) => Promise<void> | void;
export type CliSubcommand = {
  description: string;
  listGroup?: string;
  run: CliSubcommandRun;
};
export type CliSubcommands = Readonly<Record<string, Readonly<CliSubcommand>>>;

export interface CliOptions<Flags extends AnyFlags> extends CliMetaOptions, ExtendedParseArgsConfig<Flags> {
  aliases?: CliAliases;
  args?: string[];
  name?: string;
}
