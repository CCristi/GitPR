
export class PageController {
  constructor(tabService, tabId) {
    this._tabService = tabService;
    this._tabId = tabId;
  }

  clickOn(elementId) {
    const code = `document.querySelector("${elementId}").click()`;

    return this.executeCode(code);
  }

  hasSelector(selector) {
    const code = `Boolean(document.querySelector("${selector}"))`;

    return this.executeCode(code);
  }

  updateInputValue(inputSelector, value) {
    const code = `document.querySelector("${inputSelector}").value = \`${value}\``;

    return this.executeCode(code);
  }

  executeCode(code) {
    return new Promise(resolve => {
      this._tabService.executeScript(this._tabId, {code: `(${code})`}, r => resolve(r[0]));
    });
  }
}
