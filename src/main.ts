import * as fs from 'fs'
import * as core from '@actions/core'
import { Stats } from './types.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const filePath: string = core.getInput('file-path')
    core.debug(`Reading file: ${filePath}`)
    const data = fs.readFileSync(filePath, 'utf-8')
    const { stats } = JSON.parse(data)
    const results = stats as Stats

    await core.summary
      .addHeading('Test Results')
      .addTable([
        ['Tests started', results.startTime.toString()],
        ['Duration', results.duration.toString()]
      ])
      .addBreak()
      .addTable([
        ['🟢', 'Passed', results.expected.toString()],
        ['🔴', 'Failed', results.unexpected.toString()],
        ['⚪', 'Skipped', results.skipped.toString()],
        ['🟠', 'Flaky', results.flaky.toString()]
      ])
      .write()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
