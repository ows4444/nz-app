export default function (env: NodeJS.ProcessEnv) {
  const nodeEnv = env.NODE_ENV || 'development';
  const envFiles = {
    development: '.env',
    test: '.env.test',
  };
  console.log(`\n\n${envFiles[nodeEnv]}\n\n`);

  return envFiles[nodeEnv] || '.env';
}
