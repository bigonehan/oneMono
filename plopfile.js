const fs = require('fs');
const path = require('path');

module.exports = function (plop) {
  plop.setActionType('copy', function (answers, config, plop) {
    const source = plop.renderString(config.source, answers);
    const destination = plop.renderString(config.destination, answers);
    fs.cpSync(source, destination, { recursive: true });
    return `Copied ${source} to ${destination}`;
  });

  plop.setGenerator('minimal', {
    description: 'A minimal app',
    prompts: [],
    actions: [
      {
        type: 'copy',
        source: 'template/minimal',
        destination: 'app/minimal',
      },
    ],
  });
};
