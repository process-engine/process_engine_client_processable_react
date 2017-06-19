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
var frontend_mui_1 = require("@process-engine-js/frontend_mui");
var mustache_1 = require("mustache");
var react_json_tree_1 = require("react-json-tree");
var ProcessableContainer = (function (_super) {
    __extends(ProcessableContainer, _super);
    function ProcessableContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.defaultProps = {
            theme: 'Default',
            muiProps: {},
            qflProps: {},
            subscription: null,
            mbClient: null,
            buttonTheme: null,
            dialogTheme: null,
            modal: false,
            formItemTheme: null,
            widgetTheme: null,
            confirmItemTheme: null,
            processableClassName: null,
            modalProcessableClassName: null,
            dialogMuiProps: null,
            dialogQflProps: null
        };
        _this.widgetConfig = null;
        _this.tokenData = null;
        _this.state = {
            modalOpen: props.modal,
            formData: {},
            canceled: false,
            processing: false
        };
        return _this;
    }
    ProcessableContainer.prototype.handleUserTask = function (message) {
        return;
    };
    ProcessableContainer.prototype.handleManualTask = function (message) {
        return;
    };
    ProcessableContainer.prototype.handleEndEvent = function (message) {
        return;
    };
    ProcessableContainer.prototype.componentWillMount = function () {
        var _this = this;
        var subscription = this.props.subscription;
        var widget = null;
        var widgetName = null;
        var widgetNameArr = subscription.nextTask.extensions.properties.filter(function (property) { return property.name === 'widgetName'; });
        if (subscription.nextTask && subscription.nextTask.extensions && subscription.nextTask.extensions.properties &&
            widgetNameArr && widgetNameArr.length === 1) {
            widgetName = widgetNameArr[0].value;
            var tokenData = (subscription.nextTaskEntity && subscription.nextTaskEntity.processToken ? subscription.nextTaskEntity.processToken.data : null);
            switch (widgetName) {
                case 'Form':
                    {
                        var formElements = [];
                        if (subscription.nextTask.extensions.formFields && subscription.nextTask.extensions.formFields.length > 0) {
                            formElements = subscription.nextTask.extensions.formFields.map(function (formField) {
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
                                            options.radioButtonMuiProps = frontend_mui_1.buildTheme({
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
                            component: frontend_mui_1.Form,
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
                        var confirmLayoutArr = subscription.nextTask.extensions.properties.filter(function (property) { return property.name === 'confirmLayout'; });
                        var confirmMessageArr = subscription.nextTask.extensions.properties.filter(function (property) { return property.name === 'confirmMessage'; });
                        var confirmLayout = [];
                        var confirmMessage = '';
                        var confirmElements = [];
                        if (subscription.nextTask && subscription.nextTask.extensions && subscription.nextTask.extensions.properties &&
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
                        if (subscription.nextTask && subscription.nextTask.extensions && subscription.nextTask.extensions.properties &&
                            confirmMessageArr && confirmMessageArr.length === 1) {
                            confirmMessage = mustache_1.default.render(confirmMessageArr[0].value, tokenData);
                        }
                        widget = {
                            component: frontend_mui_1.Confirm,
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
    ProcessableContainer.prototype.handleCancel = function () {
        var _this = this;
        var subscription = this.props.subscription;
        var fireCancel = function () {
            var msg = {};
            if (_this.props.mbClient) {
                msg = _this.props.mbClient.createMessage({
                    action: 'cancel'
                });
            }
            if (_this.props.mbClient && subscription.taskChannelName) {
                _this.props.mbClient.publish(subscription.taskChannelName, msg);
                _this.setState({
                    canceled: true,
                    processing: true
                });
            }
        };
        this.setState({
            modalOpen: false
        }, fireCancel);
    };
    ProcessableContainer.prototype.handleProceed = function (tokenData) {
        var _this = this;
        var subscription = this.props.subscription;
        var fireProceed = function () {
            var msg = _this.props.mbClient.createMessage({
                action: 'proceed',
                token: tokenData
            });
            if (_this.props.mbClient && subscription.taskChannelName) {
                _this.props.mbClient.publish(subscription.taskChannelName, msg);
                _this.setState({
                    canceled: false,
                    processing: true
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
        var _a = frontend_mui_1.buildTheme({
            theme: this.props.theme,
            sourceMuiProps: this.props.muiProps,
            sourceQflProps: this.props.qflProps,
            componentName: 'Processable'
        }), muiProps = _a.muiProps, qflProps = _a.qflProps;
        var subscription = this.props.subscription;
        var proceedButton = null;
        var cancelButton = null;
        var widget = null;
        if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Form') {
            proceedButton = (React.createElement(frontend_mui_1.RaisedButton, { theme: this.props.buttonTheme, muiProps: {
                    label: 'Weiter',
                    primary: true
                }, qflProps: {
                    onClick: function (e) {
                        _this.handleProceed({ formData: _this.state.formData });
                    }
                } }));
            if (this.props.modal) {
                cancelButton = (React.createElement(frontend_mui_1.RaisedButton, { theme: this.props.buttonTheme, muiProps: {
                        label: 'Abbrechen',
                        primary: true
                    }, qflProps: {
                        onClick: function (e) {
                            _this.handleCancel();
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
                _this.handleProceed({ confirmData: confirmData });
            };
            widget = React.createElement(this.widgetConfig.component, __assign({ onChoose: function (key) { return onChoose_1(key); } }, this.widgetConfig.props));
        }
        if (subscription) {
            var tokenDataElement = null;
            var tokenData = null;
            if (subscription && subscription.nextTaskEntity && subscription.nextTaskEntity.processToken && subscription.nextTaskEntity.processToken.data) {
                tokenData = subscription.nextTaskEntity.processToken.data;
            }
            if (tokenData) {
                tokenDataElement = (React.createElement("div", { style: {
                        position: 'absolute',
                        zIndex: 2,
                        display: 'inline-block',
                        top: '170px',
                        left: '10px',
                        padding: '0px'
                    } },
                    React.createElement(react_json_tree_1.default, { hideRoot: true, style: {
                            padding: '10px !important'
                        }, data: tokenData })));
            }
            if (subscription.nextTask && !this.state.processing) {
                if (this.props.modal) {
                    return (React.createElement("div", __assign({ style: {
                            display: 'inline-block',
                            padding: '10px',
                            textAlign: 'left'
                        } }, qflProps),
                        React.createElement(frontend_mui_1.Dialog, { theme: this.props.dialogTheme, muiProps: __assign({ title: subscription.nextTask.name, actions: [cancelButton, proceedButton], modal: true, open: this.state.modalOpen }, this.props.dialogMuiProps), qflProps: __assign({}, this.props.dialogQflProps) },
                            widget,
                            React.createElement("br", null)),
                        React.createElement("br", null),
                        tokenDataElement));
                }
                return (React.createElement("div", __assign({ style: {
                        padding: '10px'
                    } }, qflProps),
                    React.createElement("h4", null, subscription.nextTask.name),
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
    return ProcessableContainer;
}(React.Component));
exports.ProcessableContainer = ProcessableContainer;
exports.default = ProcessableContainer;

//# sourceMappingURL=ProcessableContainer.js.map
