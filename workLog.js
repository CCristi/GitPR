import { ChromePluginConfig } from "./lib/ChromePluginConfig";
import { PageController } from "./lib/PageController";
import { MetadataReader } from "./lib/MetadataReader";
import { JiraApiClient } from "./lib/JiraApiClient";

function workLog() {
  document.getElementById("work-log-modal").classList.add("show");
  document.getElementById("track-time").addEventListener("click", trackTime);
}

function trackTime() {
  chrome.tabs.getSelected(null, function(tab) {
    const controller = new PageController(chrome.tabs, tab.id);
    const reader = new MetadataReader(controller);
    const pluginConfig = new ChromePluginConfig(chrome.storage);

    pluginConfig
      .load()
      .then(() =>
        reader.collect({
          jiraTicket: {
            strategy: "dom-query",
            selector: 'a[href*="atlassian.net/"]',
            mapper: e => e.innerHTML.trim()
          }
        })
      )
      .then(data => jiraWorkLogRequest(data, pluginConfig, controller));
  });
}

function jiraWorkLogRequest({ jiraTicket }, pluginConfig, controller) {
  const jiraApi = new JiraApiClient(pluginConfig.get("jiraBase"));
  const timeSpent = document.getElementById("work-log-time").value;
  const comment = document.getElementById("work-log-comment").value;
  const params = { comment, timeSpent };

  return jiraTicket
    ? jiraApi
        .postAddTime(jiraTicket, params)
        .catch(e => {
          throw new Error(
            `${e.message}. Please ensure "${pluginConfig.get(
              "jiraBase"
            )}" is accessible.`
          );
        })
        .then(response => {
          console.log({ response });
          controller.alert(`Successfully logged time to ticket ${jiraTicket} `);
        })
        .catch(e =>
          controller.alert(`Error adding time to ticket: ${e.message}`)
        )
    : Promise.resolve();
}

function getJiraColumnUsing(labels, pluginConfig) {
  const transitions = pluginConfig.get("labelTransitions");
  const intersetedKeys = Object.keys(transitions).filter(
    key => labels.indexOf(key) !== -1
  );
  const [firstIntersectedLabel] = intersetedKeys;

  return transitions[firstIntersectedLabel || "default"];
}

export default workLog;
