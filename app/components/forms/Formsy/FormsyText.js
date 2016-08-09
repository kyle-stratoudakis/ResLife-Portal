'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keycode = require('keycode');

var _keycode2 = _interopRequireDefault(_keycode);

var _formsyReact = require('formsy-react');

var _formsyReact2 = _interopRequireDefault(_formsyReact);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FormsyText = _react2.default.createClass({
  displayName: 'FormsyText',


  propTypes: {
    defaultValue: _react2.default.PropTypes.any,
    name: _react2.default.PropTypes.string.isRequired,
    onBlur: _react2.default.PropTypes.func,
    onChange: _react2.default.PropTypes.func,
    onFocus: _react2.default.PropTypes.func,
    onKeyDown: _react2.default.PropTypes.func,
    value: _react2.default.PropTypes.any
  },

  mixins: [_formsyReact2.default.Mixin],

  // getInitialState: function getInitialState() {
  //   return {
  //     value: this.props.defaultValue || this.props.value || ''
  //   };
  // },
  // componentWillMount: function componentWillMount() {
  //   this.setValue(this.props.defaultValue || this.props.value || '');
  // },
  
  controlledValue(props = this.props) {
    return props.value || props.defaultValue || '';
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
    if(nextProps.value !== this.props.value || nextProps.defaultValue !== this.props.defaultValue) {
      const value = this.controlledValue(nextProps);
      this.setValue(value);
      this.setState({ value });
    }
  },

  handleBlur: function handleBlur(event) {
    this.setValue(event.currentTarget.value);
    if (this.props.onBlur) this.props.onBlur(event);
  },

  handleChange: function handleChange(event) {
    this.setState({
      value: event.currentTarget.value
    });
    if (this.props.onChange) this.props.onChange(event);
  },

  handleKeyDown: function handleKeyDown(event) {
    if ((0, _keycode2.default)(event) === 'enter') this.setValue(event.currentTarget.value);
    if (this.props.onKeyDown) this.props.onKeyDown(event, event.currentTarget.value);
  },

  setMuiComponentAndMaybeFocus: _utils.setMuiComponentAndMaybeFocus,

  render: function render() {
    var _props = this.props;
    var defaultValue = _props.defaultValue;
    var // eslint-disable-line no-unused-vars
    onFocus = _props.onFocus;
    var value = _props.value;

    var rest = _objectWithoutProperties(_props, ['defaultValue', 'onFocus', 'value']);

    return _react2.default.createElement(_TextField2.default, _extends({}, rest, {
      errorText: this.getErrorMessage(),
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onFocus: onFocus,
      onKeyDown: this.handleKeyDown,
      ref: this.setMuiComponentAndMaybeFocus,
      value: this.state.value
    }));
  }
});

exports.default = FormsyText;