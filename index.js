import {MetadataReader} from './lib/MetadataReader';
import {CommitMessageTemplate} from './lib/CommitMessageTemplate';
import {PageController} from './lib/PageController';

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.getSelected(null, function (tab) {
    const controller = new PageController(chrome.tabs, tab.id);
    const reader = new MetadataReader(controller);

    reader.collect({
      reviewers: {
        strategy: 'dom-query',
        selector: '.js-issue-sidebar-form .css-truncate',
        mapper: function (element) {
          return Array.from(element.children)
            .filter(reviewerParagraph => Boolean(reviewerParagraph.querySelector('.text-green')))
            .map(reviewerParagraph => reviewerParagraph.innerText.trim())
            .join(', ');
        }
      },
      jiraTicket: {
        strategy: 'dom-query',
        selector: 'a[href^="https://atlassian.net/browse/"]',
        mapper: e => e.innerHTML.trim(),
      },
      prNumber: {
        strategy: 'js-eval',
        code: 'document.location.pathname.split("/").pop()',
      },
    }).then(items => {
      const template = new CommitMessageTemplate();
      const commitMessage = template.render(items);

      return controller.updateInputValue('#merge_message_field', commitMessage);
    });
  });
});
