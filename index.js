#!/usr/bin/env node
const t = require('babel-types');

const CALC_PKG = 'babel-plugin-calculate/utils/decimal-utils.js';

function insertBeforeUp(path, importDeclaration) {
	const p = path.parentPath;
	if (path.type === 'Program') {
		if (path.get) {
			path.get('body')[0].insertBefore(importDeclaration);
		}
	} else {
		insertBeforeUp(p);
	}
}

const usedFun = new Set();
module.exports = (api, opt, dirname) => {
	return {
		visitor: {
			Program(path, state) {
				// 获取当前文件的绝对路径
				path.traverse({
					BinaryExpression(cPath) {
						const { node } = cPath;
						const { operator, left, right } = node;
						let fun = null;
						switch (operator) {
							case '+':
								fun = 'decAdd';
								break;
							case '-':
								fun = 'decSub';
								break;
							case '*':
								fun = 'decMul';
								break;
							case '/':
								fun = 'decDiv';
								break;
						}
						if (fun) {
							// 转换并搜集使用到的精度方法，接入时统一引入
							const calcNode = t.callExpression(t.identifier(fun), [left, right]);
							cPath.replaceWith(calcNode);
							usedFun.add(fun);
						}
					}
				});

				if (!usedFun.size) return;
                
                // 自动引入使用到的方法
				const importSpecifier = [];
				usedFun.forEach(fun => {
					const fName = t.identifier(fun);
					importSpecifier.push(t.importSpecifier(fName, fName));
				});
				const importDeclaration = t.importDeclaration(importSpecifier, t.stringLiteral(CALC_PKG));
				insertBeforeUp(path, importDeclaration);

				usedFun.clear();
			}
		}
	};
};
