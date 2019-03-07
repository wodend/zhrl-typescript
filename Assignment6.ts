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
}

class numV {
    n: number;
    constructor(n: number) {
        this.n = n;
    }
}

class strC {
    str: string;
    constructor(str: string) {
        this.str = str;
    }
}

class strV {
    str: string;
    constructor(str: string) {
        this.str = str;
    }
}

class idC {
    s: string;
    constructor(s: string) {
        this.s = s;
    }
}

class appC {
    fun: ExprC;
    args: ExprC[];
    constructor(fun: ExprC, args: ExprC[]) {
        this.fun = fun;
        this.args = args;
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
}

class boolV {
    val: boolean;
    constructor(val: boolean) {
        this.val = val;
    }
}

class lamC {
    args: string[];
    body: ExprC;
    constructor(args: string[], body: ExprC) {
        this.args = args;
        this.body = body;
    }
}

class cloV {
    params: string[];
    body: ExprC;
    constructor(params: string[], body: ExprC) {
        this.params = params;
        this.body = body;
    }
}

class primV {
    op: (args: Value[]) => Value;
    constructor(op: (args: Value[]) => Value) {
        this.op = op;
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


// The Parser

function parse(s: string) : ExprC {
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

function interp(expression: ExprC, environment: Env): Value {
    console.log(expression.constructor === numC);
    switch (expression.constructor) {
        case numC:
            return new numV((expression as numC).n);
        case strC:
            return new strV((expression as strC).str);
        case idC:
            return envLookup(environment, (expression as idC).s);
        default:
            throw "ZHRL: malformed abstract syntax tree";
    }
}

console.log(interp(new idC("true"), topEnv));
