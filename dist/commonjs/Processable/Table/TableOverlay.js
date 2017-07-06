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
var Link = require("@process-engine-js/frontend_mui/dist/commonjs/Buttons/Link/Link.js");
var ToolBar = require("@process-engine-js/frontend_mui/dist/commonjs/Bars/ToolBar/Toolbar.js");
var CheckBox = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/CheckBox/Checkbox.js");
var ToolbarGroup = require("material-ui/Toolbar/ToolbarGroup.js");
var ToolbarSeparator = require("material-ui/Toolbar/ToolbarSeparator.js");
var frontend_mui_1 = require("@process-engine-js/frontend_mui");
var TableOverlay = (function (_super) {
    __extends(TableOverlay, _super);
    function TableOverlay() {
        var _this = _super.call(this) || this;
        _this.state = {
            selectedMenuItems: {}
        };
        return _this;
    }
    TableOverlay.prototype.handleChange = function (e, oldValue, newValue, dataKey) {
        var _this = this;
        if (oldValue !== newValue) {
            var currentSelectedMenuItems_1 = this.state.selectedMenuItems;
            if (newValue) {
                currentSelectedMenuItems_1[dataKey] = true;
            }
            else {
                delete currentSelectedMenuItems_1[dataKey];
            }
            this.setState({
                selectedMenuItems: currentSelectedMenuItems_1
            }, function () {
                if (_this.props.onSelectedMenuItemsChange) {
                    _this.props.onSelectedMenuItemsChange(currentSelectedMenuItems_1);
                }
            });
        }
    };
    TableOverlay.prototype.handleItemMenuClicked = function (e, dataKey) {
        if (this.props.onMenuItemClicked) {
            this.props.onMenuItemClicked(dataKey);
        }
    };
    TableOverlay.prototype.render = function () {
        var _this = this;
        var _a = frontend_mui_1.buildTheme({
            theme: this.props.theme,
            sourceMuiProps: this.props.muiProps,
            sourceQflProps: this.props.qflProps,
            componentName: 'TableOverlay'
        }), theme = _a.theme, qflProps = _a.qflProps, muiProps = _a.muiProps;
        return (React.createElement("div", __assign({}, qflProps),
            React.createElement(ToolBar, { theme: this.props.theme, muiProps: muiProps }, this.props.menuSchema.map(function (section, sectionIdx) {
                var elements = [];
                var menuHeaderElement = null;
                if (section.sectionName) {
                    menuHeaderElement = (React.createElement("h1", { className: _this.props.tableOverlayStyles.menuHeaderClassName }, section.sectionName));
                }
                elements.push(React.createElement(ToolbarGroup, { key: sectionIdx, firstChild: (sectionIdx === 0), style: {
                        marginLeft: (sectionIdx === 0 ? theme.distances.secondary : theme.distances.tertiary),
                        display: 'block'
                    } },
                    menuHeaderElement,
                    React.createElement("span", { className: _this.props.menuItemClassName }, section.items.map(function (item, itemIdx) {
                        var content = null;
                        if (item.isCheckBox === true) {
                            content = (React.createElement(CheckBox, { key: itemIdx, theme: _this.props.checkBoxTheme, muiProps: { label: item.label }, dataKey: item.key, value: _this.state.selectedMenuItems[item.key], onChange: function (e, oldValue, newValue, dataKey) {
                                    _this.handleChange(e, oldValue, newValue, dataKey);
                                } }));
                        }
                        else if (item.isLink === true) {
                            var to = item.to;
                            if (item.to && typeof item.to === 'function') {
                                to = item.to();
                            }
                            content =
                                React.createElement(Link, { key: itemIdx, theme: _this.props.linkTheme, to: to, label: item.label });
                        }
                        else {
                            content = (React.createElement("span", { key: itemIdx, style: {
                                    cursor: 'pointer'
                                }, onClick: function (e) {
                                    _this.handleItemMenuClicked(e, item.key);
                                } }, item.label));
                        }
                        return content;
                    }))));
                if (sectionIdx < _this.props.menuSchema.length - 1) {
                    elements.push(React.createElement(ToolbarSeparator, { key: sectionIdx + '_seperator', style: {
                            top: '0px',
                            bottom: '0px',
                            height: 'initial',
                            left: '4px',
                            marginLeft: '14px',
                            width: '2px',
                            display: 'block',
                            backgroundColor: theme.brand.primary
                        } }));
                }
                return (elements);
            }))));
    };
    TableOverlay.defaultProps = {
        theme: null,
        muiProps: {},
        qflProps: {},
        title: null,
        infoText: null,
        primary: false,
        isCheckBox: false,
        menuItemClassName: null,
        checkBoxTheme: null,
        linkTheme: null
    };
    return TableOverlay;
}(React.Component));
exports.default = TableOverlay;

//# sourceMappingURL=TableOverlay.js.map
