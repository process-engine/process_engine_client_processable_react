"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Table_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/Tables/Table/Table.js");
const RaisedButton_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js");
const TextField_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/TextField/TextField.js");
const ProcessableContainer_1 = require("../ProcessableContainer");
const DropDown_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/DropDown/DropDown.js");
const MenuItem_js_1 = require("material-ui/MenuItem/MenuItem.js");
const expand_more_js_1 = require("material-ui/svg-icons/navigation/expand-more.js");
const TableOverlay_1 = require("./TableOverlay");
const $ = require('jquery'); // tslint:disable-line no-var-requires
class ProcessableTable extends React.Component {
    constructor(props) {
        super(props);
        this.delay = (() => {
            let timer = null;
            return (callback, ms) => {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        this.itemBasedMoreMenuId = 'itemBasedMoreMenu';
        this.state = {
            isItemBasedMoreMenuOpened: false,
            selectedRows: {},
            searchValue: props.searchValue,
            createOnProcessEnded: null,
            createProcessableContainer: null,
            currentItemProcessKey: null,
            currentItemOnProcessEnded: null,
            itemProcessableContainer: null
        };
    }
    renderProcessContainer(processInstance, uiName, uiConfig, uiData) {
        switch (processInstance.processKey) {
            case (this.props.createProcessKey + this.props.dataClassName):
                const createProcessableContainer = (React.createElement(ProcessableContainer_1.default, { modal: true, key: processInstance.nextTaskEntity.id, processInstance: processInstance, executionContext: this.props.executionContext, uiName: uiName, uiConfig: uiConfig, uiData: uiData }));
                this.setState({
                    createProcessableContainer
                });
                break;
            case (this.state.currentItemProcessKey):
                const itemProcessableContainer = (React.createElement(ProcessableContainer_1.default, { modal: true, key: processInstance.nextTaskEntity.id, processInstance: processInstance, executionContext: this.props.executionContext, uiName: uiName, uiConfig: uiConfig, uiData: uiData }));
                this.setState({
                    itemProcessableContainer
                });
                break;
            default:
        }
    }
    ;
    handleUserTask(processInstance, uiName, uiConfig, uiData) {
        return __awaiter(this, void 0, void 0, function* () {
            this.renderProcessContainer(processInstance, uiName, uiConfig, uiData);
        });
    }
    ;
    handleManualTask(processInstance, uiName, uiConfig, uiData) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    ;
    handleEndEvent(processInstance, endEventData) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (processInstance.processKey) {
                case (this.props.createProcessKey + this.props.dataClassName):
                    this.setState({
                        createProcessableContainer: null
                    }, () => {
                        if (this.state.createOnProcessEnded) {
                            this.state.createOnProcessEnded();
                        }
                    });
                    break;
                case (this.state.currentItemProcessKey):
                    this.setState({
                        itemProcessableContainer: null
                    }, () => {
                        if (this.state.currentItemOnProcessEnded) {
                            this.state.currentItemOnProcessEnded(this.state.currentItemProcessKey, endEventData);
                        }
                        if (this.props.onItemProcessEnded) {
                            this.props.onItemProcessEnded(this.state.currentItemProcessKey, endEventData);
                        }
                    });
                    break;
                default:
            }
        });
    }
    ;
    handleStartCreate(startToken, onProcessEnded, done) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.processEngineClientApi) {
                yield this.props.processEngineClientApi.startProcess((this.props.createProcessKey + this.props.dataClassName), this, this.props.executionContext, startToken);
                if (done) {
                    done();
                }
                this.setState({
                    createOnProcessEnded: onProcessEnded
                });
            }
        });
    }
    handleStartItem(processKey, startToken, onProcessEnded, done) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.processEngineClientApi) {
                yield this.props.processEngineClientApi.startProcess(processKey, this, this.props.executionContext, startToken);
                if (done) {
                    done();
                }
                this.setState({
                    currentItemOnProcessEnded: onProcessEnded,
                    currentItemProcessKey: processKey
                });
            }
        });
    }
    handleItemClicked(item) {
        this.setState({
            isItemBasedMoreMenuOpened: false
        });
        const selectedItems = [];
        if (this.state.selectedRows) {
            Object.keys(this.state.selectedRows).forEach((key) => {
                selectedItems.push(this.state.selectedRows[key]);
            });
        }
        if (selectedItems && selectedItems.length > 0 && item && item.processableKey) {
            let startToken = null;
            if (selectedItems.length === 1) {
                startToken = { id: selectedItems[0].id };
                if (item.startTokenTransformer) {
                    startToken = item.startTokenTransformer(startToken, selectedItems[0]);
                }
            }
            else {
                startToken = selectedItems.map((selectedItem) => {
                    let resultToken = { id: selectedItem.id };
                    if (item.startTokenTransformer) {
                        resultToken = item.startTokenTransformer(resultToken, selectedItem);
                    }
                    return resultToken;
                });
            }
            this.handleStartItem(item.processableKey, startToken, item.onProcessEnded);
        }
    }
    handleSelectedRowsChanged(selectedRows) {
        this.setState({
            selectedRows
        });
    }
    cleanSelected() {
        const refs = this.refs;
        if (refs && refs.listBoxTable && refs.listBoxTable.cleanSelected) {
            refs.listBoxTable.cleanSelected();
        }
    }
    handleFilterItemChange(key, oldValue, newValue, choosenElement, element) {
        if (this.props.onFilterChange) {
            this.props.onFilterChange(key, newValue, choosenElement, element);
        }
    }
    render() {
        let newClassName = null;
        if (this.props.frame === true) {
            newClassName = this.props.tableStyles.tableWithFrameClassName;
        }
        else {
            newClassName = this.props.tableStyles.tableWithoutFrameClassName;
        }
        const { rbtProps } = (this.props.tableProps || { rbtProps: {} });
        if (this.props.tableProps) {
            delete this.props.tableProps.rbtProps;
        }
        const processables = [];
        let createButton = null;
        if (this.props.createProcessKey) {
            createButton = (React.createElement(RaisedButton_js_1.default, Object.assign({ theme: this.props.createButtonTheme, muiProps: Object.assign({ label: '+', primary: true, className: this.props.tableStyles.createButtonClassName, style: {
                        borderRadius: '0px'
                    }, onClick: (e) => {
                        this.handleStartCreate(this.props.createStartToken, this.props.onCreateProcessEnded);
                    } }, this.props.createButtonMuiProps), qflProps: Object.assign({ style: {
                        paddingTop: '9px',
                        width: 'auto',
                        display: 'inline-block',
                        top: '-14px',
                        position: 'relative'
                    } }, this.props.createButtonQflProps) }, this.props.createButtonProps)));
            let createProcessContainer = this.state.createProcessableContainer;
            processables.push(createProcessContainer);
        }
        let filterMenuElements = [];
        if (this.props.filterMenuSchema && this.props.filterMenuSchema.length > 0) {
            filterMenuElements = this.props.filterMenuSchema.map((filterMenuSchemaItem) => (React.createElement(DropDown_js_1.default, { key: filterMenuSchemaItem.key, theme: filterMenuSchemaItem.theme, value: filterMenuSchemaItem.currentValue, items: filterMenuSchemaItem.items.map((dropDownItem, dropDownItemIdx) => React.createElement(MenuItem_js_1.default, { key: filterMenuSchemaItem.key + '-' + dropDownItemIdx, value: dropDownItem.value, primaryText: dropDownItem.label })), muiProps: Object.assign({ floatingLabelText: filterMenuSchemaItem.label }, filterMenuSchemaItem.muiProps), onChange: (event, index, oldValue, newValue) => this.handleFilterItemChange(filterMenuSchemaItem.key, oldValue, newValue, filterMenuSchemaItem.items[index], filterMenuSchemaItem), qflProps: Object.assign({ style: {
                        paddingTop: this.props.theme.distances.primary,
                        display: 'inline-block',
                        width: '150px',
                        marginLeft: this.props.theme.distances.primary
                    } }, filterMenuSchemaItem.qflProps) })));
        }
        let itemBasedElements = [];
        if (Object.keys(this.state.selectedRows).length > 0) {
            if (this.props.itemBasedButtonSchema && this.props.itemBasedButtonSchema.length > 0) {
                itemBasedElements = itemBasedElements.concat(this.props.itemBasedButtonSchema.filter((buttonSchemaItem) => {
                    if (!buttonSchemaItem.multiple && Object.keys(this.state.selectedRows).length > 1) {
                        return false;
                    }
                    return !buttonSchemaItem.isMore;
                }).map((buttonSchemaItem, buttonSchemaIdx) => {
                    let itemBasedButtonProcessContainer = this.state.itemProcessableContainer;
                    processables.push(itemBasedButtonProcessContainer);
                    return (React.createElement(RaisedButton_js_1.default, Object.assign({ theme: this.props.itemBasedButtonTheme, muiProps: Object.assign({ icon: buttonSchemaItem.icon, primary: true, className: this.props.tableStyles.itemBasedButtonClassName, style: {
                                borderRadius: '0px'
                            }, onClick: (e) => {
                                this.handleItemClicked.bind(this, buttonSchemaItem)();
                            } }, this.props.itemBasedButtonMuiProps), qflProps: Object.assign({ style: {
                                paddingTop: this.props.theme.distances.primary,
                                width: 'auto',
                                display: 'inline-block',
                                position: 'relative',
                                top: '-2px',
                                marginLeft: this.props.theme.distances.halfPrimary
                            } }, this.props.itemBasedButtonQflProps) }, this.props.itemBasedButtonProps)));
                }));
                const itemBasedMoreButtons = this.props.itemBasedButtonSchema.filter((buttonSchemaItem) => {
                    if (!buttonSchemaItem.multiple && Object.keys(this.state.selectedRows).length > 1) {
                        return false;
                    }
                    return buttonSchemaItem.isMore;
                });
                if (itemBasedMoreButtons.length > 0) {
                    const menuSchema = [{
                            sectionName: null,
                            items: itemBasedMoreButtons.map((buttonSchemaItem) => {
                                let itemBasedButtonProcessContainer = this.state.itemProcessableContainer;
                                processables.push(itemBasedButtonProcessContainer);
                                return {
                                    label: buttonSchemaItem.name,
                                    key: buttonSchemaItem.key
                                };
                            })
                        }];
                    itemBasedElements = itemBasedElements.concat([
                        React.createElement("div", { style: {
                                position: 'relative',
                                display: 'inline-block'
                            } },
                            React.createElement(RaisedButton_js_1.default, Object.assign({ theme: this.props.itemBasedButtonTheme, muiProps: Object.assign({ icon: React.createElement(expand_more_js_1.default, null), labelPosition: 'before', label: 'MEHR', primary: true, className: this.props.tableStyles.itemBasedMoreButtonClassName, style: {
                                        borderRadius: '0px'
                                    }, onClick: (e) => {
                                        if (!this.state.isItemBasedMoreMenuOpened) {
                                            $(window.document).on('click', (ce) => {
                                                if (ce.originalEvent && ce.originalEvent.path.filter((item) => item.id === this.itemBasedMoreMenuId).length === 0) {
                                                    $(window.document).off('click');
                                                    this.setState({
                                                        isItemBasedMoreMenuOpened: false
                                                    });
                                                }
                                            });
                                        }
                                        this.setState({
                                            isItemBasedMoreMenuOpened: !this.state.isItemBasedMoreMenuOpened
                                        });
                                    } }, this.props.itemBasedMoreButtonMuiProps), qflProps: Object.assign({ style: {
                                        paddingTop: this.props.theme.distances.primary,
                                        width: 'auto',
                                        display: 'inline-block',
                                        marginLeft: this.props.theme.distances.halfPrimary
                                    } }, this.props.itemBasedMoreButtonQflProps) }, this.props.itemBasedMoreButtonProps)),
                            React.createElement("div", { id: this.itemBasedMoreMenuId, style: {
                                    display: (this.state.isItemBasedMoreMenuOpened ? 'block' : 'none'),
                                    position: 'absolute',
                                    zIndex: 10,
                                    whiteSpace: 'nowrap',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    padding: this.props.theme.distances.halfPrimary,
                                    marginLeft: this.props.theme.distances.halfPrimary
                                } },
                                React.createElement(TableOverlay_1.default, { menuSchema: menuSchema, tableOverlayStyles: this.props.tableOverlayStyles, onMenuItemClicked: (key) => {
                                        const matchedButtonSchemaItems = itemBasedMoreButtons.filter((buttonSchemaItem) => (buttonSchemaItem.key === key));
                                        let buttonSchemaItem = null;
                                        if (matchedButtonSchemaItems.length === 1) {
                                            buttonSchemaItem = matchedButtonSchemaItems[0];
                                        }
                                        if (buttonSchemaItem) {
                                            this.handleItemClicked.bind(this, buttonSchemaItem)();
                                        }
                                    } })))
                    ]);
                }
            }
        }
        let searchField = null;
        if (this.props.onSearch) {
            searchField = (React.createElement(TextField_js_1.default, Object.assign({ watch: true, value: this.state.searchValue, theme: this.props.searchFieldTheme, muiProps: Object.assign({ hintText: 'Suchen', className: this.props.tableStyles.searchFieldClassName }, this.props.searchFieldMuiProps), qflProps: Object.assign({ style: {
                        paddingTop: '9px',
                        display: 'inline-block',
                        position: 'relative',
                        top: '-13px'
                    } }, this.props.searchFieldQflProps) }, this.props.searchFieldProps, { onChange: (oldValue, newValue, e) => {
                    if (this.props.onSearch) {
                        this.delay(() => {
                            this.props.onSearch(newValue);
                        }, (e && e.keyCode === 13 ? 0 : this.props.searchKeyDelay));
                    }
                } })));
        }
        return (React.createElement("div", { className: newClassName, style: {
                padding: '0px',
                verticalAlign: 'top',
                lineHeight: 1.2,
                position: 'relative'
            } },
            React.createElement("div", { className: this.props.tableStyles.itemHeaderClassName }, this.props.title),
            React.createElement("div", { style: {
                    paddingTop: '9px'
                }, className: this.props.tableStyles.tableBarClassName },
                createButton,
                searchField,
                React.createElement("div", { style: {
                        display: 'inline-block',
                        width: 'auto',
                        position: 'relative',
                        top: '-12px'
                    } }, filterMenuElements),
                React.createElement("div", { style: {
                        position: 'relative',
                        display: 'inline-block',
                        marginLeft: this.props.theme.distances.halfPrimary,
                        top: '-12px'
                    } }, itemBasedElements)),
            React.createElement("div", { style: {
                    display: (this.state.isItemBasedMoreMenuOpened ? 'block' : 'none')
                }, className: this.props.tableStyles.contentOverlayClassName }),
            React.createElement(Table_js_1.default, Object.assign({ ref: 'listBoxTable', theme: this.props.tableTheme, selectorTheme: this.props.tableSelectorTheme, onSelectedRowsChanged: (selectedRows) => {
                    this.handleSelectedRowsChanged(selectedRows);
                } }, this.props.tableProps, { rbtProps: Object.assign({ data: this.props.data, columnFilter: false, search: false, striped: true, hover: true, condensed: true, pagination: false, insertRow: false, deleteRow: false, trClassName: this.props.tableStyles.tableRowClassName, tableHeaderClass: this.props.tableStyles.tableHeaderRowClassName, selectRowTdClassName: this.props.tableStyles.tableColumnSelectorClassName, selectRowHeaderTdClassName: this.props.tableStyles.tableHeaderColumnSelectorClassName }, rbtProps), stylingProps: {
                    containerStyle: {
                        height: this.props.controlledHeight + 'px'
                    },
                    tableStyle: {
                        height: (this.props.controlledHeight - 10) + 'px'
                    },
                    headerStyle: {
                        height: '35px'
                    },
                    bodyStyle: {
                        height: (this.props.controlledHeight - 10 - 35) + 'px'
                    }
                } })),
            this.props.children,
            processables));
    }
}
ProcessableTable.defaultProps = {
    theme: null,
    muiProps: {},
    qflProps: {},
    title: null,
    frame: true,
    searchKeyDelay: 250,
    tableStyles: {
        tableWithFrameClassName: null,
        tableWithoutFrameClassName: null,
        createButtonClassName: null,
        contentOverlayClassName: null,
        tableBarClassName: null,
        itemHeaderClassName: null,
        searchFieldClassName: null,
        itemBasedMoreButtonClassName: null,
        itemBasedButtonClassName: null,
        tableRowClassName: null,
        tableHeaderRowClassName: null,
        tableColumnSelectorClassName: null,
        tableHeaderColumnSelectorClassName: null
    },
    tableOverlayStyles: {
        menuHeaderClassName: null,
        menuItemClassName: null
    },
    createProcessKey: null,
    createStartToken: null,
    createButtonMuiProps: null,
    createButtonQflProps: null,
    createButtonProps: null,
    createButtonTheme: null,
    createDialogTheme: null,
    createFormItemTheme: null,
    createConfirmTheme: null,
    createWidgetTheme: null,
    createTheme: null,
    itemBasedButtonTheme: null,
    listBasedButtonTheme: null,
    filterMenuTheme: null,
    baseFilterMenuTheme: null,
    searchFieldTheme: null,
    onSearch: null,
    searchFieldMuiProps: null,
    searchFieldQflProps: null,
    searchFieldProps: null,
    searchValue: null,
    tableProps: {
        rbtProps: {}
    },
    data: null,
    controlledHeight: null,
    itemBasedButtonSchema: null,
    itemBasedButtonMuiProps: null,
    itemBasedButtonQflProps: null,
    itemBasedButtonProps: null,
    itemBasedMoreButtonMuiProps: null,
    itemBasedMoreButtonQflProps: null,
    itemBasedMoreButtonProps: null,
    listBasedButtonSchema: null,
    filterMenuSchema: null,
    onFilterChange: null,
    baseFilterMenuSchema: null,
    onCreateProcessEnded: null,
    onItemProcessEnded: null,
    tableTheme: null,
    tableSelectorTheme: null
};
exports.default = ProcessableTable;

//# sourceMappingURL=Table.js.map
