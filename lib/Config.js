export const defaultOptions = {
  jiraBase: 'https://yourdomain.atlassian.net',
  template: 'Jira: {{ jiraTicket }}\nReviewers: {{ reviewers | join }}\nPR: GH-{{ prNumber }}',
  boardColumn: 'complete',
  userAliases: {
    userName: 'first.lastName',
  },
};

export class Config {
  constructor() {
    this._options = {};
  }

  /**
   * @returns {Promise}
   */
  load() {
    return new Promise(resolve => {
      chrome.storage.sync.get(defaultOptions, items => {
        this._options = items;

        resolve();
      });
    });
  }

  /**
   * @param {String} option
   * @returns {*}
   */
  get(option) {
    return this._options[option];
  }
}
