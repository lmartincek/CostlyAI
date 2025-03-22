import {Request, Response} from "express";
import {returnError} from "../utils/responseErrorHandler";
import { addUserSearch, fetchCities, fetchCountries, fetchRecentlySearchedPlaces, fetchUserSearch} from "../services/generalService";
import {FailedResponse} from "../types/responseStatus";
import { UserSearchPayload } from "../types/general";

export const getCountries = async (req: Request, res: Response) => {
    const countries = await fetchCountries()

    if ('error' in countries) {
        const { error, statusCode } = countries as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(countries)
}

export const getCities = async (req: Request, res: Response) => {
    const { countryIds } = req.query;

    if (!countryIds) {
        return res.status(400).json(returnError('countryIds is required', 400));
    }

    // Convert the comma-separated string into an array of numbers
    const countryIdsArray = String(countryIds)
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))

    if (countryIdsArray.length === 0) {
        return res.status(400).json(returnError('Invalid countryIds provided', 400));
    }

    const cities = await fetchCities(countryIdsArray);
    if ('error' in cities) {
        const { error, statusCode } = cities as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(cities);
};

export const getRecentlySearchedPlaces = async (req: Request, res: Response) => {
    const { places } = req.query;

    let placesResponse;
    if (places) {
        placesResponse = await fetchRecentlySearchedPlaces(Number(places))
    } else {
        placesResponse = await fetchRecentlySearchedPlaces();
    }

    if ('error' in placesResponse) {
        const { error, statusCode } = placesResponse as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(placesResponse);
};

export const saveUserSearch = async (req: Request, res: Response) => {
    const { userId, countryId, cityId, categories } = req.body

    if (!userId) {
        return res.status(400).json(returnError('Missing required userId', 400));
    }

    if (!countryId || !categories) {
        return res.status(400).json(returnError(`Missing required fields countryId: ${countryId}, cityId: ${cityId}, categories: ${categories}`, 400));
    }

    const data = await addUserSearch({userId, categories, countryId, cityId} as UserSearchPayload);

    if (data && 'error' in data) {
        const { error, statusCode } = data as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(201).json({ message: "User search successfully!", data });
};

export const getUserSearch = async (req: Request, res: Response) => {
    const { userId, places } = req.query;

    if (!userId) {
        return res.status(400).json(returnError('Missing required userId', 400));
    }

    let placesResponse;
    if (places) {
        placesResponse = await fetchUserSearch(String(userId), Number(places))
    } else {
        placesResponse = await fetchUserSearch(String(userId));
    }

    if ('error' in placesResponse) {
        const { error, statusCode } = placesResponse as FailedResponse;
        return res.status(statusCode ?? 500).json(returnError(error, statusCode));
    }

    return res.status(200).json(placesResponse);
};