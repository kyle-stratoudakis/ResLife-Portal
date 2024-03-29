'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formsyReact = require('formsy-react');

var _formsyReact2 = _interopRequireDefault(_formsyReact);

var _TimePicker = require('material-ui/TimePicker');

var _TimePicker2 = _interopRequireDefault(_TimePicker);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FormsyTime = _react2.default.createClass({
  displayName: 'FormsyTime',


  propTypes: {
    defaultTime: _react2.default.PropTypes.object,
    name: _react2.default.PropTypes.string.isRequired,
    onChange: _react2.default.PropTypes.func,
    value: _react2.default.PropTypes.object
  },

  mixins: [_formsyReact2.default.Mixin],

  controlledValue(props = this.props) {
    return props.value || props.defaultTime || {};
  },

  getInitialState() {
    const value = this.controlledValue();
    return { value };
  },

  componentWillMount() {
    const value = this.controlledValue();
    this.setValue(value);
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.value !== this.props.value || nextProps.defaultTime !== this.props.defaultTime) {
      const value = this.controlledValue(nextProps);
      this.setValue(value);
      this.setState({ value });
    }
  },

  // componentDidMount: function componentDidMount() {
  //   var defaultTime = this.props.defaultTime;

  //   var value = this.getValue();

  //   if (typeof value === 'undefined' && typeof defaultTime !== 'undefined') {
  //     this.setValue(defaultTime);
  //   }
  // },

  handleChange: function handleChange(event, value) {
    this.setValue(value);
    if (this.props.onChange) this.props.onChange(event, value);
  },

  setMuiComponentAndMaybeFocus: _utils.setMuiComponentAndMaybeFocus,

  render: function render() {
    var _props = this.props;
    var defaultTime = _props.defaultTime;

    var rest = _objectWithoutProperties(_props, ['defaultTime']);

    return _react2.default.createElement(_TimePicker2.default, _extends({}, rest, {
      errorText: this.getErrorMessage(),
      onChange: this.handleChange,
      ref: this.setMuiComponentAndMaybeFocus,
      value: this.getValue()
    }));
  }
});

exports.default = FormsyTime;