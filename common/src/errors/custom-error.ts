// To make sure all errors have same data structure
export abstract class CustomError extends Error
{
    abstract statusCode  : number;
    
    constructor(message : string)
    {
        super(message)
        Object.setPrototypeOf(this,CustomError.prototype)
    }

    abstract serializeErrors():{
        message:string,field?:string
    }[]
}