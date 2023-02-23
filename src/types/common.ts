export const FlagsDataTypes = [
    'attribute',
    'keyword',
    'number',
    'string',
    'comment',
    'default',
] as const;

Object.freeze(FlagsDataTypes);

export interface CodePart {
    scope: typeof FlagsDataTypes;
    children: string[];
}

export interface CodeTokenized {
    language: string | undefined;
    parts: (CodePart | string)[];
}