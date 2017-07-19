define(["require", "exports", "react", "@process-engine-js/frontend_mui/dist/commonjs/Buttons/Link/Link.js", "@process-engine-js/frontend_mui/dist/commonjs/Bars/ToolBar/ToolBar.js", "@process-engine-js/frontend_mui/dist/commonjs/InputForms/CheckBox/CheckBox.js", "@process-engine-js/frontend_mui/dist/commonjs/themeBuilder.js", "material-ui/Toolbar/index.js"], function (require, exports, React, Link_js_1, ToolBar_js_1, CheckBox_js_1, themeBuilder_js_1, index_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TableOverlay extends React.Component {
        constructor() {
            super();
            this.state = {
                selectedMenuItems: {}
            };
        }
        handleChange(e, oldValue, newValue, dataKey) {
            if (oldValue !== newValue) {
                const currentSelectedMenuItems = this.state.selectedMenuItems;
                if (newValue) {
                    currentSelectedMenuItems[dataKey] = true;
                }
                else {
                    delete currentSelectedMenuItems[dataKey];
                }
                this.setState({
                    selectedMenuItems: currentSelectedMenuItems
                }, () => {
                    if (this.props.onSelectedMenuItemsChange) {
                        this.props.onSelectedMenuItemsChange(currentSelectedMenuItems);
                    }
                });
            }
        }
        handleItemMenuClicked(e, dataKey) {
            if (this.props.onMenuItemClicked) {
                this.props.onMenuItemClicked(dataKey);
            }
        }
        render() {
            const { theme, qflProps, muiProps } = themeBuilder_js_1.buildTheme({
                theme: this.props.theme,
                sourceMuiProps: this.props.muiProps,
                sourceQflProps: this.props.qflProps,
                componentName: 'TableOverlay'
            });
            return (React.createElement("div", Object.assign({}, qflProps),
                React.createElement(ToolBar_js_1.default, { theme: this.props.theme, muiProps: muiProps }, this.props.menuSchema.map((section, sectionIdx) => {
                    const elements = [];
                    let menuHeaderElement = null;
                    if (section.sectionName) {
                        menuHeaderElement = (React.createElement("h1", { className: this.props.tableOverlayStyles.menuHeaderClassName }, section.sectionName));
                    }
                    elements.push(React.createElement(index_js_1.ToolbarGroup, { key: sectionIdx, firstChild: (sectionIdx === 0), style: {
                            marginLeft: (sectionIdx === 0 ? theme.distances.secondary : theme.distances.tertiary),
                            display: 'block'
                        } },
                        menuHeaderElement,
                        React.createElement("span", { className: this.props.menuItemClassName }, section.items.map((item, itemIdx) => {
                            let content = null;
                            if (item.isCheckBox === true) {
                                content = (React.createElement(CheckBox_js_1.default, { key: itemIdx, theme: this.props.checkBoxTheme, muiProps: { label: item.label }, dataKey: item.key, value: this.state.selectedMenuItems[item.key], onChange: (e, oldValue, newValue, dataKey) => {
                                        this.handleChange(e, oldValue, newValue, dataKey);
                                    } }));
                            }
                            else if (item.isLink === true) {
                                let to = item.to;
                                if (item.to && typeof item.to === 'function') {
                                    to = item.to();
                                }
                                content =
                                    React.createElement(Link_js_1.default, { key: itemIdx, theme: this.props.linkTheme, to: to, label: item.label });
                            }
                            else {
                                content = (React.createElement("span", { key: itemIdx, style: {
                                        cursor: 'pointer'
                                    }, onClick: (e) => {
                                        this.handleItemMenuClicked(e, item.key);
                                    } }, item.label));
                            }
                            return content;
                        }))));
                    if (sectionIdx < this.props.menuSchema.length - 1) {
                        elements.push(React.createElement(index_js_1.ToolbarSeparator, { key: sectionIdx + '_seperator', style: {
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
        }
    }
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
        linkTheme: null,
        onSelectedMenuItemsChange: null
    };
    exports.default = TableOverlay;
});

//# sourceMappingURL=TableOverlay.js.map
