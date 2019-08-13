import { MetadataReader } from "./lib/MetadataReader";
import { PageController } from "./lib/PageController";
import { SimpleTemplateDriver } from "./lib/SimpleTemplateDriver";
import { JiraApiClient } from "./lib/JiraApiClient";
import { ChromePluginConfig } from "./lib/ChromePluginConfig";
import updateJiraBoard from "./updateJiraBoard";
import workLog from "./workLog";
import "./css/normalize.css";
import "./css/popup.css";

function generateTemplate() {
  chrome.tabs.getSelected(null, function(tab) {
    const controller = new PageController(chrome.tabs, tab.id);
    const reader = new MetadataReader(controller);
    const templateDriver = new SimpleTemplateDriver();
    const pluginConfig = new ChromePluginConfig(chrome.storage);

    pluginConfig
      .load()
      .then(() =>
        reader.collect({
          reviewers: {
            strategy: "dom-query",
            selector: ".js-issue-sidebar-form .css-truncate",
            mapper: function(element) {
              return Array.from(element.children)
                .filter(reviewerParagraph =>
                  Boolean(reviewerParagraph.querySelector(".octicon-check"))
                )
                .map(reviewerParagraph => reviewerParagraph.innerText.trim());
            }
          },
          jiraTicket: {
            strategy: "dom-query",
            selector: 'a[href*="atlassian.net/"]',
            mapper: e => e.innerHTML.trim()
          },
          prNumber: {
            strategy: "js-eval",
            code: document => document.location.pathname.split("/").pop()
          },
          mergeTitle: {
            strategy: "dom-query",
            selector: "#merge_title_field",
            mapper: e => e.value
          },
          hasToUpdateJiraTicket: {
            strategy: "js-eval",
            code: document =>
              document.querySelector('a[href*="atlassian.net/"]') &&
              confirm("Do you want to update jira ticket ?")
          }
        })
      )
      .then(data => {
        const userAliases = pluginConfig.get("userAliases");

        data.reviewers = data.reviewers.map(reviewer => {
          return userAliases[reviewer] || reviewer.toLowerCase();
        });

        const { jiraTicket, hasToUpdateJiraTicket } = data;
        const jiraApi = new JiraApiClient(pluginConfig.get("jiraBase"));
        const boardColumnName = pluginConfig.get("boardColumn");
        const commitMessage = templateDriver.renderToString(
          pluginConfig.get("template"),
          data
        );
        const mergeTitle = templateDriver.renderToString(
          "{{ title | clear }}",
          {
            title: data.mergeTitle
          }
        );

        const updateJiraTicket =
          jiraTicket && hasToUpdateJiraTicket
            ? jiraApi
                .getTransitions(jiraTicket)
                .catch(e => {
                  throw new Error(
                    `${e.message}. Please ensure "${pluginConfig.get(
                      "jiraBase"
                    )}" is accessible.`
                  );
                })
                .then(response => {
                  const transitions = response.data.transitions;
                  const toDevCompleteTransition = transitions.find(t =>
                    new RegExp(boardColumnName, "i").test(t.name)
                  );

                  if (!toDevCompleteTransition) {
                    const tNames = transitions.map(t => t.name).join(", ");

                    throw new Error(
                      `Couldn't find column matching "${boardColumnName}". Available columns: ${tNames}.`
                    );
                  }

                  const { id, name } = toDevCompleteTransition;

                  return jiraApi
                    .postTransition(jiraTicket, { transition: { id } })
                    .then(() =>
                      controller.alert(
                        `Ticket ${jiraTicket} successfully moved to ${name}`
                      )
                    );
                })
                .catch(e =>
                  controller.alert(`Error moving jira ticket: ${e.message}`)
                )
            : Promise.resolve();

        return Promise.all([
          controller.updateInputValue("#merge_message_field", commitMessage),
          controller.updateInputValue("#merge_title_field", mergeTitle),
          updateJiraTicket
        ]);
      });
  });
}

document
  .getElementById("geenerate_template")
  .addEventListener("click", generateTemplate);
document
  .getElementById("update_jira_board")
  .addEventListener("click", updateJiraBoard);
document.getElementById("work_log").addEventListener("click", workLog);
