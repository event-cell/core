import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface Config {
  rsyncRemoteHost: string
  rsyncRemoteUser: string
  rsyncRemotePath: string
  rsyncSshKeyPath: string
}

async function deploy() {
  try {
    // Read config.json
    const configPath = join(process.cwd(), '..', 'web-deploy-config.json')
    if (!existsSync(configPath)) {
      throw new Error(
        'config.json not found. Please create it in the root directory.',
      )
    }

    const config = JSON.parse(readFileSync(configPath, 'utf8')) as Config

    // Validate required config
    if (
      !config.rsyncRemoteHost ||
      !config.rsyncRemoteUser ||
      !config.rsyncRemotePath ||
      !config.rsyncSshKeyPath
    ) {
      throw new Error(
        'Missing required configuration. Please check config.json has all required fields.',
      )
    }

    // Build the project
    console.log('Building project...')
    await execAsync('yarn build')
    console.log('Build complete.')

    // Create rsync command
    const source = join(process.cwd(), 'dist/')
    const destination = `${config.rsyncRemoteUser}@${config.rsyncRemoteHost}:${join(config.rsyncRemotePath)}`

    // Clean up existing files on remote server
    console.log('Cleaning up old files...')
    const cleanupCommand = [
      'ssh',
      `-i ${config.rsyncSshKeyPath}`,
      '-o StrictHostKeyChecking=no',
      `${config.rsyncRemoteUser}@${config.rsyncRemoteHost}`,
      `"rm -rf ${config.rsyncRemotePath}/*.html ${config.rsyncRemotePath}/assets"`,
    ].join(' ')

    await execAsync(cleanupCommand)
    console.log('Cleanup complete.')

    // Sync files
    console.log('Syncing files to remote server...')
    const rsyncCommand = [
      'rsync -avz',
      `--exclude="*.tmp"`,
      `--exclude="*.log"`,
      `-e "ssh -i ${config.rsyncSshKeyPath} -o StrictHostKeyChecking=no"`,
      `${source}/`,
      destination,
    ].join(' ')

    const { stdout, stderr } = await execAsync(rsyncCommand)

    if (stderr) {
      console.warn('Rsync warnings:', stderr)
    }

    console.log('Deployment complete!')
    console.log(stdout)
  } catch (error) {
    console.error('Deployment failed:', error)
    process.exit(1)
  }
}

deploy()
