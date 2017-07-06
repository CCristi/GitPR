
export class MetadataReader {
  constructor(pageController) {
    this._pageController = pageController;
  }

  collect(config) {
    const promises = Object.keys(config).map(key => {
      const keyConfig = config[key];
      const valEnhancer = value => ({[key]: value});

      switch(keyConfig.strategy) {
        case 'js-eval':
          return this._jsEval(keyConfig).then(valEnhancer);
        case 'dom-query':
          return this._domQuery(keyConfig).then(valEnhancer);
      }
    });

    return Promise.all(promises).then(obj => {
      return obj.reduce((o, i) => {
        return Object.assign(o, i);
      }, {})
    });
  }

  _domQuery(keyConfig) {
    const code = `(${keyConfig.mapper.toString()})(document.querySelector('${keyConfig.selector}'))`;
    return this._jsEval({code});
  }

  _jsEval(keyConfig) {
    return this._pageController.executeCode(keyConfig.code);
  }
}
