import { ExecutorContext, logger, PromiseExecutor } from '@nx/devkit';
import { spawnSync } from 'child_process';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { ProtoBuildExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<ProtoBuildExecutorSchema> = async (options: ProtoBuildExecutorSchema, context: ExecutorContext) => {
  const rootDir = context.root;
  const projectName = context.projectName;

  if (!projectName) {
    logger.error('⛔️ Project name not found in the executor context.');
    return { success: false };
  }

  const serviceDir = resolve(rootDir, 'apps', projectName);
  const outDir = resolve(serviceDir, options.protoDir);
  const protoDirAbs = resolve(rootDir, options.protoDir);
  const protoFileName = `${options.entity}.proto`;
  const protoPath = resolve(protoDirAbs, protoFileName);

  try {
    await fs.mkdir(outDir, { recursive: true });
    logger.info(`✔️ Ensured output directory exists at ${outDir}`);

    await fs.access(protoPath);
    logger.info(`✔️ Found .proto file: ${protoFileName}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.error(`⛔️ .proto file not found at ${protoPath}`);
    } else {
      logger.error(`⛔️ File system error: ${err.message}`);
    }
    return { success: false };
  }

  const protocArgs = [`--ts_proto_out=${outDir}`, protoFileName, '--ts_proto_opt=nestJs=true'];

  const result = spawnSync('npx', ['protoc', ...protocArgs], {
    cwd: protoDirAbs,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    logger.error(`⛔️ spawnSync error: ${result.error.message}`);
    return { success: false };
  }

  if (result.status !== 0) {
    logger.error(`⛔️ protoc failed with exit code ${result.status}`);
    return { success: false };
  }

  logger.info('✅ Proto types generated successfully.');
  return { success: true };
};

export default runExecutor;
