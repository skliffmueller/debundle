const replace = require('../extern/replace-method');

// Webpack debundling shim
// Here's what a webpack bundle looks like:
//
// (function(modules) {
//   // webpack require shim is here
// })([
//   function(module, exports, __webpack_require__) {
//     var foo = __webpack_require__(2); // The index of the item to pull in within the array
//   },
//   function(module, exports, __webpack_require__) {
//     "I am foo!";
//   }
// ])
function webpackDecoder(moduleArrayAST, knownPaths) {
  // Ensure that the bit of AST being passed is an array
  if (moduleArrayAST.type !== 'ArrayExpression' && moduleArrayAST.type !== 'ObjectExpression') {
    throw new Error(`The root level IIFE didn't have an array for it's first parameter, aborting...`);
  }
  if (moduleArrayAST.type === 'ArrayExpression') {
      return moduleArrayAST.elements.map((moduleDescriptor, id) => {
          return {
              id,
              code: moduleDescriptor,
          };
      }).filter(i => i.code);
  }
  if (moduleArrayAST.type === 'ObjectExpression') {
    return moduleArrayAST.properties.map((moduleDescriptor) => {
        return {
            id: Number(moduleDescriptor.key.value),
            code: moduleDescriptor.value,
        };
    }).filter(i => i.code);
  }
}

function getModuleFileName(node, knownPaths) {
  let id = node.arguments[0].raw;
  return knownPaths[id] ? knownPaths[id] : `./${id}`;
}

module.exports = webpackDecoder;
