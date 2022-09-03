import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError
{
    statusCode = 500
    reason = 'Error connecting to database'
    constructor()
    {
        super('Error connecting to db')
    }

    serializeErrors=()=>
    {
        const formattedErrors = [{
            message : this.reason
        }]
    
        return formattedErrors
    }
}