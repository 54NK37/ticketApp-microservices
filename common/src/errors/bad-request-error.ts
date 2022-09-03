import { CustomError } from "./custom-error"

export class BadRequestError extends CustomError
{
    statusCode = 400

    constructor(public reason : string)
    {
        super(reason)
    }

    serializeErrors=()=>
    {
        const formattedErrors = [{
            message : this.reason
        }]
    
        return formattedErrors
    }
}