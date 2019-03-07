// ZHRL programming language, implemented in TypeScript
// Garrett Wayne
// Weston Odend'hal

type ExprC = numC | idC | appC | lamC | strC | condC;
type Value = numV | boolV | primV | cloV | strV;
type Env = Binding[];

class numC {
    n: number;
    constructor(n: number) {
        this.n = n;
    }
    equals(other: ExprC) {
        if (other instanceof numC) {
            return this.n === other.n;
        }
        else {
            return false;
        }
    }
}

class strC {
    str: string;
    constructor(str: string) {
        this.str = str;
    }
    equals(other: ExprC) {
        if (other instanceof strC) {
            return this.str === other.str;
        }
        else {
            return false;
        }
    }
}

class idC {
    s: string;
    constructor(s: string) {
        this.s = s;
    }
    equals(other: ExprC) {
        if (other instanceof idC) {
            return this.s === other.s;
        }
        else {
            return false;
        }
    }
}

function arraysEqual(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (var i = 0; i < a.length; ++i) {
        if (!a[i].equals(b[i])) {
            return false;
        }
    }
    return true;
}

class appC {
    fun: ExprC;
    args: ExprC[];
    constructor(fun: ExprC, args: ExprC[]) {
        this.fun = fun;
        this.args = args;
    }
    equals(other: ExprC) {
        if (other instanceof appC) {
            return (this.fun.equals(other.fun))
                && arraysEqual(this.args, other.args);
        }
        else {
            return false;
        }
    }
}

class condC {
    test: ExprC;
    then: ExprC;
    els: ExprC;
    constructor(test: ExprC, then: ExprC, els: ExprC) {
        this.test = test;
        this.then = then;
        this.els = els;
    }
    equals(other: ExprC) {
        if (other instanceof condC) {
            return (this.test === other.test)
                && (this.then === other.then)
                && (this.els === other.els);
        }
        else {
            return false;
        }
    }
}

class lamC {
    args: string[];
    body: ExprC;
    constructor(args: string[], body: ExprC) {
        this.args = args;
        this.body = body;
    }
    equals(other: ExprC) {
        if (other instanceof lamC) {
            return (this.body === other.body)
                && arraysEqual(this.args, other.args);
        }
        else {
            return false;
        }
    }
}

class numV {
    n: number;
    constructor(n: number) {
        this.n = n;
    }
    equals(other: numV) {
        return this.n === other.n;
    }
}

class strV {
    str: string;
    constructor(str: string) {
        this.str = str;
    }
    equals(other: strV) {
        return this.str === other.str;
    }
}

class boolV {
    val: boolean;
    constructor(val: boolean) {
        this.val = val;
    }
    equals(other: boolV) {
        return this.val === other.val;
    }
}

class cloV {
    params: string[];
    body: ExprC;
    environment: Env;
    constructor(params: string[], body: ExprC, env: Env) {
        this.params = params;
        this.body = body;
        this.environment = env;
    }
    equals(other: cloV) {
        return false;
    }
}

class primV {
    op: (args: Value[]) => Value;
    constructor(op: (args: Value[]) => Value) {
        this.op = op;
    }
    equals(other: primV) {
        return false;
    }
}

class Binding {
    name: string;
    val: Value;
    constructor(name: string, val: Value) {
        this.name = name;
        this.val = val;
    }
}

// Global Functions and Data

// Consumes an Env, list of strings and Values and extends an existing environment, returning a new environment
function envExtends(e: Env, params: string[], vals: Value[]): Env {
    for (var i = 0; i < params.length && i < vals.length; i++) {
        e.push(new Binding(params[i], vals[i]));
    }
    return e;
}

// Consumes an Env and looks up a string for a Value in the environment
function envLookup(e: Env, s: string): Value {
    for (var i = e.length - 1; i >= 0; i--) {
        if (e[i].name == s) {
            return e[i].val;
        }
    }
    throw "ZHRL: name not found in environment";
}

