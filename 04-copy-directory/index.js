const fs = require('fs').promises;
const path = require('path');

async function copyDir(dir, copy) {
  const dirInfo = await fs.readdir(dir, { withFileTypes: true });

  for (const file of dirInfo) {
    if (file.isDirectory()) {
      await fs.mkdir(path.resolve(copy, file.name));
      await copyDir(
        path.resolve(dir, file.name),
        path.resolve(copy, file.name)
      );
    } else {
      fs.copyFile(path.resolve(dir, file.name), path.resolve(copy, file.name));
    }
  }
}

fs.mkdir(path.resolve(__dirname, 'files-copy'), (err) => {
  if (err) {
    console.log('Error', err);
  }
});
copyDir(
  path.resolve(__dirname, 'files'),
  path.resolve(__dirname, 'files-copy')
);
