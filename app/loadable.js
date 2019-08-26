import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _typeof from "@babel/runtime/helpers/typeof";
import React from 'react';
import PropTypes from 'prop-types';
var ALL_INITIALIZERS = [];
var READY_INITIALIZERS = [];

function isWebpackReady(getModuleIds) {
  if ((typeof __webpack_modules__ === "undefined" ? "undefined" : _typeof(__webpack_modules__)) !== 'object') {
    // eslint-disable-line
    return false;
  }

  return getModuleIds().every(function (moduleId) {
    return typeof moduleId !== 'undefined' && typeof __webpack_modules__[moduleId] !== 'undefined' // eslint-disable-line
    ;
  });
}

function load(loader) {
  var promise = loader();
  var state = {
    loading: true,
    loaded: null,
    error: null
  };
  state.promise = promise.then(function (loaded) {
    state.loading = false;
    state.loaded = loaded;
    return loaded;
  }).catch(function (err) {
    state.loading = false;
    state.error = err;
    console.log(err);
  });
  return state;
}

function loadMap(obj) {
  var state = {
    loading: false,
    loaded: {},
    error: null
  };
  var promises = [];

  try {
    Object.keys(obj).forEach(function (key) {
      var result = load(obj[key]);

      if (!result.loading) {
        state.loaded[key] = result.loaded;
        state.error = result.error;
      } else {
        state.loading = true;
      }

      promises.push(result.promise);
      result.promise.then(function (res) {
        state.loaded[key] = res;
      }).catch(function (err) {
        state.error = err;
      });
    });
  } catch (err) {
    state.error = err;
  }

  state.promise = Promise.all(promises).then(function (res) {
    state.loading = false;
    return res;
  }).catch(function (err) {
    state.loading = false;
    throw err;
  });
  return state;
}

function resolve(obj) {
  return obj && obj.__esModule ? obj.default : obj;
}

function render(loaded, props, Layout) {
  var Loadable = resolve(loaded);
  return Layout ? React.createElement(Layout, null, React.createElement(Loadable, props)) : React.createElement(Loadable, props);
}

