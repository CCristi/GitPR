import {TemplateToken} from './TemplateToken';

export class SimpleTemplateDriver {
  constructor() {
    this._filters = this.defaultFilters;
  }

  /**
   * todo: build an filter interface and add methods like "support"
   * @returns {{random: (function(*)), join: (function(*): (string|*)), clear: (function(*))}}
   */
  get defaultFilters() {
    return {
      random: array => {
        return array[Math.floor(Math.random() * array.length)]
      },
      join: array => array.join(', '),
      clear: string => {
        return string
          .replace(/^\s*:[^:]+\s*:\s*/, '')
          .replace(/\s*\(#\d+\)\s*$/, '');
      },
    }
  }

  /**
   * @param {String} filerName
   * @param {Function} filterFunc
   */
  addFilter(filerName, filterFunc) {
    this._filters[filerName] = filterFunc;
  }

  /**
   * @param {String} rawTemplate
   * @param {Object} params
   * @returns {void|string|*|XML}
   */
  renderToString(rawTemplate, params) {
    return rawTemplate.replace(/{{([^}]+)}}/g, (match, rawParam) => {
      const token = new TemplateToken(rawParam);

      if (!params.hasOwnProperty(token.name)) {
        throw new Error(`Missing template parameter "${token.name}"`);
      }

      if (token.filter && !this._filters.hasOwnProperty(token.filter)) {
        throw new Error(`Unknown template filter "${token.filter}"`);
      }

      const filterFunc = this._filters[token.filter] || (a => a);
      const tokenValue = params[token.name];

      return filterFunc(tokenValue);
    });
  }
}
