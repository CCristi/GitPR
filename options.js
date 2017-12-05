import './css/normalize.css';
import './css/options.css';
import {defaultOptions} from './lib/Config';

function saveOptions() {
  const jiraBase = document.getElementById('jiraBase').value;
  const boardColumn = document.getElementById('boardColumn').value;
  const template = document.getElementById('template').value;
  const userAliases = JSON.parse(document.getElementById('userAliases').value);

  chrome.storage.sync.set({
    jiraBase,
    boardColumn,
    template,
    userAliases,
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');

    status.textContent = 'Options saved.';

    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
}

function loadOptions() {
  chrome.storage.sync.get(defaultOptions, items => {
    document.getElementById('jiraBase').value = items.jiraBase;
    document.getElementById('boardColumn').value = items.boardColumn;
    document.getElementById('template').value = items.template;
    document.getElementById('userAliases').value = JSON.stringify(items.userAliases, null, '  ');
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
