import {Request, Response} from "express";
import {returnError} from "../utils/responseErrorHandler";
import {FailedResponse} from "../types/responseStatus";
import {
    loginUserWithCredentials,
    loginUserWithProvider,
    logoutUser,
    registerUser
} from "../services/authService";

export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log(email, password, 'hmmmm register')

    if (!email) {
        return res.status(400).json(returnError('Email is required', 400));
    }

    if (!password) {
        return res.status(400).json(returnError('Password is required', 400));
    }

    const user = await registerUser(email, password)

    if ('error' in user) {
        const { error, statusCode } = user as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(user);
}

export const loginWithCredentials = async (req: Request, res: Response) => {
    const { email, password, provider } = req.body;

    console.log(email, password, 'hmmmm login')

    if (!email) {
        return res.status(400).json(returnError('Email is required', 400));
    }

    if (!password) {
        return res.status(400).json(returnError('Password is required', 400));
    }

    const user = await loginUserWithCredentials(email, password)

    if ('error' in user) {
        const { error, statusCode } = user as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(user);
}

export const loginWithProvider = async (req: Request, res: Response) => {
    const { provider } = req.body;

    if (!provider) {
        return res.status(400).json(returnError('Provider is required', 400));
    }

    const user = await loginUserWithProvider(provider)

    if ('error' in user) {
        const { error, statusCode } = user as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(user);
}

export const logout = async (req: Request, res: Response) => {
    const message = await logoutUser()

    if ('error' in message) {
        const { error, statusCode } = message as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(message);
}