import {AbstractTemplate} from './AbstractTemplate';

export class CommitMessageTemplate extends AbstractTemplate {
  /**
   * @param {Object[]} args
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * @returns {String}
   */
  getTemplate() {
    return `
Jira: {{ jiraTicket }}
Reviewers: {{ reviewers | join }}
PR: GH-{{ prNumber }}
    `.trim();
  }
}

