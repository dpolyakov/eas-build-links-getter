import util from 'util';

const exec = util.promisify(require('child_process').exec);

type BuildInfo = {
    id: string,
    platform: 'IOS' | 'ANDROID',
    status: 'CANCELED' | 'FINISHED' | 'PENDING' | 'PROCESS'
    project: {        
        slug: string,
        ownerAccount:{
            id: string,
            name: string
        } 
    }
}

type Result = {
    'IOS': string,
    'ANDROID': string,
}

export async function easInfo(appVersion:string): Promise<Result | null> {
  try {
    const {stdout, stderr} = await exec(
      `eas build:list --appVersion=${appVersion} --json`,
    );
    const result = prepare(stdout);

    console.log(result);
    // console.log('stdout:', stdout);
    return result;
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    return null
  }
}



function prepare(stdout: any) {
  try {
    const response = JSON.parse(stdout);

    return response.reduce((acc: Result, build: BuildInfo) => {
      if (build.status !== 'CANCELED') {
        const buildLink = getBuildUrl(
          build.project.ownerAccount.name,
          build.project.slug,
          build.id,
        );

        acc[build.platform] = buildLink
      }
      return acc;
    }, {});
  } catch (error) {}
}

const getBuildUrl = (owner: string, projectSlug: string, buildId: string) =>
  `https://expo.dev/accounts/${owner}/projects/${projectSlug}/builds/${buildId}`;
