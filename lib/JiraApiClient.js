import axios from 'axios';

const ENDPOINTS = {
  TRANSACTIONS: '/rest/api/2/issue/:ticketId/transitions',
};

export class JiraApiClient {
  constructor(apiBase) {
    this.client = axios.create({
      baseURL: apiBase,
    });
  }

  getTransitions(ticketId) {
    const url = this.buildUrl(ENDPOINTS.TRANSACTIONS, {ticketId});

    return this.client.get(url);
  }

  postTransition(ticketId, params) {
    const url = this.buildUrl(ENDPOINTS.TRANSACTIONS, {ticketId});

    return this.client.post(url, params);
  }

  buildUrl(resourceUrlTpl, params) {
    return resourceUrlTpl.replace(/:([^\/]+)/g, (match, paramName) => {
      if (!params.hasOwnProperty(paramName)) {
        throw new Error(`Missing "${paramName}" parameter. Cannot build "${resourceUrlTpl}" resource"`);
      }

      const paramValue = params[paramName];
      delete params[paramName];

      return paramValue.toString();
    });
  }
}
