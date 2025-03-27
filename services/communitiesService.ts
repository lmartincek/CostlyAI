import { Community, CommunityQueries } from '../types/communities'
import { FailedResponse } from '../types/responseStatus'
import { returnError } from '../utils/responseErrorHandler'
import { supabase } from '../utils/supabaseClient'

export const fetchCommunities = async (
  args: CommunityQueries,
): Promise<Community[] | FailedResponse> => {
  const { country, city, type, members } = args
  try {
    let query = supabase.from('communities').select('*')

    if (country) {
      query = query.eq('country', country)
    }

    if (city) {
      query = query.eq('city', city)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (members) {
      query = query.eq('members', members)
    }

    const { data, error } = await query
    if (error) {
      return returnError(`Failed to fetch communities: ${error.message}`, 400)
    }

    return data
  } catch (error: any) {
    return returnError(`Unexpected error in fetchCities: ${error.message}`)
  }
}
