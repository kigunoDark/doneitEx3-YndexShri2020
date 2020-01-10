// JSON-SOURCE-MAP
'use strict';
require("util").inspect.defaultOptions.depth = null;

let escapedChars = {
  'b': '\b',
  'f': '\f',
  'n': '\n',
  'r': '\r',
  't': '\t',
  '"': '"',
  '/': '/',
  '\\': '\\'
};

let A_CODE = 'a'.charCodeAt();

let parse = (source, _, options) => {
  let pointers = {};
  let line = 0;
  let column = 0;
  let pos = 0;
  let bigint = options && options.bigint && typeof BigInt != 'undefined';
  return {
    data: _parse('', true),
    pointers: pointers
  };

  function _parse(ptr, topLevel) {
    whitespace();
    let data;
    map(ptr, 'value');
    let char = getChar();
    switch (char) {
      case 't': read('rue'); data = true; break;
      case 'f': read('alse'); data = false; break;
      case 'n': read('ull'); data = null; break;
      case '"': data = parseString(); break;
      case '[': data = parseArray(ptr); break;
      case '{': data = parseObject(ptr); break;
      default:
        backChar();
        if ('-0123456789'.indexOf(char) >= 0)
          data = parseNumber();
        else
          unexpectedToken();
    }
    map(ptr, 'valueEnd');
    whitespace();
    if (topLevel && pos < source.length) unexpectedToken();
    return data;
  }

  function whitespace() {
    loop:
      while (pos < source.length) {
        switch (source[pos]) {
          case ' ': column++; break;
          case '\t': column += 4; break;
          case '\r': column = 0; break;
          case '\n': column = 0; line++; break;
          default: break loop;
        }
        pos++;
      }
  }

  function parseString() {
    let str = '';
    let char;
    while (true) {
      char = getChar();
      if (char == '"') {
        break;
      } else if (char == '\\') {
        char = getChar();
        if (char in escapedChars)
          str += escapedChars[char];
        else if (char == 'u')
          str += getCharCode();
        else
          wasUnexpectedToken();
      } else {
        str += char;
      }
    }
    return str;
  }

  function parseNumber() {
    let numStr = '';
    let integer = true;
    if (source[pos] == '-') numStr += getChar();

    numStr += source[pos] == '0'
              ? getChar()
              : getDigits();

    if (source[pos] == '.') {
      numStr += getChar() + getDigits();
      integer = false;
    }

    if (source[pos] == 'e' || source[pos] == 'E') {
      numStr += getChar();
      if (source[pos] == '+' || source[pos] == '-') numStr += getChar();
      numStr += getDigits();
      integer = false;
    }

    let result = +numStr;
    return bigint && integer && (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER)
            ? BigInt(numStr)
            : result;
  }

  function parseArray(ptr) {
    whitespace();
    let arr = [];
    let i = 0;
    if (getChar() == ']') return arr;
    backChar();

    while (true) {
      let itemPtr = ptr + '/' + i;
      arr.push(_parse(itemPtr));
      whitespace();
      let char = getChar();
      if (char == ']') break;
      if (char != ',') wasUnexpectedToken();
      whitespace();
      i++;
    }
    return arr;
  }

  function parseObject(ptr) {
    whitespace();
    let obj = {};
    if (getChar() == '}') return obj;
    backChar();

    while (true) {
      let loc = getLoc();
      if (getChar() != '"') wasUnexpectedToken();
      let key = parseString();
      let propPtr = ptr + '/' + escapeJsonPointer(key);
      mapLoc(propPtr, 'key', loc);
      map(propPtr, 'keyEnd');
      whitespace();
      if (getChar() != ':') wasUnexpectedToken();
      whitespace();
      obj[key] = _parse(propPtr);
      whitespace();
      let char = getChar();
      if (char == '}') break;
      if (char != ',') wasUnexpectedToken();
      whitespace();
    }
    return obj;
  }

  function read(str) {
    for (let i=0; i<str.length; i++)
      if (getChar() !== str[i]) wasUnexpectedToken();
  }

  function getChar() {
    checkUnexpectedEnd();
    let char = source[pos];
    pos++;
    column++; 
    return char;
  }

  function backChar() {
    pos--;
    column--;
  }

  function getCharCode() {
    let count = 4;
    let code = 0;
    while (count--) {
      code <<= 4;
      let char = getChar().toLowerCase();
      if (char >= 'a' && char <= 'f')
        code += char.charCodeAt() - A_CODE + 10;
      else if (char >= '0' && char <= '9')
        code += +char;
      else
        wasUnexpectedToken();
    }
    return String.fromCharCode(code);
  }

  function getDigits() {
    let digits = '';
    while (source[pos] >= '0' && source[pos] <= '9')
      digits += getChar();

    if (digits.length) return digits;
    checkUnexpectedEnd();
    unexpectedToken();
  }

  function map(ptr, prop) {
    mapLoc(ptr, prop, getLoc());
  }

  function mapLoc(ptr, prop, loc) {
    pointers[ptr] = pointers[ptr] || {};
    pointers[ptr][prop] = loc;
  }

  function getLoc() {
    return {
      line: line + 1,
      column: column + 1,
      offset: pos
    };
  }

  function unexpectedToken() {
    throw new SyntaxError('Unexpected token ' + source[pos] + ' in JSON at position ' + pos);
  }

  function wasUnexpectedToken() {
    backChar();
    unexpectedToken();
  }

  function checkUnexpectedEnd() {
    if (pos >= source.length)
      throw new SyntaxError('Unexpected end of JSON input');
  }
};

