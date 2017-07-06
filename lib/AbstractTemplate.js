import {SimpleTemplateDriver} from './SimpleTemplateDriver';

export class AbstractTemplate {
  constructor(templateDriver = null) {
    this._templateDriver = templateDriver || new SimpleTemplateDriver();
  }

  render(parameters) {
    const rawTemplate = this.getTemplate();

    return this._templateDriver.renderToString(rawTemplate, parameters);
  }

  getTemplate() {
    throw new Error('Implement in child classes');
  }
}
