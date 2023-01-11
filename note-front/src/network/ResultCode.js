/**
 * 错误代码是code
 * errMessage是错误代码对应的信息
 * to是要发生该错误时需要跳转的url，可选参数
 *
 * codeMap
 *    code: [errMessage, to？]
 */
const codeMap = new Map();

const codes = [
  [20001, "The user is not logged in, please login first", "/login"],
  [50004, "Note does not exist ", "/"],
];

for (const item of codes) {
  codeMap.set(item[0], [item[1], item[2]]);
}

export default codeMap;
