"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _widgetHandler = require("./widgetHandler");

var _widgetHandler2 = _interopRequireDefault(_widgetHandler);

var _WidgetPriceAdjustment = require("../../widget-inputs/WidgetPriceAdjustment");

var _WidgetPriceAdjustment2 = _interopRequireDefault(_WidgetPriceAdjustment);

var _WidgetPricingInput = require("../../widget-inputs/WidgetPricingInput.js");

var _WidgetPricingInput2 = _interopRequireDefault(_WidgetPricingInput);

var _servicebotBaseForm = require("servicebot-base-form");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Checkbox = function Checkbox(props) {
    var input = props.input,
        configValue = props.configValue,
        label = props.label,
        _props$meta = props.meta,
        touched = _props$meta.touched,
        error = _props$meta.error,
        warning = _props$meta.warning;

    return _react2.default.createElement(
        "div",
        { className: "addon-checkbox-widget-default-value-wrapper" + (error && touched ? " has-error" : "") },
        _react2.default.createElement(
            "div",
            { className: "form-group form-group-flex addon-checkbox-widget-default-value" },
            _react2.default.createElement(
                "div",
                { className: "_label_wrapper" },
                label && _react2.default.createElement(
                    "label",
                    { className: "control-label form-label-flex-md addon-checkbox-widget-default-value-label" },
                    label
                ),
                configValue && configValue.pricing && configValue.pricing.value && _react2.default.createElement(_WidgetPriceAdjustment2.default, { price: configValue.pricing.value, operation: configValue.pricing.operation })
            ),
            _react2.default.createElement(
                "div",
                { className: "form-input-flex" },
                _react2.default.createElement(
                    "div",
                    { className: "request-form-toggle-option-wrapper" },
                    _react2.default.createElement(_servicebotBaseForm.OnOffToggleField, { faIcon: "check", color: "#0091EA", input: input, type: "checkbox" })
                )
            )
        )
    );
};
var Price = function Price(props) {
    var config = props.configValue;
    return _react2.default.createElement(
        "div",
        { className: "addon-checkbox-widget-price-inputs-wrapper" },
        _react2.default.createElement(
            "div",
            { className: "form-group form-group-flex checkbox-checkbox-widget-price-inputs" },
            _react2.default.createElement(_WidgetPricingInput2.default, { input: props.input, operation: config && config.pricing && config.pricing.operation })
        )
    );
};

var widget = {
    widget: Checkbox,
    type: "checkbox",
    label: "Checkbox",
    pricing: Price,
    handler: _widgetHandler2.default
};

exports.default = widget;
module.exports = exports.default;