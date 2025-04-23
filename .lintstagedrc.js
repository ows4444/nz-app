const path = require('path');

module.exports = {
  '{apps,libs,tools}/**/*.{ts,tsx}': (files) => {
    const relativeFiles = files.map((file) => path.relative(process.cwd(), file));
    return [`nx affected --target=typecheck --files=${relativeFiles.join(',')}`];
  },
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': (files) => {
    const relativeFiles = files.map((file) => path.relative(process.cwd(), file));
    const filesArg = relativeFiles.map((file) => `"${file}"`).join(' ');
    return [`npx prettier --config .prettierrc.js --write ${filesArg}`, `nx affected:lint --files=${relativeFiles.join(',')}`, `nx format:write --files=${relativeFiles.join(',')}`];
  },
  '*.json': (files) => {
    const relativeFiles = files.map((file) => path.relative(process.cwd(), file));
    const filesArg = relativeFiles.map((file) => `"${file}"`).join(' ');
    return [`npx prettier --config .prettierrc --write ${filesArg}`];
  },
};
