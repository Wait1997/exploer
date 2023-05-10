const { declare } = require('@babel/helper-plugin-utils');
const importModule = require('@babel/helper-module-imports');

const autoTrackPlugin = declare((api, options, dirname) => {
  api.assertVersion(7);

  return {
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse({
            ImportDeclaration(curPath) {
              const reuqirePath = curPath.get('source').node.value;
              if (reuqirePath === options.trackerPath) {
                const specifierPath = curPath.get('specifiers.0');

                if (specifierPath.isImportSpecifier()) {
                  // named 按需导入
                  state.trackerImportId = specifierPath.toString();
                } else if (specifierPath.isImportDefaultSpecifier()) {
                  // import 默认导入
                  state.trackerImportId = specifierPath.toString();
                } else if (specifierPath.isImportNamespaceSpecifier()) {
                  // import * as 全局别名导入
                  state.trackerImportId = specifierPath.get('local').toString();
                }

                // path.stop();
              }
            }
          });

          if (!state.trackerImportId) {
            state.trackerImportId = importModule.addDefault(path, 'tracker', {
              nameHint: path.scope.generateUid('tracker')
            }).name;
            state.trackerAST = api.template.statement(`${state.trackerImportId}()`)();
          } else {
            state.trackerAST = api.template.statement(`${state.trackerImportId}()`)();
          }
        }
      },
      'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
        const bodyPath = path.get('body');
        if (bodyPath.isBlockStatement()) {
          bodyPath.node.body.unshift(state.trackerAST);
        } else {
          const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({
            PREV_BODY: bodyPath.node
          });
          bodyPath.replaceWith(ast);
        }
      }
    }
  };
});

module.exports = autoTrackPlugin;
