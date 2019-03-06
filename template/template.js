/**
 * 元素标签格式化
 * @param {*} str
 */
function str_format(str) {
  return str
    .replace(/'/g, '"')
    .replace(/\s*(?:\n|\r)\s*/g, "")
    .trim();
}

/**
 * 逻辑代码编译处理
 * @param {*} str
 */
function deal_logic(str) {
  const REG = /<%([^=%]*)%>/g;
  let _str = 'let str = "";\n';
  let exec;
  let index = 0;
  let content;
  while ((exec = REG.exec(str))) {
    content = str_format(str.slice(index, exec.index));
    if (content) {
      _str += `str += '${content}';\n`;
    }
    _str += `${str_format(exec[1])}\n`;
    index = exec.index + exec[0].length;
  }
  /**
   * 模板没有逻辑处理
   * 应该都是html元素
   */
  if (index === 0) {
    // 去除换行空格，避免new Function解析报错
    _str += `str += '${str_format(str)}';`;
    return _str;
    // return str.replace(/\s*(\n|\r)\*/g, "");
  }
  // 屁股的元素
  content = str_format(str.slice(index));

  // console.log(content);
  if (content) {
    _str += `str += '${content}';\n`;
  }
  _str += "return str;\n";
  return _str;
}

function deal_data(str) {
  const REG = /<%=([^%]*)%>/g;
  return str.replace(REG, ($0, $1) => `'+ ${$1} +'`);
}

export default function template(source, data) {
  const logic_str = deal_logic(source);
  const exec_str = deal_data(logic_str);

  let keys = [];
  let values = [];
  if (!!data && typeof data === "object") {
    keys = Object.keys(data);
    values = keys.map(key => data[key]);
  }

  return new Function(...keys, exec_str)(...values);
}
