export type Community = {
  id: number
  country: string
  city: string
  group_name: string
  type: string
  group_link: string
  tags: string[]
  requirement: string
  members: number
  code: string
}

export type CommunityQueries = {
  country?: string
  city?: string
  type?: string
  members?: number
}
