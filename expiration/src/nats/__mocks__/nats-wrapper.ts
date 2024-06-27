// mocking for using it in tests
export const natsWrapper = {

    client : {
        // to check if it has been actually called inside tests
        publish : jest.fn().mockImplementation((subject:string,data:string,callback : () => void)=>{
            callback()
        })
    }
}