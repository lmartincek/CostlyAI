import {FailedResponse} from "../types/responseStatus";

export const returnError = (message: string, statusCode: number = 500): FailedResponse => {
    // TODO - console erroring two times controller and service too
    console.error(message);
    return { error: message, statusCode };
};
