import { execSync } from 'child_process'

try {
  // 取得目前 branch name
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  console.log(`branch: ${branch}`)

  // 取得 remote branch name
  let remote_branch = ''
  try {
    remote_branch = execSync(`git rev-parse --symbolic-full-name --abbrev-ref ${branch}@{u}`).toString().trim()
    console.log(`remote_branch: ${remote_branch}`)
  }
  catch (error) {
    console.log('get remote branch error', error.message)
  }

  if (remote_branch) {
    // 取得 remote branch 的 HEAD
    const output = execSync(`git ls-remote --heads origin ${branch}`).toString().trim()
    const remote_head = output.split('\t')[0]
    console.log(`remote_head: ${remote_head}`)

    execSync(`pnpm nx affected -t=typecheck,lint --base=${remote_branch} -head=${remote_head} --verbose`, { stdio: 'inherit' })
  }
  else {
    console.log('remote branch not found skip code quality check')
  }
}
catch (error) {
  console.error('An error occurred:', error.message)
  process.exit(1)
}
