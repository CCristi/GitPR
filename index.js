import {MetadataReader} from './lib/MetadataReader';
import {PageController} from './lib/PageController';
import {SimpleTemplateDriver} from './lib/SimpleTemplateDriver';
import {JiraApiClient} from './lib/JiraApiClient';
import config from './config';
import {Config} from './lib/Config';

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.getSelected(null, function (tab) {
    const controller = new PageController(chrome.tabs, tab.id);
    const reader = new MetadataReader(controller);
    const templateDriver = new SimpleTemplateDriver();
    const pluginConfig = new Config();

    pluginConfig.load().then(() => reader.collect({
      reviewers: {
        strategy: 'dom-query',
        selector: '.js-issue-sidebar-form .css-truncate',
        mapper: function (element) {
          return Array.from(element.children)
            .filter(reviewerParagraph => Boolean(reviewerParagraph.querySelector('.octicon-check')))
            .map(reviewerParagraph => reviewerParagraph.innerText.trim());
        }
      },
      jiraTicket: {
        strategy: 'dom-query',
        selector: 'a[href*="atlassian.net/"]',
        mapper: e => e.innerHTML.trim(),
      },
      prNumber: {
        strategy: 'js-eval',
        code: 'document.location.pathname.split("/").pop()',
      },
      mergeTitle: {
        strategy: 'dom-query',
        selector: '#merge_title_field',
        mapper: e => e.value,
      },
      hasToUpdateJiraTicket: {
        strategy: 'js-eval',
        code: 'confirm(\'Do you want to update jira ticket ?\')',
      }
    })).then(data => {
      data.reviewers = data.reviewers.map(reviewer => {
        return config.users[reviewer] || reviewer.toLowerCase();
      });

      const {jiraTicket, hasToUpdateJiraTicket} = data;
      const jiraApi = new JiraApiClient(pluginConfig.get('jiraBase'));
      const boardColumnName = pluginConfig.get('boardColumn');
      const commitMessage = templateDriver.renderToString(pluginConfig.get('template'), data);
      const mergeTitle = templateDriver.renderToString('{{ title | clear }}', {
        emojis: config.emojis,
        title: data.mergeTitle,
      });

      const updateJiraTicket = jiraTicket && hasToUpdateJiraTicket
        ? jiraApi
          .getTransitions(jiraTicket)
          .then(response => {
            const transitions = response.data.transitions;
            const toDevCompleteTransition = transitions.find(t => new RegExp(boardColumnName, 'i').test(t.name));

            if (!toDevCompleteTransition) {
              throw new Error(
                `Couldn't find column matching "${boardColumnName}". Available columns: ${transitions.map(t => t.name)}`
              );
            }

            const {id, name} = toDevCompleteTransition;

            return jiraApi
              .postTransition(jiraTicket, {transition: {id}})
              .then(() => controller.alert(`Ticket ${jiraTicket} successfully moved to ${name}`));
          })
          .catch(e => controller.alert(`Error moving jira ticket: ${e.message}`))
        : Promise.resolve();

      return Promise.all([
        controller.updateInputValue('#merge_message_field', commitMessage),
        controller.updateInputValue('#merge_title_field', mergeTitle),
        updateJiraTicket,
      ]);
    });
  });
});
