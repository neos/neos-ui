const { transform } = require('lightningcss');
const { readFileSync } = require("fs");
const { join } = require("path")

/** @type {Record<string, import('lightningcss').TokenOrValue>} */
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
        return cssVariables[variable.name.ident]
    }
})

module.exports = { compileWithCssVariables }
