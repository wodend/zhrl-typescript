// ZHRL programming language, implemented in TypeScript
// Garrett Wayne
// Weston Odend'hal
var numC = /** @class */ (function () {
    function numC(n) {
        this.n = n;
    }
    return numC;
}());
var numV = /** @class */ (function () {
    function numV(n) {
        this.n = n;
    }
    return numV;
}());
var strC = /** @class */ (function () {
    function strC(str) {
        this.str = str;
    }
    return strC;
}());
var strV = /** @class */ (function () {
    function strV(str) {
        this.str = str;
    }
    return strV;
}());
var idC = /** @class */ (function () {
    function idC(s) {
        this.s = s;
    }
    return idC;
}());
var appC = /** @class */ (function () {
    function appC(fun, args) {
        this.fun = fun;
        this.args = args;
    }
    return appC;
}());
var condC = /** @class */ (function () {
    function condC(test, then, els) {
        this.test = test;
        this.then = then;
        this.els = els;
    }
    return condC;
}());
var boolV = /** @class */ (function () {
    function boolV(val) {
        this.val = val;
    }
    return boolV;
}());
var lamC = /** @class */ (function () {
    function lamC(args, body) {
        this.args = args;
        this.body = body;
    }
    return lamC;
}());
var cloV = /** @class */ (function () {
    function cloV(params, body) {
        this.params = params;
        this.body = body;
    }
    return cloV;
}());
var primV = /** @class */ (function () {
    function primV(op) {
        this.op = op;
    }
    return primV;
}());
var Binding = /** @class */ (function () {
    function Binding(name, val) {
        this.name = name;
        this.val = val;
    }
    return Binding;
}());
// Global Functions and Data
// Consumes an Env, list of strings and Values and extends an existing environment, returning a new environment
function envExtends(e, params, vals) {
    for (var i = 0; i < params.length && i < vals.length; i++) {
        e.push(new Binding(params[i], vals[i]));
    }
    return e;
}
// Consumes an Env and looks up a string for a Value in the environment
function envLookup(e, s) {
    for (var i = e.length - 1; i >= 0; i--) {
        if (e[i].name == s) {
            return e[i].val;
        }
    }
    throw "ZHRL: name not found in environment";
}
// A version of racket's addition, Consuming two Value's and returning a Value
function myPlus(args) {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new numV(args[0].n + args[1].n);
    }
    throw "ZHRL: primative operator + arity or called on non-number values";
}
// A version of racket's subtraction, Consuming two Value's and returning a Value
function mySubtract(args) {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new numV(args[0].n - args[1].n);
    }
    throw "ZHRL: primative operator - arity or called on non-number values";
}
// A version of racket's multiplication, Consuming two Value's and returning a Value
function myMultiply(args) {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new numV(args[0].n * args[1].n);
    }
    throw "ZHRL: primative operator * arity or called on non-number values";
}
// A version of racket's division, Consuming two Value's and returning a Value
function myDivide(args) {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        if (args[1].n == 0) {
            console.error("ZHRL: CANNOT DIVIDE BY ZERO!");
        }
        else {
            return new numV(args[0].n / args[1].n);
        }
    }
    throw "ZHRL: primative operator + arity or called on non-number values";
}
// A version of racket's <=, Consuming two Value's and returning a Value
function myLessThanOrEqualTo(args) {
    if (args.length == 2 && args[0] instanceof numV && args[1] instanceof numV) {
        return new boolV(args[0].n <= args[1].n);
    }
    throw "ZHRL: primative operator <= arity or called on non-number values";
}
// A version of racket's multiplication, Consuming two Value's and returning a Value
function myEqual(args) {
    if (args.length == 2 && !(args[0] instanceof cloV) && !(args[1] instanceof cloV) &&
        !(args[0] instanceof primV) && !(args[1] instanceof primV)) {
        return new boolV(args[0] == args[1]);
    }
    return new boolV(false);
}
// Our top env
var topEnv = [new Binding('+', new primV(myPlus)),
    new Binding('-', new primV(mySubtract)),
    new Binding('*', new primV(myMultiply)),
    new Binding('/', new primV(myDivide)),
    new Binding('true', new boolV(true)),
    new Binding('false', new boolV(false)),
    new Binding('<=', new primV(myLessThanOrEqualTo)),
    new Binding('equal?', new primV(myEqual))];
function interp(expression, environment) {
    console.log(expression.constructor === numC);
    switch (expression.constructor) {
        case numC:
            return new numV(expression.n);
        case strC:
            return new strV(expression.str);
        case idC:
            return envLookup(environment, expression.s);
        default:
            throw "ZHRL: malformed abstract syntax tree";
    }
}
console.log(interp(new numC(0), topEnv));
console.log(interp(new strC("a"), topEnv));
console.log(interp(new idC("true"), topEnv));
// The Parser
function topParse(s) {
    var currentOpenCurly = s.indexOf("{");
    if (currentOpenCurly < 0) {
        return s;
    }
    var bigArr = [];
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
function parse(s) {
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
function desugarVar(s) {
    var ids = [];
    var assignments = [];
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
function hasDups(s) {
    for (var i = 0; i <= s.length; i++) {
        for (var j = i; j <= s.length; j++) {
            if (i != j && s[i] == s[j]) {
                return true;
            }
        }
    }
    return false;
}
function parseSymbol(s) {
    if (s == "var" || s == "if" || s == "lam" || s == "=" || typeof s != "string") {
        throw "ZHRL: wrongly formatted symbol";
    }
    else {
        return s;
    }
}
// console.log(topParse('{f "lol" x 9}'));
// console.log(parse(['f', '"lol"', 'x', 9]));
// console.log(topParse('{var {x = 15} {z = 14} {+ x z}}'));
console.log(parse(['var', ['x', '=', 15], ['z', '=', 14], ['+', 'x', 'z']]));
// console.log(topParse('{lam {x y} {+ x y}}'));
console.log(parse(['lam', ['x', 'y'], ['+', 'x', 'y']]));
// console.log(topParse('{+ x y}'));
// console.log(parse(['+', 'x', 'y']));
// console.log(topParse('lol'));
// console.log(parse('lol'));
