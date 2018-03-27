import {ChromePluginConfig} from './lib/ChromePluginConfig';
import {PageController} from './lib/PageController';
import {MetadataReader} from './lib/MetadataReader';
import {JiraApiClient} from './lib/JiraApiClient';

function updateJiraBoard() {
  chrome.tabs.getSelected(null, function (tab) {
    const controller = new PageController(chrome.tabs, tab.id);
    const reader = new MetadataReader(controller);
    const pluginConfig = new ChromePluginConfig(chrome.storage);

    pluginConfig.load().then(() => reader.collect({
      labels: {
        strategy: 'dom-query',
        selector: '.labels.css-truncate',
        mapper: e => Array.from(e.children).map(label => label.title),
      },
      jiraTicket: {
        strategy: 'dom-query',
        selector: 'a[href*="atlassian.net/"]',
        mapper: e => e.innerHTML.trim(),
      }
    })).then(data => jiraMoveRequest(data, pluginConfig, controller));
  })
}

function jiraMoveRequest({labels, jiraTicket, hasToUpdateJiraTicket}, pluginConfig, controller) {
  const boardColumnName = getJiraColumnUsing(labels);
  const jiraApi = new JiraApiClient(pluginConfig.get('jiraBase'));

  return jiraTicket ? jiraApi.getTransitions(jiraTicket)
    .catch(e => {
      throw new Error(`${e.message}. Please ensure "${pluginConfig.get('jiraBase')}" is accessible.`);
    })
    .then(response => {
      const transitions = response.data.transitions;
      const targetColumn = transitions.find(t => new RegExp(boardColumnName, 'i').test(t.name));

      if (!targetColumn) {
        const tNames = transitions.map(t => t.name).join(', ');

        throw new Error(`Couldn't find column matching "${boardColumnName}". Available columns: ${tNames}.`);
      }
      const {id, name} = targetColumn;

      return jiraApi
        .postTransition(jiraTicket, {transition: {id}})
        .then(() => controller.alert(`Ticket ${jiraTicket} successfully moved to ${name}`));
    })
    .catch(e => controller.alert(`Error moving jira ticket: ${e.message}`))
  : Promise.resolve();
}

function getJiraColumnUsing(labels) {
  for(let element of labels) {
    switch (element) {
      case 'hold': return 'Open';           //Not started
      case 'wip': return 'In Progress';     //In progress
    }
  }

  return 'Review'                           //Needs review
}

export default updateJiraBoard;
