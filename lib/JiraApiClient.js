import axios from "axios";

const ENDPOINTS = {
  TRANSACTIONS: "/rest/api/2/issue/:ticketId/transitions",
  WORKLOG: "/rest/api/2/issue/:ticketId/worklog"
};

export class JiraApiClient {
  /**
   * @param {String} apiBase
   */
  constructor(apiBase) {
    this.client = axios.create({
      baseURL: apiBase
    });
  }

  /**
   * @param {String} ticketId
   * @returns {Promise}
   */
  getTransitions(ticketId) {
    const url = this.buildUrl(ENDPOINTS.TRANSACTIONS, { ticketId });

    return this.client.get(url);
  }

  /**
   * @param {String} ticketId
   * @param {Object} params
   * @returns {Promise}
   */
  postTransition(ticketId, params) {
    const url = this.buildUrl(ENDPOINTS.TRANSACTIONS, { ticketId });

    return this.client.post(url, params);
  }

  /**
   * @param {String} ticketId
   * @param {Object} params
   * @returns {Promise}
   */
  postAddTime(ticketId, params) {
    const url = this.buildUrl(ENDPOINTS.WORKLOG, { ticketId });

    return this.client.post(url, params);
  }

  /**
   * @param {String} resourceUrlTpl
   * @param {Object} params
   * @returns {String}
   */
  buildUrl(resourceUrlTpl, params) {
    return resourceUrlTpl.replace(/:([^\/]+)/g, (match, paramName) => {
      if (!params.hasOwnProperty(paramName)) {
        throw new Error(
          `Missing "${paramName}" parameter. Cannot build "${resourceUrlTpl}" resource"`
        );
      }

      const paramValue = params[paramName];
      delete params[paramName];

      return paramValue.toString();
    });
  }
}
