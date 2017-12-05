export const defaultOptions = {
  jiraBase: 'https://yourdomain.atlassian.net',
  template: 'Jira: {{ jiraTicket }}\nReviewers: {{ reviewers | join }}\nPR: GH-{{ prNumber }}',
  boardColumn: 'dev complete',
};

export class Config {
  constructor() {
    this._options = {};
  }

  load() {
    return new Promise(resolve => {
      chrome.storage.sync.get(defaultOptions, items => {
        this._options = items;

        resolve();
      });
    });
  }

  get(option) {
    return this._options[option];
  }
}
