
export class TemplateToken {
  /**
   * @param {String} rawToken
   */
  constructor(rawToken) {
    const {name, filter} = this._parse(rawToken);

    this._name = name;
    this._filter = filter;
  }

  /**
   * TODO: add multifilter support
   * @param {String} rawToken
   * @returns {{name: string, filter: string}}
   * @private
   */
  _parse(rawToken) {
    const [_, name, filter] = rawToken.match(/^([^|]+)(?:\|([^|]+))?/);

    if (!name) {
      throw new Error(`Invalid token format: "${rawToken}"`);
    }

    return {
      name: name.trim(),
      filter: filter && filter.trim(),
    };
  }

  /**
   * @returns {String}
   */
  get name() {
    return this._name;
  }

  /**
   * @returns {String}
   */
  get filter() {
    return this._filter;
  }
}