// A version of racket's addition, Consuming two Value's and returning a Value
function myPlus(args: Value[]): Value {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new numV((args[0] as numV).n + (args[1] as numV).n);
    }
    throw "ZHRL: primative operator + arity or called on non-number values";
}

// A version of racket's subtraction, Consuming two Value's and returning a Value
function mySubtract(args: Value[]): Value {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new numV((args[0] as numV).n - (args[1] as numV).n);
    }
    throw "ZHRL: primative operator - arity or called on non-number values";
}

// A version of racket's multiplication, Consuming two Value's and returning a Value
function myMultiply(args: Value[]): Value {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new numV((args[0] as numV).n * (args[1] as numV).n);
    }
    throw "ZHRL: primative operator * arity or called on non-number values";
}

// A version of racket's division, Consuming two Value's and returning a Value
function myDivide(args: Value[]): Value {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        if ((args[1] as numV).n == 0) {
            console.error("ZHRL: CANNOT DIVIDE BY ZERO!");
        }
        else {
            return new numV((args[0] as numV).n / (args[1] as numV).n);
        }
    }
    throw "ZHRL: primative operator + arity or called on non-number values";
}

// A version of racket's <=, Consuming two Value's and returning a Value
function myLessThanOrEqualTo(args: Value[]): Value {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new boolV((args[0] as numV).n <= (args[1] as numV).n);
    }
    throw "ZHRL: primative operator <= arity or called on non-number values";
}

// A version of racket's multiplication, Consuming two Value's and returning a Value
function myEqual(args: Value[]): Value {
    if (args.length == 2 && !(args[0] instanceof cloV) && !(args[1] instanceof cloV) &&
        !(args[0] instanceof primV) && !(args[1] instanceof primV)) {
        return new boolV(args[0] == args[1]);
    }
    return new boolV(false);
}

// Our top env
var topEnv: Env = [new Binding('+', new primV(myPlus)),
new Binding('-', new primV(mySubtract)),
new Binding('*', new primV(myMultiply)),
new Binding('/', new primV(myDivide)),
new Binding('true', new boolV(true)),
new Binding('false', new boolV(false)),
new Binding('<=', new primV(myLessThanOrEqualTo)),
new Binding('equal?', new primV(myEqual))];

// parse and interpret ZHRL concrete syntax
function top_interp(s: any): Value {
    return interp(parse(s), topEnv);
}

// interpret ZHRL abstract syntax
function interp(expression: ExprC, environment: Env): Value {
    switch (expression.constructor) {
        case numC:
            return new numV((expression as numC).n);
        case strC:
            return new strV((expression as strC).str);
        case idC:
            return envLookup(environment, (expression as idC).s);
        case condC:
            let test = interp((expression as condC).test, environment);
            if (test instanceof boolV) {
                if (test.val) {
                    return interp((expression as condC).then, environment);
                }
                else {
                    return interp((expression as condC).els, environment);
                }
            }
            else {
                throw "ZHRL: test clause is not a boolean"
            }
        case lamC:
            let parameters = (expression as lamC).args;
            let body = (expression as lamC).body;
            return new cloV(parameters, body, environment);
        case appC:
            let fun = interp((expression as appC).fun, environment);
            let args = (expression as appC).args.map(
                function(x: ExprC): Value {
                    return interp(x, environment);
                });
            switch (fun.constructor) {
                case primV:
                    return (fun as primV).op(args);
                case cloV:
                    let closure = envExtends((fun as cloV).environment,
                        (fun as cloV).params, args);
                    return interp((fun as cloV).body, closure);
                default:
                    throw "ZHRL: application of a non-closure";
            }
        default:
            throw "ZHRL: malformed abstract syntax tree";
    }
}

