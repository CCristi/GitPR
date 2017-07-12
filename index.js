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
            .filter(reviewerParagraph => Boolean(reviewerParagraph.querySelector('.octicon-check')))
            .map(reviewerParagraph => reviewerParagraph.innerText.trim())
            .join(', ');
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
      }
    }).then(items => {
      const template = new CommitMessageTemplate();
      const commitMessage = template.render(items);
      const initialMergeTitle = items.mergeTitle;
      const updatedTitleMessage = initialMergeTitle.replace(/\s*\(#\d+\)\s*$/, '');

      return Promise.all([
        controller.updateInputValue('#merge_title_field', updatedTitleMessage),
        controller.updateInputValue('#merge_message_field', commitMessage)
      ]);
    });
  });
});
