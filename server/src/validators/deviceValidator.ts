import { z } from 'zod'

export const deviceCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mac: z.string().min(1, 'MAC is required')
})
