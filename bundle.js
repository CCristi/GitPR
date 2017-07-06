/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _CommitMetadataReader = __webpack_require__(1);

var _CommitMessageTemplate = __webpack_require__(2);

document.addEventListener('DOMContentLoaded', function () {
  var commitBtn = document.querySelector('#commit-btn');
  var template = new _CommitMessageTemplate.CommitMessageTemplate();

  commitBtn.addEventListener('click', function () {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.executeScript(tab.id, { code: "alert('test');" }, function (response) {});
    });
  });
}, false);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CommitMetadataReader = exports.CommitMetadataReader = function () {
  function CommitMetadataReader(activeTab) {
    _classCallCheck(this, CommitMetadataReader);

    this._activeTab = activeTab;
  }

  _createClass(CommitMetadataReader, [{
    key: 'getReviewers',
    value: function getReviewers() {
      return 'reviewer1,reviewer2,reviewer3';
    }
  }, {
    key: 'getJiraTicket',
    value: function getJiraTicket() {
      return '1234';
    }
  }, {
    key: 'getPRNumber',
    value: function getPRNumber() {
      return '1234';
    }
  }]);

  return CommitMetadataReader;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommitMessageTemplate = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractTemplate2 = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommitMessageTemplate = exports.CommitMessageTemplate = function (_AbstractTemplate) {
  _inherits(CommitMessageTemplate, _AbstractTemplate);

  function CommitMessageTemplate() {
    _classCallCheck(this, CommitMessageTemplate);

    return _possibleConstructorReturn(this, (CommitMessageTemplate.__proto__ || Object.getPrototypeOf(CommitMessageTemplate)).apply(this, arguments));
  }

  _createClass(CommitMessageTemplate, [{
    key: 'getTemplate',
    value: function getTemplate() {
      return '\nJira: {{ jiraTicket }}\nReviewers: {{ reviewers }}\nPR: GH-{{ prNumber }}\n    '.trim();
    }
  }]);

  return CommitMessageTemplate;
}(_AbstractTemplate2.AbstractTemplate);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractTemplate = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SimpleTemplateDriver = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractTemplate = exports.AbstractTemplate = function () {
  function AbstractTemplate() {
    var templateDriver = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, AbstractTemplate);

    this._templateDriver = templateDriver || new _SimpleTemplateDriver.SimpleTemplateDriver();
  }

  _createClass(AbstractTemplate, [{
    key: 'render',
    value: function render(parameters) {
      var rawTemplate = this.getTemplate();

      return this._templateDriver.renderToString(rawTemplate, parameters);
    }
  }, {
    key: 'getTemplate',
    value: function getTemplate() {
      throw new Error('Implement in child classes');
    }
  }]);

  return AbstractTemplate;
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleTemplateDriver = exports.SimpleTemplateDriver = function () {
  function SimpleTemplateDriver() {
    _classCallCheck(this, SimpleTemplateDriver);
  }

  _createClass(SimpleTemplateDriver, [{
    key: "renderToString",
    value: function renderToString(rawTemplate, params) {
      return rawTemplate.replace(/{{\s*(\w+)\s*}}/g, function (match, paramName) {
        if (!params.hasOwnProperty(paramName)) {
          throw new Error("Missing template parameter \"" + paramName + "\"");
        }

        return params[paramName].toString();
      });
    }
  }]);

  return SimpleTemplateDriver;
}();

/***/ })
/******/ ]);