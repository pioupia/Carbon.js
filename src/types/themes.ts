interface ThemeDataColorText {
    /**
     * Color of keywords (e.g. const, let, switch, break...)
     */
    keyword: string;
    /**
     * Color of the boolean
     */
    boolean: string;
    /**
     * Color of the numbers
     */
    number: string;
    /**
     * Color of the strings
     */
    string: string;
    /**
     * Color of the variable name of a function
     */
    "function-variable": string;
    /**
     * Color of a function parameter
     */
    parameter: string;
    /**
     * Color of a called function (e.g. render(...) -> the 'render' keyword will be colored)
     */
    function: string;
    /**
     * Color of builtin functions
     */
    builtin: string;
    /**
     * Color of the class name
     */
    "class-name": string;
    /**
     * Color of a char (single character)
     */
    char: string;
    /**
     *  A primitive data type found in some languages, can be thought of as an identifier.
     */
    symbol: string;
    /**
     * Color of regular expressions
     */
    regex: string;
    /**
     * Color of links
     */
    url: string;
    /**
     * Color of operators (e.g. +, -, -=, > ...)
     */
    operator: string;
    /**
     * Color of a variable
     */
    variable: string;
    /**
     * Color of a constant variable
     */
    constant: string;
    /**
     * Color of an attribute/characteristic
     * @example
     * body {
     *  color: red; // The "color"
     *  line-height: normal; // And "line-height" will be colored.
     * }
     */
    property: string;
    /**
     * Color of an object/map key
     * @example
     * const obj = { "test": true }; / The "test" will be colored
     */
    "string-property": string;
    /**
     * Color of the punctuation such as brackets, parentheses, commas, and more
     */
    punctuation: string;
    /**
     * Color of important things like:
     * - !important (in css)
     * - \# title (in markdown)
     */
    important: string;
    /**
     * Color of the comments
     */
    comment: string;
    /**
     * Color of the HTML tags
     */
    tag: string;
    /**
     * HTML attribute's name
     */
    "attr-name": string;
    /**
     * HTML attribute's value
     */
    "attr-value": string;
    /**
     * Color of namespaces
     */
    namespace: string;
    /**
     * Color of the first part of an XML document
     */
    prolog: string;
    /**
     * Color of the document type declaration (Markup language)
     */
    doctype: string;
    /**
     * Color of character data, specific to markup languages
     */
    cdata: string;
    /**
     * Color of code used to display reserved characters in markup languages
     * @example
     * &amp; &#x2665; &#160; &#x152;
     */
    entity: string;
    /**
     * Color with bold text (Markdown)
     */
    bold: string;
    /**
     * Color with italic text (Markdown)
     */
    italic: string;
    /**
     * Color of atrule (`@` rules in stylesheet).
     * @examples
     * \@font-family
     * \@media screen and ...
     */
    atrule: string;
    /**
     * Color of selector (in stylesheet)
     */
    selector: string;
    /**
     * Color of inserted text (Mardown)
     */
    inserted: string;
    /**
     * Color of deleted text (Markdown)
     */
    deleted: string;
}

interface ThemeDataColorWindow {
    /**
     * Background color of the window
     */
    backgroundColor: string;
    /**
     * Text color when the token has no type.
     */
    defaultForegroundColor: string;
    /**
     * Color of the window's close button
     */
    closeWindowColor: string;
    /**
     * Stroke color of the window's close button
     */
    closeWindowColorStroke: string;
    /**
     * Color of the window's minify button
     */
    minifyWindowColor: string;
    /**
     * Stroke color of the window's minify button
     */
    minifyWindowColorStroke: string;
    /**
     * Color of the window's reduce button
     */
    reduceWindowColor: string;
    /**
     * Stroke color of the window's reduce button
     */
    reduceWindowColorStroke: string;
}

export interface ThemeDataColor {
    /**
     * The window colors object.
     */
    window: ThemeDataColorWindow;
    /**
     * The text colors object, for each kind of elements.
     */
    text: ThemeDataColorText;
}

export interface ThemeDataProperties {
    /**
     * The text fontSize
     */
    fontSize: number;
    /**
     * The font name used for the theme
     */
    fontName: string;
}

export interface ThemeData {
    /**
     * Colors parameters
     */
    colors: ThemeDataColor;
    /**
     * Sizes parameters
     */
    properties: ThemeDataProperties;
    /**
     * Background properties
     */
    background: BackgroundProperties;
}


interface OptionalThemeDataColor {
    /**
     * The window colors object.
     */
    window?: Partial<ThemeDataColorWindow>;
    /**
     * The text colors object, for each kind of elements.
     */
    text?: Partial<ThemeDataColorText>;
}

export interface BackgroundProperties {
    /**
     * The background color
     */
    backgroundColor: string;

    /**
     * The top padding of the background
     */
    paddingTop: number;
    /**
     * The bottom padding of the background
     */
    paddingBottom: number;
    /**
     * The left padding of the background
     */
    paddingLeft: number;
    /**
     * The right padding of the background
     */
    paddingRight: number;

    /**
     * Whether there is a shadow under the window
     */
    hasShadow: boolean;

    /**
     * The blur of the shadow
     */
    shadowBlur: number;
    /**
     * The color of the shadow (hexadecimal)
     */
    shadowColor: string;
    /**
     * Distance that shadows will be offset horizontally
     *
     * @remarks
     * This method behaves similarly
     * to {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX}.
     */
    shadowOffsetX: number;
    /**
     * Distance that shadows will be offset vertically
     *
     * @remarks
     * This method behaves similarly
     * to {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY}.
     */
    shadowOffsetY: number;
}

export interface OptionalThemeData {
    /**
     * Colors parameters
     */
    colors?: OptionalThemeDataColor;
    /**
     * Sizes parameters
     */
    properties?: Partial<ThemeDataProperties>;
    /**
     * Background properties
     */
    background?: Partial<BackgroundProperties>;
}