function createLoadableComponent(loadFn, options) {
  var _class, _temp;

  if (!options.loading) {
    throw new Error('react-loadable requires a `loading` component');
  }

  var opts = Object.assign({
    loader: null,
    loading: null,
    delay: 200,
    timeout: null,
    render: render,
    webpack: null,
    modules: null
  }, options);
  var res = null;

  function init() {
    if (!res) {
      res = loadFn(opts.loader);
    }

    return res.promise;
  }

  ALL_INITIALIZERS.push(init);

  if (typeof opts.webpack === 'function') {
    READY_INITIALIZERS.push(function () {
      if (isWebpackReady(opts.webpack)) {
        return init();
      }
    });
  }

  return _temp = _class =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(LoadableComponent, _React$Component);

    function LoadableComponent(props) {
      var _this;

      _classCallCheck(this, LoadableComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LoadableComponent).call(this, props));
      init();
      _this.state = {
        error: res.error,
        pastDelay: false,
        timedOut: false,
        loading: res.loading,
        loaded: res.loaded,
        extraProps: {},
        getProps: false
      };
      return _this;
    }

    _createClass(LoadableComponent, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        this._mounted = true;

        this._loadModule();
      }
    }, {
      key: "componentDidMount",
      value: function () {
        var _componentDidMount = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var _this2 = this;

          var props, getProps;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  props = this.props;
							
                  if (window.__USE_SSR__) {
                    window.onpopstate = function () {
                      _this2.getInitialProps();
                    };
                  }
                  getProps = !window.__USE_SSR__ || props.history && props.history.action === 'PUSH';

                  if (!getProps) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 6;
                  return this.getInitialProps();

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments);
        }

        return componentDidMount;
      }()
    }, {
      key: "getInitialProps",
      value: function () {
        var _getInitialProps = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee2() {
          var props, WrappedComponent, extraProps, Layout;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  // csr首次进入页面以及csr/ssr切换路由时才调用getInitialProps
                  props = this.props;
                  WrappedComponent = this.state.loaded;

                  if (!(WrappedComponent && WrappedComponent.default.getInitialProps)) {
                    _context2.next = 8;
                    break;
                  }

                  _context2.next = 5;
                  return WrappedComponent.default.getInitialProps(props);

                case 5:
                  _context2.t0 = _context2.sent;
                  _context2.next = 9;
                  break;

                case 8:
                  _context2.t0 = {};

                case 9:
                  extraProps = _context2.t0;
                  Layout = WrappedComponent && WrappedComponent.default.Layout;
                  this.setState({
                    extraProps: extraProps,
                    getProps: true,
                    Layout: Layout
                  });

                case 12:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getInitialProps() {
          return _getInitialProps.apply(this, arguments);
        }

        return getInitialProps;
      }()
    }, {
      key: "_loadModule",
      value: function _loadModule() {
        var _this3 = this;

        if (this.context.loadable && Array.isArray(opts.modules)) {
          opts.modules.forEach(function (moduleName) {
            _this3.context.loadable.report(moduleName);
          });
        }

        if (!res.loading) {
          return;
        }

        if (typeof opts.delay === 'number') {
          if (opts.delay === 0) {
            this.setState({
              pastDelay: true
            });
          } else {
            this._delay = setTimeout(function () {
              _this3.setState({
                pastDelay: true
              });
            }, opts.delay);
          }
        }

        if (typeof opts.timeout === 'number') {
          this._timeout = setTimeout(function () {
            _this3.setState({
              timedOut: true
            });
          }, opts.timeout);
        }

        var update = function update() {
          if (!_this3._mounted) {
            return;
          }

          _this3.setState({
            error: res.error,
            loaded: res.loaded,
            loading: res.loading
          });

          _this3._clearTimeouts();
        };

        res.promise.then(
        /*#__PURE__*/
        function () {
          var _ref = _asyncToGenerator(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee3(Module) {
            var moduleProps, Layout;
            return _regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (!(Module.default && Module.default.getInitialProps)) {
                      _context3.next = 6;
                      break;
                    }

                    _context3.next = 3;
                    return Module.default.getInitialProps(_this3.props);

                  case 3:
                    moduleProps = _context3.sent;
                    Layout = Module.default.Layout;

                    _this3.setState({
                      moduleProps: moduleProps,
                      Layout: Layout
                    });

                  case 6:
                    update();

                  case 7:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }()).catch(function (_) {
          update();
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this._mounted = false;

        this._clearTimeouts();
      }
    }, {
      key: "_clearTimeouts",
      value: function _clearTimeouts() {
        clearTimeout(this._delay);
        clearTimeout(this._timeout);
      }
    }, {
      key: "retry",
      value: function retry() {
        this.setState({
          error: null,
          loading: true,
          timedOut: false
        });
        res = loadFn(opts.loader);

        this._loadModule();
      }
    }, {
      key: "render",
      value: function render() {
        if (this.state.loading || this.state.error) {
          return React.createElement(opts.loading, {
            isLoading: this.state.loading,
            pastDelay: this.state.pastDelay,
            timedOut: this.state.timedOut,
            error: this.state.error,
            retry: this.retry
          });
        } else if (this.state.loaded) {
          return opts.render(this.state.loaded, Object.assign({}, this.props, this.state.extraProps, this.state.moduleProps), this.state.Layout);
        } else {
          return null;
        }
      }
    }], [{
      key: "preload",
      value: function preload() {
        return init();
      }
    }]);

    return LoadableComponent;
  }(React.Component), _class.contextTypes = {
    loadable: PropTypes.shape({
      report: PropTypes.func.isRequired
    })
  }, _temp;
}

function Loadable(opts) {
  return createLoadableComponent(load, opts);
}

function LoadableMap(opts) {
  if (typeof opts.render !== 'function') {
    throw new Error('LoadableMap requires a `render(loaded, props)` function');
  }

  return createLoadableComponent(loadMap, opts);
}

Loadable.Map = LoadableMap;

var Capture =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Capture, _React$Component2);

  function Capture() {
    _classCallCheck(this, Capture);

    return _possibleConstructorReturn(this, _getPrototypeOf(Capture).apply(this, arguments));
  }

  _createClass(Capture, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        loadable: {
          report: this.props.report
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      return React.Children.only(this.props.children);
    }
  }]);

  return Capture;
}(React.Component);

Capture.propTypes = {
  report: PropTypes.func.isRequired
};
Capture.childContextTypes = {
  loadable: PropTypes.shape({
    report: PropTypes.func.isRequired
  }).isRequired
};
Loadable.Capture = Capture;

function flushInitializers(initializers) {
  var promises = [];

  while (initializers.length) {
    var init = initializers.pop();
    promises.push(init());
  }

  return Promise.all(promises).then(function () {
    if (initializers.length) {
      return flushInitializers(initializers);
    }
  });
}

Loadable.preloadAll = function () {
  return new Promise(function (resolve, reject) {
    flushInitializers(ALL_INITIALIZERS).then(resolve, reject);
  });
};

Loadable.preloadReady = function () {
  return new Promise(function (resolve, reject) {
    // We always will resolve, errors should be handled within loading UIs.
    flushInitializers(READY_INITIALIZERS).then(resolve, resolve);
  });
};

export default Loadable;