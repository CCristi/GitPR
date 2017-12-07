
export class PageController {
  /**
   * @param {*} tabService
   * @param {String} tabId
   */
  constructor(tabService, tabId) {
    this._tabService = tabService;
    this._tabId = tabId;
  }

  /**
   * @param {String} elementId
   * @returns {Promise}
   */
  clickOn(elementId) {
    const code = `document.querySelector(\`${elementId}\`).click()`;

    return this.executeCode(code);
  }

  /**
   * @param {String} message
   * @returns {Promise}
   */
  alert(message) {
    const code = `alert(\`${message}\`)`;

    return this.executeCode(code);
  }

  /**
   * @param {String} selector
   * @returns {Promise}
   */
  hasSelector(selector) {
    const code = `Boolean(document.querySelector(\`${selector}\`))`;

    return this.executeCode(code);
  }

  /**
   * @param {String} inputSelector
   * @param {String} value
   * @returns {Promise}
   */
  updateInputValue(inputSelector, value) {
    const code = `document.querySelector(\`${inputSelector}\`).value = \`${value}\``;

    return this.hasSelector(inputSelector).then(has => has && this.executeCode(code));
  }

  /**
   * @param {String|Function} code
   * @returns {Promise}
   */
  executeCode(code) {
    const codeStr = code instanceof Function
      ? `(${code.toString()})(document)`
      : code;

    return new Promise(resolve => {
      this._tabService.executeScript(this._tabId, {code: `(${codeStr})`}, r => resolve(r[0]));
    });
  }
}
