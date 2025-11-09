import { execSync } from 'child_process'

try {
  console.log('Running type check and lint...')

  execSync('pnpm build', { stdio: 'inherit' })
  execSync('pnpm lint', { stdio: 'inherit' })

  console.log('Pre-push checks passed!')
}
catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('An error occurred:', errorMessage)
  process.exit(1)
}
