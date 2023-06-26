const { transform } = require('lightningcss');
const { readFileSync } = require("fs");
const { join } = require("path")

/** @type {Record<string, import('lightningcss').TokenOrValue[]>} */
const cssVariables = {}

// we extract all custom variable declarations so we can use the css syntax
// to declare the variables and dont need to write them in lightningcss AST ourselves
transform({
    code: readFileSync(join(__dirname, "cssVariables.css")),
    visitor: {
        Declaration: ({property, value}) => {
            if (property !== "custom") {
                throw new Error("Only variable declarations expected.")
            }
            cssVariables[value.name] = value.value
        }
    }
})

/**
 * lightningcss AST visitor (plugin), to compile the used CSS variables directly into the css
 *
 * @returns {import("lightningcss").Visitor}
 */
const compileWithCssVariables = () => ({
    Variable: (variable) => {
        const variableValueTokens = cssVariables[variable.name.ident];
        if (!variableValueTokens) {
            throw new Error(`The css variable "${variable.name.ident}" cannot be compiled, because it was not declared.`);
        }
        return [
            ...variableValueTokens,
            {
                // we a append a single space to the tokenList so that when the value is insertet
                // it wont collide with further parameters like in this case:
                // padding: 0 var(--spacing-GoldenUnit) 0 var(--spacing-Full);
                // otherwise we would get:
                // padding: 0 40px0 16px
                //               |__________ here must be a space
                type: "token",
                value: {
                    type: "delim",
                    value: " "
                }
            }
        ]
    }
})

module.exports = { compileWithCssVariables }
