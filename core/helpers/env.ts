export default function (env: NodeJS.ProcessEnv): string {
  const nodeEnv = env.NODE_ENV || 'development';
  const envFiles = {
    development: '.env',
    test: '.env.test',
  };

  return (envFiles[nodeEnv] as string) || '.env';
}
