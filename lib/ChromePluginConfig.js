export const defaultOptions = {
  jiraBase: 'https://yourdomain.atlassian.net',
  template: 'Jira: {{ jiraTicket }}\nReviewers: {{ reviewers | join }}\nPR: GH-{{ prNumber }}',
  boardColumn: 'dev complete',
  userAliases: {
    userName: 'first.lastName',
  },
  labelTransitions: {
    hold: 'Open',
    wip: 'In Progress',
    default: 'Review',
  }
};

export class ChromePluginConfig {
  /**
   * @param {chrome.storage} chromeStorage
   */
  constructor(chromeStorage) {
    this._storage = chromeStorage;
    this._options = {};
  }

  /**
   * @returns {Promise}
   */
  load() {
    return new Promise(resolve => {
      this._storage.sync.get(defaultOptions, options => {
        this._options = options;

        resolve(options);
      });
    });
  }

  set(options) {
    return new Promise(resolve => {
      this._storage.sync.set(options, () => {
        Object.assign(this._options, options);

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
