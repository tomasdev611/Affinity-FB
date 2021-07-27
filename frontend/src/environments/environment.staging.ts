// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=staging` then `environment.staging.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  server: 'http://ec2-3-211-65-84.compute-1.amazonaws.com:3001',
  aws: 'https://s3.amazonaws.com/affinityasset/',
  googleApiKey: 'AIzaSyDOtB2AaKvzzB3Ar-oHLqo4NAn7s9XOIo4'
};