let ESC_0 = /~/g;
let ESC_1 = /\//g;
function escapeJsonPointer(str) {
  return str.replace(ESC_0, '~0')
            .replace(ESC_1, '~1');
}


//   MY PART OF CODE
  
  const size = [
    "xxxs",
    "xxs",
    "xs",
    "s",
    "m",
    "l",
    "xl",
    "xxl",
    "xxxl",
    "xxxxl",
    "xxxxxl"
  ];
  

  
const addError = (data, obj, link) => {
    data.errors.push({
        key: obj.code,
        // error: obj.error,
        loc: {
            start: {
                column: data.pnt[link].value.column,
                line: data.pnt[link].value.line,
                offset: data.pnt[link].value.offset,
            },
            end: {
                column: data.pnt[link].valueEnd.column,
                line: data.pnt[link].valueEnd.line,
                offset:  data.pnt[link].valueEnd.offset,
            }
        }
    });
};

function ErrorsTitle() {
   
    this.titleH1 = {
      code: "TEXT.SEVERAL_H1",
      error: "Заголовок первого уровня (блок text с модификатором type h1)" +
             "на странице должен быть единственным"
    };

    this.titleH2 = {
      code: "TEXT.INVALID_H2_POSITION",
      error: "Заголовок второго уровня (блок text с модификатором type h2)" + 
             "не может находиться перед заголовком первого уровня на том же или более глубоком уровне вложенности",
      location: []
    };

    this.titleH3 = {
      code: "TEXT.INVALID_H3_POSITION",
      error: "Заголовок третьего уровня (блок text с модификатором type h3)" +
             "не может находиться перед заголовком второго уровня на том же или более глубоком" +
             "Sуровне вложенности",
      location: []
    };

    this.counter = 0;

  this.errorDist = function(obj, errsList, link) {

    if (obj.block !== "text" || !obj.mods) return;
    switch (obj.mods.type) {
      case "h1":
        if (errsList.counter > 0) {
          addError(this, errsList.titleH1, link);
        };
        errsList.counter++;

        if (errsList.titleH2.location.length > 0) {
          errsList.titleH2.location.forEach(e => {
            addError(this, errsList.titleH2, e);
          });
          errsList.titleH2.location.length = 0;
        };
        break;

      case "h2":
        errsList.titleH2.location.push(link);

        if (errsList.titleH3.location.length > 0) {
          errsList.titleH3.location.forEach(e => {
            addError(this, errsList.titleH3, e);
          });
          errsList.titleH3.location.length = 0;
        };
        break;

      case "h3":
        errsList.titleH3.location.push(link);
        break;
    };
  };
};
  
  
function ErrorsGrid(obj) {

    this.code = "GRID.TOO_MUCH_MARKETING_BLOCKS";
    this.error = "Слишком много макркетинговых блоков в Grid";
    this.counter = 0;
    this.max = obj.max;
    this.market = 0;
    this.link = obj.link;

    this.errorDist = function (obj, errsList) {
    switch (obj.block) {
        case "offer":
        case "commercial":
        errsList.market += errsList.counter;
        if (errsList.max / 2 < errsList.market) {
          addError(this, errsList, errsList.link);
        };
        break;
    };
  };

};
  
