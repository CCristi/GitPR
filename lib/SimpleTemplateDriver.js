
export class SimpleTemplateDriver {
  constructor() {}

  renderToString(rawTemplate, params) {
    return rawTemplate.replace(/{{\s*(\w+)\s*}}/g, (match, paramName) => {
      if (!params.hasOwnProperty(paramName)) {
        throw new Error(`Missing template parameter "${paramName}"`);
      }

      return params[paramName].toString();
    });
  }
}
