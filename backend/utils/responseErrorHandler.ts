import {FailedResponse} from "../types/responseStatus";

export const throwError = (error: string): FailedResponse => {
    console.error( error );
    return { error: JSON.stringify( error ) }
}