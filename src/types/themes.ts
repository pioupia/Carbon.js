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

interface ThemeDataColor {
    /**
     * The window colors object.
     */
    window: ThemeDataColorWindow;
    /**
     * The text colors object, for each kind of elements.
     */
    text: ThemeDataColorText;
}

interface ThemeDataProperties {
    /**
     * The text fontSize
     */
    fontSize: number;
}

export interface ThemeData {
    /**
     * Colors parameters
     */
    colors: ThemeDataColor,
    /**
     * Sizes parameters
     */
    properties: ThemeDataProperties
}