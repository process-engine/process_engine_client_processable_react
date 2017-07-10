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
var Table_1 = require("../Table/Table");
var themeBuilder_js_1 = require("@process-engine-js/frontend_mui/dist/commonjs/themeBuilder.js");
var ProcessableCrudTable = (function (_super) {
    __extends(ProcessableCrudTable, _super);
    function ProcessableCrudTable(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            currentOffset: 0,
            currentFirst: props.pageSize,
            isFetching: true,
            hasLoadedMore: false,
            hasReloaded: false,
            hasLoaded: false,
            synced: false,
            entityCollection: []
        };
        return _this;
    }
    ProcessableCrudTable.prototype.componentDidMount = function () {
        var _this = this;
        this.props.fetcher({
            mode: 'load',
            offset: this.state.currentOffset,
            first: this.props.pageSize,
            query: JSON.stringify({
                operator: 'and',
                queries: (this.props.baseFilter
                    ? [
                        this.props.baseFilter()
                    ] : [])
            })
        }, function (e) {
            if (e.mounted && !e.done) {
                _this.setState({
                    isFetching: true,
                    hasLoaded: false,
                    synced: false
                });
            }
            else if (e.mounted && e.done) {
                _this.setState({
                    isFetching: false,
                    hasLoaded: true
                });
            }
        });
    };
    ProcessableCrudTable.prototype.getGlobalSearchFilter = function (searchValue, ignoreCase) {
        var searchFilter = this.props.columnSchema.filter(function (element) { return (element.searchable); }).map(function (element) {
            if (element.searchableType === 'float' || element.searchableType === 'integer') {
                var parsedSearchValue = (element.searchableType === 'float' ? parseFloat(searchValue) : parseInt(searchValue));
                if (isNaN(parsedSearchValue)) {
                    return null;
                }
                searchValue = parsedSearchValue;
                return {
                    attribute: element.thcProps.dataField,
                    type: 'number',
                    operator: '=',
                    value: searchValue
                };
            }
            return {
                attribute: element.thcProps.dataField,
                operator: 'contains',
                value: searchValue,
                ignoreCase: ignoreCase
            };
        }).filter(function (element) { return (element !== null && element !== undefined); });
        return searchFilter;
    };
    ProcessableCrudTable.prototype.initCollection = function (firstCall) {
        var _this = this;
        var newEntityCollection = (this.state.entityCollection || []);
        var entityCollection = this.props.entityCollection;
        if (entityCollection && entityCollection.edges) {
            newEntityCollection = entityCollection.edges.map(function (item) { return item.node; });
        }
        setTimeout(function () {
            _this.setState({
                entityCollection: newEntityCollection,
                synced: true
            });
        }, 0);
        return newEntityCollection;
    };
    ProcessableCrudTable.prototype.extendCollection = function () {
        var _this = this;
        var currentEntityCollection = (this.state.entityCollection || []);
        var newEntityCollection = currentEntityCollection;
        var entityCollection = this.props.entityCollection;
        if (entityCollection && entityCollection.edges) {
            newEntityCollection = currentEntityCollection.concat(entityCollection.edges.map(function (item) { return item.node; }));
        }
        setTimeout(function () {
            _this.setState({
                currentOffset: (_this.state.currentOffset + _this.props.pageSize),
                entityCollection: newEntityCollection,
                synced: true
            });
        }, 0);
        return newEntityCollection;
    };
    ProcessableCrudTable.prototype.prepareCollection = function () {
        if (!this.state.synced) {
            if (!this.state.isFetching) {
                if (this.state.hasLoaded && this.props.fetchingMode === 'load') {
                    return this.initCollection(true);
                }
                else if (this.state.hasReloaded && this.state.hasLoaded && this.props.fetchingMode === 'reload') {
                    return this.initCollection(false);
                }
                else if (this.state.hasLoadedMore && this.state.hasLoaded && this.props.fetchingMode === 'more') {
                    return this.extendCollection();
                }
                else {
                    return this.initCollection(true);
                }
            }
        }
        return (this.state.entityCollection || []);
    };
    ProcessableCrudTable.prototype.handleRowDoubleClick = function (row) {
        if (this.props.onRowDoubleClick) {
            this.props.onRowDoubleClick(row);
        }
    };
    ProcessableCrudTable.prototype.handleSearch = function (searchValue) {
        var _this = this;
        this.setState({
            currentOffset: 0
        }, function () {
            if (searchValue) {
                _this.props.fetcher({
                    mode: 'reload',
                    offset: _this.state.currentOffset,
                    first: _this.state.currentFirst,
                    query: JSON.stringify({
                        operator: 'and',
                        queries: (_this.props.baseFilter
                            ? [
                                _this.props.baseFilter(), {
                                    operator: 'or',
                                    queries: _this.getGlobalSearchFilter(searchValue, true)
                                }
                            ] : [
                            _this.getGlobalSearchFilter(searchValue, true)
                        ])
                    })
                }, function (e) {
                    if (e.mounted && !e.done) {
                        _this.setState({
                            synced: false,
                            isFetching: true,
                            hasReloaded: false
                        });
                    }
                    else if (e.mounted && e.done) {
                        _this.setState({
                            isFetching: false,
                            hasReloaded: true
                        });
                    }
                });
            }
            else {
                _this.props.fetcher({
                    mode: 'reload',
                    offset: _this.state.currentOffset,
                    first: _this.state.currentFirst,
                    query: JSON.stringify({
                        operator: 'and',
                        queries: (_this.props.baseFilter()
                            ? [
                                _this.props.baseFilter()
                            ] : [])
                    })
                }, function (e) {
                    if (e.mounted && !e.done) {
                        _this.setState({
                            synced: false,
                            isFetching: true,
                            hasReloaded: false
                        });
                    }
                    else if (e.mounted && e.done) {
                        _this.setState({
                            isFetching: false,
                            hasReloaded: true
                        });
                    }
                });
            }
        });
    };
    ProcessableCrudTable.prototype.handleSortChange = function (sortName, sortOrder) {
        var _this = this;
        if (sortName && sortOrder) {
            this.setState({
                currentOffset: 0
            }, function () {
                _this.props.fetcher({
                    mode: 'reload',
                    offset: _this.state.currentOffset,
                    first: _this.state.currentFirst,
                    orderBy: JSON.stringify({ attributes: [{ attribute: sortName, order: sortOrder }] })
                }, function (e) {
                    if (e.mounted && !e.done) {
                        _this.setState({
                            synced: false,
                            isFetching: true,
                            hasReloaded: false
                        });
                    }
                    else if (e.mounted && e.done) {
                        _this.setState({
                            isFetching: false,
                            hasReloaded: true
                        });
                    }
                });
            });
        }
    };
    ProcessableCrudTable.prototype.handleLoadMore = function () {
        var _this = this;
        var entityCollection = this.props.entityCollection;
        if (!this.state.isFetching && entityCollection && entityCollection.pageInfo && entityCollection.pageInfo.hasNextPage) {
            var currentOffset = this.state.currentOffset;
            var newOffset_1 = (currentOffset + this.props.pageSize);
            var newFirst = (this.props.pageSize + newOffset_1);
            this.setState({
                currentFirst: newFirst
            }, function () {
                _this.props.fetcher({
                    mode: 'more',
                    offset: newOffset_1
                }, function (e) {
                    if (e.mounted && !e.done) {
                        _this.setState({
                            synced: false,
                            isFetching: true,
                            hasLoadedMore: false
                        });
                    }
                    else if (e.mounted && e.done) {
                        _this.setState({
                            isFetching: false,
                            hasLoadedMore: true
                        });
                    }
                });
            });
        }
    };
    ProcessableCrudTable.prototype.cleanSelectedEntities = function () {
        var refs = this.refs;
        if (refs && refs.entitiesTable && refs.entitiesTable.cleanSelected) {
            refs.entitiesTable.cleanSelected();
        }
    };
    ProcessableCrudTable.prototype.handleCreateProcessEnded = function (processKey, data) {
        var _this = this;
        this.props.fetcher({
            mode: 'reload',
            offset: this.state.currentOffset
        }, function (e) {
            if (e.mounted && !e.done) {
                _this.setState({
                    synced: false,
                    isFetching: true,
                    hasReloaded: false
                });
            }
            else if (e.mounted && e.done) {
                _this.setState({
                    isFetching: false,
                    hasReloaded: true
                });
            }
        });
    };
    ProcessableCrudTable.prototype.handleItemProcessEnded = function (processKey, data) {
        var _this = this;
        this.props.fetcher({
            mode: 'reload',
            offset: this.state.currentOffset
        }, function (e) {
            if (e.mounted && !e.done) {
                _this.setState({
                    synced: false,
                    isFetching: true,
                    hasReloaded: false
                });
            }
            else if (e.mounted && e.done) {
                _this.setState({
                    isFetching: false,
                    hasReloaded: true
                }, function () {
                    if (processKey === ('Delete' + _this.props.entityTypeName)) {
                        _this.cleanSelectedEntities();
                    }
                });
            }
        });
    };
    ProcessableCrudTable.prototype.render = function () {
        var _this = this;
        var children = this.props.children;
        var _a = themeBuilder_js_1.buildTheme({
            theme: this.props.theme,
            sourceRbtProps: this.props.rbtProps,
            sourceQflProps: this.props.qflProps,
            componentName: 'Table'
        }), qflProps = _a.qflProps, rbtProps = _a.rbtProps;
        var tableElement = null;
        if (this.state.hasLoaded) {
            tableElement = (React.createElement(Table_1.default, { tableOverlayStyles: this.props.tableOverlayStyles, tableStyles: this.props.tableStyles, processEngineClientApi: this.props.processEngineClientApi, theme: this.props.theme, ref: 'entitiesTable', dataClassName: this.props.entityTypeName, frame: false, onSearch: function (searchValue) { return _this.handleSearch(searchValue); }, onCreateProcessEnded: function (processKey, data) { return _this.handleCreateProcessEnded(processKey, data); }, onItemProcessEnded: function (processKey, data) { return _this.handleItemProcessEnded(processKey, data); }, createProcessKey: 'Create', createStartToken: this.props.createStartToken, createButtonTheme: this.props.createButtonTheme, createDialogTheme: this.props.createDialogTheme, createFormItemTheme: this.props.createFormItemTheme, createConfirmTheme: this.props.createConfirmTheme, createWidgetTheme: this.props.createWidgetTheme, createTheme: this.props.createTheme, itemBasedButtonTheme: this.props.itemBasedButtonTheme, listBasedButtonTheme: this.props.listBasedButtonTheme, filterMenuTheme: this.props.filterMenuTheme, baseFilterMenuTheme: this.props.baseFilterMenuTheme, searchFieldTheme: this.props.searchFieldTheme, tableTheme: this.props.tableTheme, tableSelectorTheme: this.props.tableSelectorTheme, title: this.props.title, data: this.prepareCollection(), itemBasedButtonSchema: this.props.itemBasedButtonSchema, listBasedButtonSchema: this.props.listBasedButtonSchema, filterMenuSchema: this.props.filterMenuSchema, baseFilterMenuSchema: this.props.baseFilterMenuSchema, tableProps: __assign({ rbtProps: __assign({ remote: true, sortName: this.props.defaultSortName, sortOrder: this.props.defaultSortOrder, defaultSortName: this.props.defaultSortName, defaultSortOrder: this.props.defaultSortOrder, options: {
                            onRowDoubleClick: function (row) { return _this.handleRowDoubleClick(row); },
                            onSortChange: function (sortName, sortOrder) { return _this.handleSortChange(sortName, sortOrder); },
                            onLoadMore: function () { return _this.handleLoadMore(); }
                        } }, rbtProps), thcSchema: this.props.columnSchema }, qflProps) }));
        }
        return (React.createElement("div", null,
            tableElement,
            children));
    };
    ProcessableCrudTable.defaultProps = {
        rbtProps: null,
        entityCollection: [],
        processEngineClientApi: null,
        title: null,
        fetchingMode: 'initial',
        baseFilter: null,
        pageSize: 16,
        entityTypeName: 'Entity',
        defaultSortName: 'id',
        defaultSortOrder: 'asc',
        onRowDoubleClick: null,
        createStartToken: null,
        createButtonTheme: null,
        createDialogTheme: null,
        createFormItemTheme: null,
        createConfirmTheme: null,
        createWidgetTheme: null,
        createTheme: null,
        itemBasedButtonSchema: [],
        listBasedButtonSchema: [],
        filterMenuSchema: [],
        baseFilterMenuSchema: [],
        itemBasedButtonTheme: null,
        listBasedButtonTheme: null,
        filterMenuTheme: null,
        baseFilterMenuTheme: null,
        searchFieldTheme: null,
        columnSchema: [],
        tableOverlayStyles: null,
        tableStyles: null,
        theme: null,
        tableTheme: null,
        tableSelectorTheme: null
    };
    return ProcessableCrudTable;
}(React.Component));
exports.default = ProcessableCrudTable;

//# sourceMappingURL=CrudTable.js.map
