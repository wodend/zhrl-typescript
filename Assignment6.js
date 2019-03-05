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
// The Parser
function parse(s) {
    if (s.length > 0 && s.charAt(0) != '{') {
        if (parseInt(s) == 0 || parseInt(s) > 0 || parseInt(s) < 0) {
            return new numC(parseInt(s));
        }
        else if ((s.charAt(0) != '"') || s.charAt(s.length - 1) != '"') {
            if (s == "var" || s == "if" || s == "lam" || s == "=") {
                throw "ZHRL: wrongly formatted expression";
            }
            else {
                return new idC(s);
            }
        }
        else {
            return new strC(s.substring(1, s.length - 1));
        }
    }
    else {
    }
}
console.log(parse('9'));
