import {AbstractTemplate} from './AbstractTemplate';

export class CommitMessageTemplate extends AbstractTemplate {
  getTemplate() {
    return `
Jira: {{ jiraTicket }}
Reviewers: {{ reviewers }}
PR: GH-{{ prNumber }}
    `.trim();
  }
}