// The Parser
function topParse(s: string): any {
    var currentOpenCurly = s.indexOf("{");
    if (currentOpenCurly < 0) {
        return s
    }
    var bigArr: any[] = [];
    var currentClosingCurly = s.indexOf("}");
    var nextOpeningCurly = s.indexOf("{", currentOpenCurly + 1);
    if (nextOpeningCurly > 0 && currentClosingCurly > nextOpeningCurly) {
        bigArr.push(topParse(s.substring(currentOpenCurly + 1, nextOpeningCurly - 1)));

        bigArr.concat(topParse(s.substring(nextOpeningCurly, s.length)));

        return bigArr;
    }
    else {
        bigArr = s.substring(currentOpenCurly + 1, currentClosingCurly).split(" ").map(topParse);
        return bigArr;
    }
    // var currentSpace = s.indexOf(" ");
    // var currentStr = s.substring(currentOpenCurly + 1, currentSpace);
    
}

function parse(s: any): ExprC {
    if (typeof s === "number") {
        return new numC(s);
    }
    if (typeof s === "string") {
        if ((s.charAt(0) != '"') || s.charAt(s.length - 1) != '"') {
            return new idC(parseSymbol(s));
        }
        else {
            return new strC(s.substring(1, s.length - 1));
        }
    }
    if (typeof s === "object") {
        if (s.length > 0) {
            if (s[0] == "if") {
                if (s.length == 4) {
                    return new condC(parse(s[1]), parse(s[2]), parse(s[3]));
                }
                else {
                    throw "ZHRL: wrongly formatted if expression";
                }
            }
            else if (s[0] == "var") {
                if (s.length > 1) {
                    return desugarVar(s);
                }
                else {
                    throw "ZHRL: wrongly formatted var expression";
                }
            }
            else if (s[0] == "lam") {
                if (s.length == 3) {
                    if (!hasDups(s[1])) {
                        return new lamC(s[1].map(parseSymbol), parse(s[2])); // could have numbers and dups passed into s[1]
                    }
                    else {
                        throw "ZHRL: lambda expression has duplicate formal parameters present";
                    }
                }
                else {
                    throw "ZHRL: wrongly formatted lambda expression";
                }
            }
            else {
                return new appC(parse(s[0]), s.slice(1, s.length).map(parse));
            }
        }
    }
    else {
        throw "ZHRL: wrongly formatted expression";
    }
}

function desugarVar(s: any[]): ExprC {
    var ids: any[] = [];
    var assignments: any[] = [];
    for (var i = 1; i < s.length - 1; i++) {
        if (s[i].length == 3 && s[i][1] == "=") {
            ids.push(s[i][0]);
            assignments.push(s[i][2]);
        }
        else {
            throw "ZHRL: wrongly formatted var expression";
        }
    }
    return parse([['lam', ids, s[s.length - 1]]].concat(assignments));
}

function hasDups(s: any[]) {
    for (var i = 0; i <= s.length; i++) {
        for (var j = i; j <= s.length; j++) {
            if (i != j && s[i] == s[j]) {
                return true;
            }
        }
    }
    return false;
}

function parseSymbol(s: string): string {
    if (s == "var" || s == "if" || s == "lam" || s == "=" || typeof s != "string") {
        throw "ZHRL: wrongly formatted symbol";
    }
    else {
        return s;
    }
}

// Tests
console.log((top_interp(['var', ['x', '=', 15], ['z', '=', 14],
    ['+', 'x', 'z']]) as numV).equals(new numV(29)));
console.log(parse(0).equals(new numC(0)));
console.log(parse('"a"').equals(new strC("a")));
console.log(parse("a").equals(new idC("a")));
console.log(parse(["+", 0, 1])
    .equals(new appC(new idC("+"), [new numC(0), new numC(1)])));

console.log((interp(new numC(0), topEnv) as numV).equals(new numV(0)));
console.log((interp(new strC("a"), topEnv) as strV).equals(new strV("a")));
console.log((interp(new idC("true"), topEnv) as boolV)
    .equals(new boolV(true)));
console.log((interp(new appC(new lamC(["x"],
    new appC(new idC("+"), [new idC("x"), new numC(1)])), [new numC(0)]),
    topEnv) as numV).equals(new numV(1)));
console.log((interp(new condC(new idC("true"), new numC(1), new numC(0)),
    topEnv) as numV).equals(new numV(1)));

