import 'dotenv/config'

import { Client } from '@notionhq/client'

// eslint-disable-next-line no-process-env
export const notion = new Client({ auth: process.env.NOTION_API_KEY })
