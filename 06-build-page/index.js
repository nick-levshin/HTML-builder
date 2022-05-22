const fsp = require('fs').promises;
const fs = require('fs');
const path = require('path');

const createDirectory = async (dirName) => {
  await fsp.rm(path.resolve(dirName), {
    recursive: true,
    force: true,
  });

  await fsp.mkdir(path.resolve(dirName));

  return dirName;
};

const renderHTML = async (dirName) => {
  const readStream = await fs.createReadStream(
    path.resolve(__dirname, 'template.html'),
    { encoding: 'utf-8' }
  );
  let newHTML = '';

  await readStream.on('data', (chunk) => {
    newHTML += chunk.toString();
  });

  await readStream.on('end', () => {
    const templates = newHTML.match(/{{(.*?)}}/g);

    templates.forEach(async (element) => {
      const htmlStream = await fs.createReadStream(
        path.resolve(
          __dirname,
          'components',
          `${element.replace(/{{|}}/g, '')}.html`
        ),
        {
          encoding: 'utf-8',
        }
      );

      await htmlStream.on('data', (chunk) => {
        newHTML = newHTML.replace(element, chunk);
      });

      await htmlStream.on('end', () => {
        fs.writeFile(path.resolve(dirName, 'index.html'), newHTML, (err) => {
          if (err) {
            console.log('Something went wrong!');
          }
        });
      });
    });
  });
  return dirName;
};

const mergeCSS = async (dirName) => {
  const items = await fsp.readdir(path.resolve(__dirname, 'styles'), {
    withFileTypes: true,
  });

  for (const item of items) {
    if (item.isDirectory()) {
      console.log('Error, programm doesnt work recursively');
    } else {
      if (
        path.parse(path.resolve(__dirname, 'styles', item.name)).ext === '.css'
      ) {
        const readStream = await fs.createReadStream(
          path.resolve(__dirname, 'styles', item.name),
          {
            encoding: 'utf-8',
          }
        );
        const writeStream = await fs.createWriteStream(
          path.resolve(dirName, 'style.css'),
          {
            encoding: 'utf-8',
            flags: 'a',
          }
        );
        await readStream.on('data', (chunk) => writeStream.write(chunk));
      }
    }
  }
  return dirName;
};

const copyAssets = async (dir, copy) => {
  const dirInfo = await fsp.readdir(dir, { withFileTypes: true });

  for (const file of dirInfo) {
    if (file.isDirectory()) {
      await fsp.mkdir(path.resolve(copy, file.name));
      await copyAssets(
        path.resolve(dir, file.name),
        path.resolve(copy, file.name)
      );
    } else {
      fsp.copyFile(path.resolve(dir, file.name), path.resolve(copy, file.name));
    }
  }
  return dir;
};

createDirectory(path.resolve(__dirname, 'project-dist'))
  .then((dirName) => renderHTML(dirName))
  .then((dirName) => mergeCSS(path.resolve(dirName)))
  .then((dirName) => createDirectory(path.resolve(dirName, 'assets')))
  .then((dirName) =>
    copyAssets(path.resolve(__dirname, 'assets'), path.resolve(dirName))
  );
