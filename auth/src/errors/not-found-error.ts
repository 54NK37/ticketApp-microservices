import { CustomError } from "./custom-error"

export class NotFoundError extends CustomError
{
    statusCode = 404
    constructor()
    {
        super('Route not found')
    }

    serializeErrors=()=>
    {
        const formattedErrors = [{
            message : 'Not Found'
        }]
    
        return formattedErrors
    }
}