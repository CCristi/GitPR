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

    reader.collect({
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
      updateJiraTicket: {
        strategy: 'js-eval',
        code: 'confirm(\'Do you want to update jira ticket ?\')',
      }
    }).then(data => {
      pluginConfig.load().then(() => {
        data.reviewers = data.reviewers.map(reviewer => {
          return config.users[reviewer] || reviewer.toLowerCase();
        });

        const jiraApi = new JiraApiClient(pluginConfig.get('jiraBase'));
        const commitMessage = templateDriver.renderToString(pluginConfig.get('template'), data);
        const mergeTitle = templateDriver.renderToString('{{ title | clear }}', {
          emojis: config.emojis,
          title: data.mergeTitle,
        });

        const updateJiraTicket = data.jiraTicket && data.updateJiraTicket
          ? jiraApi
            .getTransitions(data.jiraTicket)
            .then(response => {
              const toDevCompleteTransition = response.data.transitions.find(t => /dev\s+complete/i.test(t.name));

              return toDevCompleteTransition
                ? jiraApi.postTransition(data.jiraTicket, {transition: {id: toDevCompleteTransition.id}})
                : Promise.resolve();
            })
          : Promise.resolve();

        return Promise.all([
          controller.updateInputValue('#merge_message_field', commitMessage),
          controller.updateInputValue('#merge_title_field', mergeTitle),
          updateJiraTicket,
        ]);
      });
    });
  });
});