function WarningErrors(link) {
    
    this.txtSize = {
        code: "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
        mods: { size: "none" },
        error: "Все тексты (блоки text) в блоке warning должны быть одного размера",
        appropriate: true
    };
  
    this.btnSize = {
        code: "WARNING.INVALID_BUTTON_SIZE",
        error: "Размер кнопки блока warning должен быть на 1 шаг больше текста" + 
               "(например, для размера l таким значением будет xl)",
        mods: { size: "none" },
        location: []
    };

    this.plhSize = {
        code: "WARNING.INVALID_PLACEHOLDER_SIZE",
        error: "Допустимые размеры для блока placeholder в блоке warning " +
               "(значение модификатора size): s, m, l",
        mods: { size: ["s", "m", "l"] }
    };

    this.plhPosition = {
        code: "WARNING.INVALID_BUTTON_POSITION",
        error: "Блок button в блоке warning не может находиться перед блоком placeholder" +
               "на том же или более глубоком уровне вложенности"
    };

    this.location = link;  

    this.errorDist = function (obj, errsList, link) {
     switch(obj.block) {
         case "text":
            if (errsList.txtSize.mods.size === "none") {
              if (!obj.mods) return;
                const buttonSize = size[size.indexOf(obj.mods.size) + 1];
                errsList.txtSize.mods.size = obj.mods.size;
                errsList.btnSize.mods.size = buttonSize;
              return;
            };
        
            if (errsList.txtSize.mods.size !== obj.mods.size && errsList.txtSize.appropriate) {
                addError(this, errsList.txtSize, errsList.location);
                errsList.txtSize.appropriate = false;
            };
         break;

         case "button":
            errsList.btnSize.location.push(link);
  
            if (!obj.mods) return;
      
            if (errsList.btnSize.mods.size === "none") {
              errsList.btnSize.location.push({ size: obj.mods.size, link });
              return;
            };

            if (errsList.btnSize.mods.size !== obj.mods.size) addError(this, errsList.btnSize, link);

         break;

         case "placeholder":
            if (errsList.btnSize.location.length > 0) {
                errsList.btnSize.location.forEach(e => {
                  addError(this, errsList.plhPosition, e);
                });
                errsList.btnSize.location.length = 0;
              };
        
              if (!obj.mods) return;
        
              if (!errsList.plhSize.mods.size.includes(obj.mods.size)) {
                addError(this, errsList.plhSize, link);
              };
         break;
     };
      
  
    };
};

const RulesFactory = (obj,  errsList, link) => {
    switch (obj.block) {
        case "warning":
            if(!obj.elem) errsList.warning = new WarningErrors(link);
        break;
        
        case "page":
            if(!obj.elem) errsList.title= new ErrorsTitle();
        break;

        case "grid":
            if(obj.mods) {
              errsList.grid = new ErrorsGrid({ link , max: parseInt(obj.mods["m-columns"]) });
            } 
            if(obj.elemMods) errsList.grid.counter = parseInt(obj.elemMods["m-col"]);
        break;
    };
}
  
let traverse = ( obj, link , errsList = {}) => {
    errsList = { ...errsList };
    if (Array.isArray(obj)) {
      obj.forEach((e, i) => {
        traverse(e, `${link}/${i}`, errsList);
      });
      return;
    };
  
    RulesFactory(obj, errsList, link);
    
    if (obj.content && Array.isArray(obj.content)) {
      const reloadLink   = `${link}/content`;
      traverse(obj.content, reloadLink, errsList);
      return;
    };
  
    if (typeof obj.content === "object" && obj.content !== null) {
      const reloadLink = `${link}/content`;
      traverse(obj.content, reloadLink, errsList);
      return;
    };

    for(let rule in errsList){
      switch(rule) {
        case "warning":
          errsList.warning.errorDist.call(this, obj,errsList.warning, link);
        break;
        case "title":
          errsList.title.errorDist.call(this, obj, errsList.title, link);
        break;
        case "grid":
          errsList.grid.errorDist.call(this, obj, errsList.grid, link);
        break;
      }
    }
   
  };
  
  
let lint = (str)=> {
    console.log(parse(str))
    const obj = parse(str);
    this.errors = [];
    this.pnt = obj.pointers;

    const link = "";
    traverse.call(this, obj.data, link); 
    return this.errors;
};


export default lint;

