import './css/normalize.css';
import './css/options.css';
import {ChromePluginConfig} from './lib/ChromePluginConfig';

const config = new ChromePluginConfig(chrome.storage);

function saveOptions() {
  const jiraBase = document.getElementById('jiraBase').value;
  const boardColumn = document.getElementById('boardColumn').value;
  const template = document.getElementById('template').value;
  const userAliases = JSON.parse(document.getElementById('userAliases').value);

  config.set({
    jiraBase,
    boardColumn,
    template,
    userAliases,
  }).then(() => {
    const status = document.getElementById('status');

    status.textContent = 'Options saved.';

    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
}

function loadOptions() {
  config.load().then(options => {
    document.getElementById('jiraBase').value = options.jiraBase;
    document.getElementById('boardColumn').value = options.boardColumn;
    document.getElementById('template').value = options.template;
    document.getElementById('userAliases').value = JSON.stringify(options.userAliases, null, '  ');
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
