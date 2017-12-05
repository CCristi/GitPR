export class Config {
  constructor() {
    this._options = {};
  }

  load() {
    return new Promise(resolve => {
      chrome.storage.sync.get({
        jiraBase: 'https://yourdomain.atlassian.com',
        template: 'Jira: {{ jiraTicket }}\nReviewers: {{ reviewers | join }}\nPR: GH-{{ prNumber }}',
      }, items => {
        this._options = items;

        resolve();
      });
    });
  }

  get(option) {
    return this._options[option];
  }
}
