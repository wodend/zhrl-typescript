// # Types and Data Structures
// ZHRL expression
type ExprC = IdC | NumC | AppC;
type IdC = string;
type NumC = number;
interface AppC {
    func: ExprC;
    args: ExprC[];
}

// ZHRL value
type ValV = NumV | PrimV;
type NumV = number;
type PrimV = (args: ValV[]) => ValV;

// helper functions
let zhrl_error: (messsage: string) => string =
    function(message) {
        throw "ZHRL: " + message;
    };

// parse ZHRL concrete syntax into an abstract syntax tree
let parse: (concrete: any | any[]) => ExprC =
    function(concrete) {
        switch (typeof concrete) {
            case "number":
                return concrete;
                break;
            case "string":
                return concrete;
                break;
            default:
                zhrl_error("bad syntax: " + concrete);
        }
    };

console.log(parse(0));
