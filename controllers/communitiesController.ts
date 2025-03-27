import { Request, Response } from 'express'
import { returnError } from '../utils/responseErrorHandler'
import { FailedResponse } from '../types/responseStatus'
import { fetchCommunities } from '../services/communitiesService'
import { CommunityQueries } from '../types/communities'
  
export const getCommunities = async (req: Request, res: Response) => {
  const { country, city, type, members } = req.query

  if (country) String(country)
  const communities = await fetchCommunities({country, city, type, members} as CommunityQueries)

  if ('error' in communities) {
    const { error, statusCode } = communities as FailedResponse
    return res.status(statusCode ?? 500).json(returnError(error, statusCode))
  }

  return res.status(200).json(communities)
}