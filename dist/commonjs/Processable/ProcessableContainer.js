"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var RaisedButton_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js");
var Dialog_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/Dialogs/Dialog/Dialog.js");
var Form_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/Form/Form.js");
var Confirm_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/Confirm/Confirm.js");
var themeBuilder_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/themeBuilder.js");
var getMuiTheme_js_1 = require("material-ui/styles/getMuiTheme.js");
var mustache = require("mustache");
var ProcessableContainer = (function (_super) {
    __extends(ProcessableContainer, _super);
    function ProcessableContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.widgetConfig = null;
        _this.state = {
            modalOpen: props.modal,
            formData: {},
            canceled: false,
            processing: false
        };
        return _this;
    }
    ProcessableContainer.prototype.getChildContext = function () {
        return {
            muiTheme: getMuiTheme_js_1.default(this.props.theme)
        };
    };
    ProcessableContainer.prototype.componentWillMount = function () {
        var _this = this;
        var processInstance = this.props.processInstance;
        var widget = null;
        var widgetName = null;
        var widgetNameArr = processInstance.nextTaskDef.extensions.properties.filter(function (property) { return property.name === 'widgetName'; });
        if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
            widgetNameArr && widgetNameArr.length === 1) {
            widgetName = widgetNameArr[0].value;
            var tokenData = (processInstance.nextTaskEntity && processInstance.nextTaskEntity.processToken ? processInstance.nextTaskEntity.processToken.data : null);
            switch (widgetName) {
                case 'Form':
                    {
                        var formElements = [];
                        if (processInstance.nextTaskDef.extensions.formFields && processInstance.nextTaskDef.extensions.formFields.length > 0) {
                            formElements = processInstance.nextTaskDef.extensions.formFields.map(function (formField) {
                                var parsedType = null;
                                var options = {};
                                var formFieldWidgetNameArr;
                                var formFieldMuiPropsArr;
                                var muiProps = {};
                                formFieldMuiPropsArr = formField.formProperties.filter(function (formFieldProperty) { return formFieldProperty.name === 'muiProps'; });
                                if (formField.formProperties && formFieldMuiPropsArr && formFieldMuiPropsArr.length === 1 && formFieldMuiPropsArr[0].value) {
                                    muiProps = JSON.parse(formFieldMuiPropsArr[0].value.replace(/\&\#34\;/gi, '"'));
                                }
                                switch (formField.type) {
                                    case 'string':
                                        parsedType = 'TextField';
                                        break;
                                    case 'boolean':
                                        parsedType = 'CheckBox';
                                        options.initialValue = null;
                                        if (formField.defaultValue !== null) {
                                            options.initialValue = (formField.defaultValue === '1');
                                        }
                                        break;
                                    case 'enum':
                                        parsedType = 'DropDown';
                                        formFieldWidgetNameArr = formField.formProperties.filter(function (formFieldProperty) { return formFieldProperty.name === 'widgetName'; });
                                        if (formField.formProperties && formFieldWidgetNameArr && formFieldWidgetNameArr.length === 1) {
                                            parsedType = formFieldWidgetNameArr[0].value;
                                        }
                                        if (parsedType === 'RadioBox') {
                                            options.radioButtonMuiProps = themeBuilder_js_1.buildTheme({
                                                theme: _this.props.formItemTheme,
                                                sourceMuiProps: {},
                                                componentName: 'RadioButton'
                                            }).muiProps;
                                        }
                                        if (formField.formValues && formField.formValues.length > 0) {
                                            options.items = formField.formValues.map(function (formValue) {
                                                var value = formValue.id;
                                                var label = formValue.name;
                                                if (value && label) {
                                                    return {
                                                        value: value,
                                                        label: label
                                                    };
                                                }
                                                return null;
                                            }).filter(function (formValue) { return (formValue !== null); });
                                        }
                                        if (formField.defaultValue) {
                                            options.initialValue = formField.defaultValue;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                if (parsedType) {
                                    return __assign({ theme: _this.props.formItemTheme, label: formField.label, type: parsedType, muiProps: muiProps, key: formField.id }, options);
                                }
                                return null;
                            }).filter(function (formField) { return (formField !== null); });
                        }
                        widget = {
                            component: Form_js_1.default,
                            isModal: this.props.modal,
                            props: {
                                theme: this.props.widgetTheme,
                                layout: formElements
                            }
                        };
                    }
                    break;
                case 'Confirm':
                    {
                        var confirmLayoutArr = processInstance.nextTaskDef.extensions.properties.filter(function (property) { return property.name === 'confirmLayout'; });
                        var confirmMessageArr = processInstance.nextTaskDef.extensions.properties.filter(function (property) { return property.name === 'confirmMessage'; });
                        var confirmLayout = [];
                        var confirmMessage = '';
                        var confirmElements = [];
                        if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
                            confirmMessageArr && confirmLayoutArr.length === 1) {
                            confirmLayout = JSON.parse(confirmLayoutArr[0].value);
                            confirmElements = confirmLayout.map(function (element) {
                                var elementObj = {
                                    theme: _this.props.confirmItemTheme,
                                    key: element.key,
                                    label: element.label
                                };
                                if (element.isCancel) {
                                    elementObj.muiProps = {
                                        primary: false,
                                        secondary: true
                                    };
                                }
                                return elementObj;
                            });
                        }
                        if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
                            confirmMessageArr && confirmMessageArr.length === 1) {
                            confirmMessage = mustache.render(confirmMessageArr[0].value, tokenData);
                        }
                        widget = {
                            component: Confirm_js_1.default,
                            isModal: this.props.modal,
                            props: {
                                theme: this.props.widgetTheme,
                                layout: confirmElements,
                                message: confirmMessage
                            }
                        };
                    }
                    break;
                default:
                    break;
            }
        }
        if (widget) {
            this.widgetConfig = widget;
        }
    };
    ProcessableContainer.prototype.handleCancel = function (executionContext) {
        var _this = this;
        var processInstance = this.props.processInstance;
        var fireCancel = function () {
            if (processInstance) {
                processInstance.doCancel(executionContext).then(function () {
                    _this.setState({
                        canceled: true,
                        processing: true
                    });
                });
            }
        };
        this.setState({
            modalOpen: false
        }, fireCancel);
    };
    ProcessableContainer.prototype.handleProceed = function (executionContext, tokenData) {
        var _this = this;
        var processInstance = this.props.processInstance;
        var fireProceed = function () {
            if (processInstance) {
                processInstance.doProceed(executionContext, tokenData).then(function () {
                    _this.setState({
                        canceled: false,
                        processing: true
                    });
                });
            }
        };
        if (this.props.modal) {
            this.setState({
                canceled: false,
                modalOpen: false
            }, fireProceed);
        }
        else {
            fireProceed();
        }
    };
    ProcessableContainer.prototype.render = function () {
        var _this = this;
        var qflProps = themeBuilder_js_1.buildTheme({
            theme: this.props.theme,
            sourceMuiProps: this.props.muiProps,
            sourceQflProps: this.props.qflProps,
            componentName: 'Processable'
        }).qflProps;
        var processInstance = this.props.processInstance;
        var proceedButton = null;
        var cancelButton = null;
        var widget = null;
        if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Form') {
            proceedButton = (React.createElement(RaisedButton_js_1.default, { theme: this.props.buttonTheme, muiProps: {
                    label: 'Weiter',
                    primary: true
                }, qflProps: {
                    onClick: function (e) {
                        _this.handleProceed(_this.props.executionContext, { formData: _this.state.formData });
                    }
                } }));
            if (this.props.modal) {
                cancelButton = (React.createElement(RaisedButton_js_1.default, { theme: this.props.buttonTheme, muiProps: {
                        label: 'Abbrechen',
                        primary: true
                    }, qflProps: {
                        onClick: function (e) {
                            _this.handleCancel(_this.props.executionContext);
                        }
                    } }));
            }
            var onChange_1 = function (formData) {
                _this.setState({
                    formData: formData
                });
            };
            widget = React.createElement(this.widgetConfig.component, __assign({ onChange: function (formData) { return onChange_1(formData); } }, this.widgetConfig.props));
        }
        else if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Confirm') {
            var onChoose_1 = function (key) {
                var confirmData = {
                    key: key
                };
                _this.handleProceed(_this.props.executionContext, { confirmData: confirmData });
            };
            widget = React.createElement(this.widgetConfig.component, __assign({ onChoose: function (key) { return onChoose_1(key); } }, this.widgetConfig.props));
        }
        if (processInstance) {
            var tokenDataElement = null;
            var tokenData = null;
            if (processInstance && processInstance.nextTaskEntity && processInstance.nextTaskEntity.processToken && processInstance.nextTaskEntity.processToken.data) {
                tokenData = processInstance.nextTaskEntity.processToken.data;
            }
            if (tokenData) {
                tokenDataElement = (React.createElement("div", { style: {
                        position: 'absolute',
                        zIndex: 2,
                        display: 'inline-block',
                        top: '170px',
                        left: '10px',
                        padding: '0px'
                    } }));
            }
            if (processInstance.nextTaskDef && !this.state.processing) {
                if (this.props.modal) {
                    return (React.createElement("div", __assign({ style: {
                            display: 'inline-block',
                            padding: '10px',
                            textAlign: 'left'
                        } }, qflProps),
                        React.createElement(Dialog_js_1.default, { theme: this.props.dialogTheme, muiProps: __assign({ title: processInstance.nextTaskDef.name, actions: [cancelButton, proceedButton], modal: true, open: this.state.modalOpen }, this.props.dialogMuiProps), qflProps: __assign({}, this.props.dialogQflProps) },
                            widget,
                            React.createElement("br", null)),
                        React.createElement("br", null),
                        tokenDataElement));
                }
                return (React.createElement("div", __assign({ style: {
                        padding: '10px'
                    } }, qflProps),
                    React.createElement("h4", null, processInstance.nextTaskDef.name),
                    widget,
                    React.createElement("br", null),
                    proceedButton,
                    React.createElement("br", null),
                    tokenDataElement,
                    React.createElement("hr", null)));
            }
            var processingComponent = (React.createElement("span", null, "Bitte warten..."));
            if (this.state.canceled) {
                processingComponent = null;
            }
            return (React.createElement("div", __assign({ style: {
                    display: 'table',
                    padding: '10px',
                    margin: '0 auto'
                } }, qflProps),
                React.createElement("div", { style: {
                        display: 'table-cell',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                    } }, processingComponent),
                React.createElement("hr", null)));
        }
        return null;
    };
    ProcessableContainer.defaultProps = {
        theme: 'Default',
        muiProps: {},
        qflProps: {},
        buttonTheme: 'Default',
        dialogTheme: 'Default',
        modal: false,
        formItemTheme: 'Default',
        widgetTheme: 'Default',
        confirmItemTheme: 'Default',
        processableClassName: null,
        modalProcessableClassName: null,
        dialogMuiProps: null,
        dialogQflProps: null
    };
    ProcessableContainer.childContextTypes = {
        muiTheme: PropTypes.object
    };
    return ProcessableContainer;
}(React.Component));
exports.ProcessableContainer = ProcessableContainer;
exports.default = ProcessableContainer;

//# sourceMappingURL=ProcessableContainer.js.map
