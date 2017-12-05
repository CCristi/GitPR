import './normalize.css';
import './options.css';

function saveOptions() {
  const jiraBase = document.getElementById('jiraurl').value;
  const template = document.getElementById('template').value;

  chrome.storage.sync.set({
    jiraBase,
    template,
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
  chrome.storage.sync.get({
    jiraBase: 'https://yourdomain.atlassian.com',
    template: 'Jira: {{ jiraTicket }}\nReviewers: {{ reviewers | join }}\nPR: GH-{{ prNumber }}',
  }, items => {
    document.getElementById('jiraurl').value = items.jiraBase;
    document.getElementById('template').value = items.template;
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
