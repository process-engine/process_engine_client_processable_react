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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var Table_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/Tables/Table/Table.js");
var RaisedButton_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js");
var TextField_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/TextField/TextField.js");
var ProcessableContainer_1 = require("../ProcessableContainer");
var DropDown_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/InputForms/DropDown/DropDown.js");
var MenuItem_js_1 = require("material-ui/MenuItem/MenuItem.js");
var expand_more_js_1 = require("material-ui/svg-icons/navigation/expand-more.js");
var TableOverlay_1 = require("./TableOverlay");
var $ = require('jquery'); // tslint:disable-line no-var-requires
var ProcessableTable = (function (_super) {
    __extends(ProcessableTable, _super);
    function ProcessableTable(props) {
        var _this = _super.call(this, props) || this;
        _this.delay = (function () {
            var timer = null;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        _this.itemBasedMoreMenuId = 'itemBasedMoreMenu';
        _this.state = {
            isItemBasedMoreMenuOpened: false,
            selectedRows: {},
            searchValue: props.searchValue,
            createOnProcessEnded: null,
            createProcessInstance: null,
            createProcessableContainer: null,
            currentItemProcessKey: null,
            currentItemOnProcessEnded: null,
            itemProcessInstance: null,
            itemProcessableContainer: null
        };
        return _this;
    }
    ProcessableTable.prototype.renderProcessContainer = function (processKey) {
        switch (processKey) {
            case (this.props.createProcessKey + this.props.dataClassName):
                var createProcessableContainer = (React.createElement(ProcessableContainer_1.default, { modal: true, key: this.state.createProcessInstance.nextTaskEntity.id, processInstance: this.state.createProcessInstance }));
                this.setState({
                    createProcessableContainer: createProcessableContainer
                });
                break;
            case (this.state.currentItemProcessKey):
                var itemProcessableContainer = (React.createElement(ProcessableContainer_1.default, { modal: true, key: this.state.itemProcessInstance.nextTaskEntity.id, processInstance: this.state.itemProcessInstance }));
                this.setState({
                    itemProcessableContainer: itemProcessableContainer
                });
                break;
            default:
        }
    };
    ;
    ProcessableTable.prototype.handleUserTask = function (processKey, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.renderProcessContainer(processKey);
                return [2 /*return*/];
            });
        });
    };
    ;
    ProcessableTable.prototype.handleManualTask = function (processKey, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ;
    ProcessableTable.prototype.handleEndEvent = function (processKey, message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (processKey) {
                    case (this.props.createProcessKey + this.props.dataClassName):
                        this.setState({
                            createProcessInstance: null,
                            createProcessableContainer: null
                        }, function () {
                            if (_this.state.createOnProcessEnded) {
                                _this.state.createOnProcessEnded();
                            }
                        });
                        break;
                    case (this.state.currentItemProcessKey):
                        this.setState({
                            itemProcessInstance: null,
                            itemProcessableContainer: null
                        }, function () {
                            if (_this.state.currentItemOnProcessEnded) {
                                _this.state.currentItemOnProcessEnded(_this.state.currentItemProcessKey, message);
                            }
                            if (_this.props.onItemProcessEnded) {
                                _this.props.onItemProcessEnded(_this.state.currentItemProcessKey, message);
                            }
                        });
                        break;
                    default:
                }
                return [2 /*return*/];
            });
        });
    };
    ;
    ProcessableTable.prototype.handleStartCreate = function (startToken, onProcessEnded, done) {
        return __awaiter(this, void 0, void 0, function () {
            var createProcessInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.props.processEngineClientApi) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.props.processEngineClientApi.startProcess((this.props.createProcessKey + this.props.dataClassName), this, startToken, this.props.context)];
                    case 1:
                        createProcessInstance = _a.sent();
                        if (done) {
                            done();
                        }
                        this.setState({
                            createOnProcessEnded: onProcessEnded,
                            createProcessInstance: createProcessInstance
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ProcessableTable.prototype.handleStartItem = function (processKey, startToken, onProcessEnded, done) {
        return __awaiter(this, void 0, void 0, function () {
            var itemProcessInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.props.processEngineClientApi) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.props.processEngineClientApi.startProcess(processKey, this, startToken, this.props.context)];
                    case 1:
                        itemProcessInstance = _a.sent();
                        if (done) {
                            done();
                        }
                        this.setState({
                            currentItemOnProcessEnded: onProcessEnded,
                            currentItemProcessKey: processKey,
                            itemProcessInstance: itemProcessInstance
                        });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ProcessableTable.prototype.handleItemClicked = function (item) {
        var _this = this;
        this.setState({
            isItemBasedMoreMenuOpened: false
        });
        var selectedItems = [];
        if (this.state.selectedRows) {
            Object.keys(this.state.selectedRows).forEach(function (key) {
                selectedItems.push(_this.state.selectedRows[key]);
            });
        }
        if (selectedItems && selectedItems.length > 0 && item && item.processableKey) {
            var startToken = null;
            if (selectedItems.length === 1) {
                startToken = { id: selectedItems[0].id };
                if (item.startTokenTransformer) {
                    startToken = item.startTokenTransformer(startToken, selectedItems[0]);
                }
            }
            else {
                startToken = selectedItems.map(function (selectedItem) {
                    var resultToken = { id: selectedItem.id };
                    if (item.startTokenTransformer) {
                        resultToken = item.startTokenTransformer(resultToken, selectedItem);
                    }
                    return resultToken;
                });
            }
            this.handleStartItem(item.processableKey, startToken, item.onProcessEnded);
        }
    };
    ProcessableTable.prototype.handleSelectedRowsChanged = function (selectedRows) {
        this.setState({
            selectedRows: selectedRows
        });
    };
    ProcessableTable.prototype.cleanSelected = function () {
        var refs = this.refs;
        if (refs && refs.listBoxTable && refs.listBoxTable.cleanSelected) {
            refs.listBoxTable.cleanSelected();
        }
    };
    ProcessableTable.prototype.handleFilterItemChange = function (key, oldValue, newValue, choosenElement, element) {
        if (this.props.onFilterChange) {
            this.props.onFilterChange(key, newValue, choosenElement, element);
        }
    };
    ProcessableTable.prototype.render = function () {
        var _this = this;
        var newClassName = null;
        if (this.props.frame === true) {
            newClassName = this.props.tableStyles.tableWithFrameClassName;
        }
        else {
            newClassName = this.props.tableStyles.tableWithoutFrameClassName;
        }
        var rbtProps = (this.props.tableProps || {}).rbtProps;
        if (this.props.tableProps) {
            delete this.props.tableProps.rbtProps;
        }
        var processables = [];
        var createButton = null;
        if (this.props.createProcessKey) {
            createButton = (React.createElement(RaisedButton_js_1.default, __assign({ theme: this.props.createButtonTheme, muiProps: __assign({ label: '+', primary: true, className: this.props.tableStyles.createButtonClassName, style: {
                        borderRadius: '0px'
                    }, onClick: function (e) {
                        _this.handleStartCreate(_this.props.createStartToken, _this.props.onCreateProcessEnded);
                    } }, this.props.createButtonMuiProps), qflProps: __assign({ style: {
                        paddingTop: '9px',
                        width: 'auto',
                        display: 'inline-block',
                        top: '-14px',
                        position: 'relative'
                    } }, this.props.createButtonQflProps) }, this.props.createButtonProps)));
            var createProcessContainer = this.state.createProcessableContainer;
            processables.push(createProcessContainer);
        }
        var filterMenuElements = [];
        if (this.props.filterMenuSchema && this.props.filterMenuSchema.length > 0) {
            filterMenuElements = this.props.filterMenuSchema.map(function (filterMenuSchemaItem) { return (React.createElement(DropDown_js_1.default, { key: filterMenuSchemaItem.key, theme: filterMenuSchemaItem.theme, value: filterMenuSchemaItem.currentValue, items: filterMenuSchemaItem.items.map(function (dropDownItem, dropDownItemIdx) { return React.createElement(MenuItem_js_1.default, { key: filterMenuSchemaItem.key + '-' + dropDownItemIdx, value: dropDownItem.value, primaryText: dropDownItem.label }); }), muiProps: __assign({ floatingLabelText: filterMenuSchemaItem.label }, filterMenuSchemaItem.muiProps), onChange: function (event, index, oldValue, newValue) { return _this.handleFilterItemChange(filterMenuSchemaItem.key, oldValue, newValue, filterMenuSchemaItem.items[index], filterMenuSchemaItem); }, qflProps: __assign({ style: {
                        paddingTop: _this.props.theme.distances.primary,
                        display: 'inline-block',
                        width: '150px',
                        marginLeft: _this.props.theme.distances.primary
                    } }, filterMenuSchemaItem.qflProps) })); });
        }
        var itemBasedElements = [];
        if (Object.keys(this.state.selectedRows).length > 0) {
            if (this.props.itemBasedButtonSchema && this.props.itemBasedButtonSchema.length > 0) {
                itemBasedElements = itemBasedElements.concat(this.props.itemBasedButtonSchema.filter(function (buttonSchemaItem) {
                    if (!buttonSchemaItem.multiple && Object.keys(_this.state.selectedRows).length > 1) {
                        return false;
                    }
                    return !buttonSchemaItem.isMore;
                }).map(function (buttonSchemaItem, buttonSchemaIdx) {
                    var itemBasedButtonProcessContainer = _this.state.itemProcessableContainer;
                    processables.push(itemBasedButtonProcessContainer);
                    return (React.createElement(RaisedButton_js_1.default, __assign({ theme: _this.props.itemBasedButtonTheme, muiProps: __assign({ icon: buttonSchemaItem.icon, primary: true, className: _this.props.tableStyles.itemBasedButtonClassName, style: {
                                borderRadius: '0px'
                            }, onClick: function (e) {
                                _this.handleItemClicked.bind(_this, buttonSchemaItem)();
                            } }, _this.props.itemBasedButtonMuiProps), qflProps: __assign({ style: {
                                paddingTop: _this.props.theme.distances.primary,
                                width: 'auto',
                                display: 'inline-block',
                                position: 'relative',
                                top: '-2px',
                                marginLeft: _this.props.theme.distances.halfPrimary
                            } }, _this.props.itemBasedButtonQflProps) }, _this.props.itemBasedButtonProps)));
                }));
                var itemBasedMoreButtons_1 = this.props.itemBasedButtonSchema.filter(function (buttonSchemaItem) {
                    if (!buttonSchemaItem.multiple && Object.keys(_this.state.selectedRows).length > 1) {
                        return false;
                    }
                    return buttonSchemaItem.isMore;
                });
                if (itemBasedMoreButtons_1.length > 0) {
                    var menuSchema = [{
                            sectionName: null,
                            items: itemBasedMoreButtons_1.map(function (buttonSchemaItem) {
                                var itemBasedButtonProcessContainer = _this.state.itemProcessableContainer;
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
                            React.createElement(RaisedButton_js_1.default, __assign({ theme: this.props.itemBasedButtonTheme, muiProps: __assign({ icon: React.createElement(expand_more_js_1.default, null), labelPosition: 'before', label: 'MEHR', primary: true, className: this.props.tableStyles.itemBasedMoreButtonClassName, style: {
                                        borderRadius: '0px'
                                    }, onClick: function (e) {
                                        if (!_this.state.isItemBasedMoreMenuOpened) {
                                            $(window.document).on('click', function (ce) {
                                                if (ce.originalEvent && ce.originalEvent.path.filter(function (item) { return item.id === _this.itemBasedMoreMenuId; }).length === 0) {
                                                    $(window.document).off('click');
                                                    _this.setState({
                                                        isItemBasedMoreMenuOpened: false
                                                    });
                                                }
                                            });
                                        }
                                        _this.setState({
                                            isItemBasedMoreMenuOpened: !_this.state.isItemBasedMoreMenuOpened
                                        });
                                    } }, this.props.itemBasedMoreButtonMuiProps), qflProps: __assign({ style: {
                                        paddingTop: this.props.theme.distances.primary,
                                        width: 'auto',
                                        display: 'inline-block',
                                        marginLeft: this.props.theme.distances.halfPrimary
                                    } }, this.props.itemBasedMoreButtonQflProps) }, this.props.itemBasedMoreButtonProps)),
                            React.createElement("div", { id: this.itemBasedMoreMenuId, style: {
                                    display: (this.state.isItemBasedMoreMenuOpened ? 'block' : 'none'),
                                    position: 'absolute',
                                    zIndex: '10',
                                    whiteSpace: 'nowrap',
                                    color: 'black',
                                    backgroundColor: 'white',
                                    padding: this.props.theme.distances.halfPrimary,
                                    marginLeft: this.props.theme.distances.halfPrimary
                                } },
                                React.createElement(TableOverlay_1.default, { menuSchema: menuSchema, tableOverlayStyles: this.props.tableOverlayStyles, onMenuItemClicked: function (key) {
                                        var matchedButtonSchemaItems = itemBasedMoreButtons_1.filter(function (buttonSchemaItem) { return (buttonSchemaItem.key === key); });
                                        var buttonSchemaItem = null;
                                        if (matchedButtonSchemaItems.length === 1) {
                                            buttonSchemaItem = matchedButtonSchemaItems[0];
                                        }
                                        if (buttonSchemaItem) {
                                            _this.handleItemClicked.bind(_this, buttonSchemaItem)();
                                        }
                                    } })))
                    ]);
                }
            }
        }
        var searchField = null;
        if (this.props.onSearch) {
            searchField = (React.createElement(TextField_js_1.default, __assign({ watch: true, value: this.state.searchValue, theme: this.props.searchFieldTheme, muiProps: __assign({ hintText: 'Suchen', className: this.props.tableStyles.searchFieldClassName }, this.props.searchFieldMuiProps), qflProps: __assign({ style: {
                        paddingTop: '9px',
                        display: 'inline-block',
                        position: 'relative',
                        top: '-13px'
                    } }, this.props.searchFieldQflProps) }, this.props.searchFieldProps, { onChange: function (oldValue, newValue, e) {
                    if (_this.props.onSearch) {
                        _this.delay(function () {
                            _this.props.onSearch(newValue);
                        }, (e && e.keyCode === 13 ? 0 : _this.props.searchKeyDelay));
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
            React.createElement(Table_js_1.default, __assign({ ref: 'listBoxTable', theme: this.props.tableTheme, selectorTheme: this.props.tableSelectorTheme, onSelectedRowsChanged: function (selectedRows) {
                    _this.handleSelectedRowsChanged(selectedRows);
                } }, this.props.tableProps, { rbtProps: __assign({ data: this.props.data, columnFilter: false, search: false, striped: true, hover: true, condensed: true, pagination: false, insertRow: false, deleteRow: false, trClassName: this.props.tableStyles.tableRowClassName, tableHeaderClass: this.props.tableStyles.tableHeaderRowClassName, selectRowTdClassName: this.props.tableStyles.tableColumnSelectorClassName, selectRowHeaderTdClassName: this.props.tableStyles.tableHeaderColumnSelectorClassName }, rbtProps), stylingProps: {
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
    };
    ProcessableTable.defaultProps = {
        theme: null,
        muiProps: {},
        qflProps: {},
        processEngineClientApi: null,
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
            rbtProps: null
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
    return ProcessableTable;
}(React.Component));
exports.default = ProcessableTable;

//# sourceMappingURL=Table.js.map
