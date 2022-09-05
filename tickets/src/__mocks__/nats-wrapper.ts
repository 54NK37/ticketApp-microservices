// mocking for using it in tests
export const natsWrapper = {

    client : {
        publish : (subject:string,data:string,callback : () => void)=>{
            callback()
        }
    }
}