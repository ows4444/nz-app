const { execSync } = require('child_process');

const project = process.argv[2];

if (!project) {
  console.error('Please specify a project name.');
  process.exit(1);
}

const command = `npx jest --selectProjects=${project}:integration --watchAll --no-cache`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error(`Failed to run tests for project: ${project}`);
  process.exit(1);
}
