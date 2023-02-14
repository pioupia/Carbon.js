export const FlagsDataTypes = {
    NEUTRAL: 0,
    BREAKLINE: 1,
    STRING: 2,
    INT: 3,
    FUNCTION: 4,
    COMMENT: 5,
    KEYWORDS: 6 // (const, var, return etc...)
} as const;

Object.freeze(FlagsDataTypes);

export interface CodePart {
    content: string
    type: typeof FlagsDataTypes
    words: string[]
}