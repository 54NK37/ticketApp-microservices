export enum OrderStatus {
    // order has been created but the ticket within order has not been reserved
    Created = 'created',

    // the ticket has already been reserved by someone or the order has been cancelled by the user
    // the order expires before payment
    Cancelled = 'cancelled',

    // order has succesfully reserved ticket 
    AwaitingPayment = 'awaiting:payment',
    
    // payment successfull
    Complete = 'complete',
}