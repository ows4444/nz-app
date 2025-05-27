import { ExecutorContext, logger, PromiseExecutor } from '@nx/devkit';
import { spawnSync } from 'child_process';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { ProtoBuildExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<ProtoBuildExecutorSchema> = async (options: ProtoBuildExecutorSchema, context: ExecutorContext) => {
  const rootDir = context.root;
  const projectName = String(context.projectName);
  const serviceRoot = context.projectsConfigurations.projects[projectName].root;
  const projectType = context.projectsConfigurations.projects[projectName].projectType;

  if (!projectName) {
    logger.error(`⛔️ ${projectType} name not found in the executor context.`);
    return { success: false };
  }
  const serviceDir = resolve(serviceRoot);
  const serviceSrcDir = resolve(serviceDir, 'src');
  const outDir = resolve(serviceDir, 'src', projectType === 'library' ? 'lib' : '', options.protoDir);

  const protoDirAbs = resolve(rootDir, options.protoDir);

  const entities = Array.isArray(options.entity) ? options.entity : [options.entity];

  try {
    await fs.mkdir(outDir, { recursive: true });
    logger.info(`✔️ Ensured output directory exists at ${outDir}`);

    // Check all proto files exist
    for (const entity of entities) {
      const protoFileName = `${entity}.proto`;
      const protoPath = resolve(protoDirAbs, protoFileName);
      try {
        await fs.access(protoPath);
        logger.info(`✔️ Found .proto file: ${protoFileName}`);
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
    const protocArgs = [`--ts_proto_out=${outDir}`, protoFileName, '--ts_proto_opt=nestJs=true,addGrpcMetadata=true'];

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

  logger.info(`${serviceSrcDir} serviceSrcDir`);
  // create or recreate index.ts file
  const indexFilePath = resolve(serviceSrcDir, 'index.ts');
  const indexFileContent = entities
    .map((entity) => {
      const protoFileName = `${entity}.proto`;
      const protoFileNameWithoutExt = protoFileName.replace('.proto', '');
      return `export * as ${protoFileNameWithoutExt} from './${projectType === 'library' ? 'lib/' : ''}${options.protoDir}/${protoFileNameWithoutExt}';`;
    })
    .join('\n\n');
  try {
    await fs.writeFile(indexFilePath, indexFileContent, { encoding: 'utf-8' });
    logger.info(`✔️ Created index.ts file at ${indexFilePath}`);
  } catch (err: any) {
    logger.error(`⛔️ Error writing index.ts file: ${err.message}`);
    return { success: false };
  }

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
