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
  const outDir = resolve(serviceDir, 'src', options.protoDir);
  const assetsDir = resolve(serviceDir, 'src', 'assets');
  const protoDirAbs = resolve(rootDir, options.protoDir);

  const entities = Array.isArray(options.entity) ? options.entity : [options.entity];

  try {
    await fs.mkdir(outDir, { recursive: true });
    logger.info(`✔️ Ensured output directory exists at ${outDir}`);

    // Check all proto files exist
    for (const entity of entities) {
      const protoFileName = `${entity}.proto`;
      const protoPath = resolve(protoDirAbs, protoFileName);
      const protoAssetsPath = resolve(assetsDir, protoFileName);
      try {
        await fs.access(protoPath);
        logger.info(`✔️ Found .proto file: ${protoFileName}`);

        await fs.copyFile(protoPath, protoAssetsPath);
        logger.info(`✔️ Copied .proto file to: ${protoAssetsPath}`);
      } catch (err: any) {
        if (err.code === 'ENOENT') {
          logger.error(`⛔️ .proto file not found at ${protoPath}`);
        } else {
          logger.error(`⛔️ File system error: ${err.message}`);
        }
        return { success: false };
      }
    }
  } catch (err: any) {
    logger.error(`⛔️ File system error: ${err.message}`);
    return { success: false };
  }

  // Run protoc for each entity
  for (const entity of entities) {
    const protoFileName = `${entity}.proto`;
    const protocArgs = [`--ts_proto_out=${outDir}`, protoFileName, '--ts_proto_opt=nestJs=true'];

    logger.info(`🚀 Generating types for ${protoFileName}...`);

    const result = spawnSync('npx', ['protoc', ...protocArgs], {
      cwd: protoDirAbs,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    if (result.error) {
      logger.error(`⛔️ spawnSync error for ${protoFileName}: ${result.error.message}`);
      return { success: false };
    }

    if (result.status !== 0) {
      logger.error(`⛔️ protoc failed for ${protoFileName} with exit code ${result.status}`);
      return { success: false };
    }

    logger.info(`✅ Types generated for ${protoFileName}`);
  }

  logger.info('🎉 All proto types generated successfully.');

  const prettierArgs = ['--write', `${outDir}/**/*.ts`];

  const prettierResult = spawnSync('npx', ['prettier', ...prettierArgs], {
    cwd: outDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (prettierResult.error) {
    logger.error(`⛔️ spawnSync error for prettier: ${prettierResult.error.message}`);
    return { success: false };
  }
  if (prettierResult.status !== 0) {
    logger.error(`⛔️ prettier failed with exit code ${prettierResult.status}`);
    return { success: false };
  }

  return { success: true };
};

export default runExecutor;
