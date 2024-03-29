type ParseArgsOptionConfigType = "string" | "boolean";
type ParseArgsOptionConfigDefault = string | boolean | string[] | boolean[] | undefined;

// Borrowed from @types/node
interface ParseArgsOptionConfig {
  type: ParseArgsOptionConfigType;
  multiple?: boolean | undefined;
  // Is called "shortFlag" in meow
  short?: string | undefined;
  default?: ParseArgsOptionConfigDefault;
}

type TypeMap = {
  'string': string|string[],
  'boolean': boolean,
  // Meow extension
  // 'number': number|number[],
}

interface FlagExtensions {
  listGroup?: string;
  description: string;
  // Meow extensions
  // readonly choices?: Type extends unknown[] ? Type : Type[];
  // readonly isRequired?: boolean;
}

interface BaseFlag extends ParseArgsOptionConfig, FlagExtensions {}

export interface Flag<
  PrimitiveType extends ParseArgsOptionConfigType,
  DefaultType extends ParseArgsOptionConfigDefault = TypeMap[PrimitiveType],
  IsMultiple extends boolean = false
> extends BaseFlag {
  type: PrimitiveType,
  default?: DefaultType,
  multiple?: IsMultiple,
}

type StringFlag = Flag<'string', string> | Flag<'string', string[], true>;
type BooleanFlag = Flag<'boolean', never>;
// Meow extension
// type NumberFlag = Flag<'number', number> | Flag<'number', number[], true>;
export type AnyFlag = StringFlag | BooleanFlag;// | NumberFlag;
export type AnyFlags = Record<string, AnyFlag>;
