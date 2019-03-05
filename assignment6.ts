type ExprC = numC | idC | appC | lamC | strC | condC;
type Value = numV | boolV | primV | cloV | strV;
type Env = [Binding];

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
    s: symbol;
    constructor(s: symbol) {
        this.s = s;
    }
}

class appC {
    fun: ExprC;
    args: [ExprC];
    constructor(fun: ExprC, args: [ExprC]) {
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
    args: [symbol];
    body: ExprC;
    constructor(args: [symbol], body: ExprC) {
        this.args = args;
        this.body = body;
    }
}

class cloV {
    params: [symbol];
    body: ExprC;
    constructor(params: [symbol], body: ExprC) {
        this.params = params;
        this.body = body;
    }
}

class primV {
    op: (args: [Value]) => number;
    constructor(op: (args: [Value]) => number) {
        this.op = op;
    }
}

class Binding {
    name: symbol;
    val: Value;
    constructor(name: symbol, val: Value) {
        this.name = name;
        this.val = val;
    }
}
