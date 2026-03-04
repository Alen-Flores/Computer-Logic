
function parse(input) {
  let i = 0;

  function peek() {
    return input[i];
  }

  function eof() {
    return i >= input.length;
  }

  function consume() {
    return input[i++];
  }

  function skipWhitespace() {
    while (!eof() && /\s/.test(peek())) consume();
  }

  function parseIdentifier() {
    // skipWhitespace();
    let start = i;

    if (!/[a-zA-Z_]/.test(peek())) {
      throw new Error("Expected identifier at position " + i);
    }

    consume();

    while (!eof() && /[a-zA-Z0-9_]/.test(peek())) {
      consume();
    }

    return {
      type: "Identifier",
      name: input.slice(start, i)
    };
  }

  function parseExpression() {
    skipWhitespace();
    const id = parseIdentifier();
    skipWhitespace();

    if (peek() === "(") {
      consume(); // '('
      const args = [];

      skipWhitespace();
      if (peek() !== ")") {
        while (true) {

          if (eof()) {
            throw new Error("Expected <expression> at position " + i);
          }

          args.push(parseExpression());
          skipWhitespace();

          if (peek() === ",") {
            consume();
            skipWhitespace();
            continue;
          }
          break;
        }
      }

      if (peek() !== ")") {
        throw new Error("Expected ')' at position " + i);
      }

      consume(); // ')'

      return {
        type: "CallExpression",
        callee: id,
        arguments: args
      };
    }

    return id;
  }

  const ast = parseExpression();
  skipWhitespace();

  if (i < input.length) {
    throw new Error("Unexpected input at position " + i);
  }

  return ast;
}

function printExpression(node) {
  switch (node.type) {
    case "Identifier":
      return node.name;
    case "CallExpression":
      return printExpression(node.callee) + "(" + node.arguments.map(printExpression).join(", ") + ")";
    default:
      throw new Error("Unexpected node type: " + node.type);
  }
}

function splitExpressions(node) {
  let expressions = new Set([node]);

  switch (node.type) {
    case "Identifier":
      break;
    case "CallExpression":
      node.arguments.forEach(arg => {
        expressions = new Set([...expressions, ...splitExpressions(arg)]);
      });
      break;
    default:
      throw new Error("Unexpected node type: " + node.type);
  }

  return expressions
}

function evalExpressions(exprs) {
  let calls = [];
  let table = new Map();

  for (let expr of exprs) {
    if (expr.type === "Identifier") {
      table.set(JSON.stringify(expr), [])
    } else {
      calls.push(expr);
    }
  }

  let idenCount = table.size;

  for (let i = 0; i < 2 ** idenCount; i++) {
    let vals = i.toString(2).padStart(idenCount, "0");

    for (let j = 0; j < idenCount; j++) {
      let iden = [...table][j];
      table.get(iden[0]).push(vals[j] === "1");
    }
  }

  function evaluate(expr, i) {
    switch (expr.type) {
      case "Identifier":
        return table.get(JSON.stringify(expr))[i];
      case "CallExpression":
        let evaledArgs = expr.arguments.map(arg => evaluate(arg, i));
        switch (expr.callee.name) {
          case "AND":
            return Array.reduce(evaledArgs, (a, b) =>
              a && b);
          case "OR":
            return Array.reduce(evaledArgs, (a, b) =>
              a || b);
          case "XOR":
            return Array.reduce(evaledArgs, (a, b) =>
              a !== b);
          case "NOR":
            return Array.reduce(evaledArgs, (a, b) =>
              !(a || b));
          case "NAND":
            return Array.reduce(evaledArgs, (a, b) =>
              !(a && b));
          case "XNOR":
            return Array.reduce(evaledArgs, (a, b) =>
              a === b);
          case "CONSTT":
            return true;
          case "CONSTF":
            return true;
          case "NOT":
            return !evaluate(expr.arguments[0], i);
        }
    }
  }

  for (let call of calls) {
    let values = [];
    for (let i = 0; i < 2 ** idenCount; i++) {
      values.push(evaluate(call, i))
    }
    table.set(JSON.stringify(call), values)
  }

  return table
}

let tableInput = document.getElementById("table-gen");
let truthTable = document.getElementById("truth-table");

tableInput.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const data = new FormData(tableInput);
  let exprs = evalExpressions(splitExpressions(parse(data.get("expression"))));

  let table = [...exprs].map((x) => [printExpression(JSON.parse(x[0])), x[1]])
  table.sort((a, b) => a[0].length - b[0].length)

  truthTable.innerHTML = "";

  let tr = document.createElement("tr");
  for (let i of table) {
    let th = document.createElement("th");
    th.innerHTML = i[0]
    tr.appendChild(th);
  }
  truthTable.appendChild(tr);


  for (let i = 0; i < table[0][1].length; i++) {
    let trd = document.createElement("tr");
    for (let col of table) {
      let td = document.createElement("td");
      td.innerHTML = col[1][i] ? "1" : "0";
      trd.appendChild(td);
    }
    truthTable.appendChild(trd);
  }
})

