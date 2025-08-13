import 'dotenv/config'

import { Octokit } from 'octokit'

// eslint-disable-next-line no-process-env
export const github = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN })
