import * as core from '@actions/core'
import {easInfo} from './eas';

async function run(): Promise<void> {
  try {
    const appVersion: string = core.getInput('appVersion')
    const exclude: string = core.getInput('exclude')
    core.debug(JSON.stringify({
      appVersion,
      exclude
    }, null, 2)) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    const result = await easInfo(appVersion);

    if (result !== null) {
      core.setOutput('ios', result.IOS)
      core.setOutput('android', result.ANDROID)
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
