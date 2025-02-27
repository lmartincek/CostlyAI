import {FailedResponse} from "../types/responseStatus";

export const returnError = (error: string): FailedResponse => {
    console.error( error );
    return { error: JSON.stringify( error ) }
}