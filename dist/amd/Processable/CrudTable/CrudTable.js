define(["require", "exports", "react", "../Table/Table", "@process-engine-js/frontend_mui/dist/commonjs/themeBuilder.js"], function (require, exports, React, Table_1, themeBuilder_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ProcessableCrudTable extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                currentOffset: 0,
                currentFirst: props.pageSize,
                isFetching: true,
                hasLoadedMore: false,
                hasReloaded: false,
                hasLoaded: false,
                synced: false,
                entityCollection: []
            };
        }
        componentDidMount() {
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
            }, (e) => {
                if (e.mounted && !e.done) {
                    this.setState({
                        isFetching: true,
                        hasLoaded: false,
                        synced: false
                    });
                }
                else if (e.mounted && e.done) {
                    this.setState({
                        isFetching: false,
                        hasLoaded: true
                    });
                }
            });
        }
        getGlobalSearchFilter(searchValue, ignoreCase) {
            const searchFilter = this.props.columnSchema.filter((element) => (element.searchable)).map((element) => {
                if (element.searchableType === 'float' || element.searchableType === 'integer') {
                    const parsedSearchValue = (element.searchableType === 'float' ? parseFloat(searchValue) : parseInt(searchValue));
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
                    ignoreCase
                };
            }).filter((element) => (element !== null && element !== undefined));
            return searchFilter;
        }
        initCollection(firstCall) {
            let newEntityCollection = (this.state.entityCollection || []);
            const { entityCollection } = this.props;
            if (entityCollection && entityCollection.edges) {
                newEntityCollection = entityCollection.edges.map((item) => item.node);
            }
            setTimeout(() => {
                this.setState({
                    entityCollection: newEntityCollection,
                    synced: true
                });
            }, 0);
            return newEntityCollection;
        }
        extendCollection() {
            const currentEntityCollection = (this.state.entityCollection || []);
            let newEntityCollection = currentEntityCollection;
            const { entityCollection } = this.props;
            if (entityCollection && entityCollection.edges) {
                newEntityCollection = currentEntityCollection.concat(entityCollection.edges.map((item) => item.node));
            }
            setTimeout(() => {
                this.setState({
                    currentOffset: (this.state.currentOffset + this.props.pageSize),
                    entityCollection: newEntityCollection,
                    synced: true
                });
            }, 0);
            return newEntityCollection;
        }
        prepareCollection() {
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
        }
        handleRowDoubleClick(row) {
            if (this.props.onRowDoubleClick) {
                this.props.onRowDoubleClick(row);
            }
        }
        handleSearch(searchValue) {
            this.setState({
                currentOffset: 0
            }, () => {
                if (searchValue) {
                    this.props.fetcher({
                        mode: 'reload',
                        offset: this.state.currentOffset,
                        first: this.state.currentFirst,
                        query: JSON.stringify({
                            operator: 'and',
                            queries: (this.props.baseFilter
                                ? [
                                    this.props.baseFilter(), {
                                        operator: 'or',
                                        queries: this.getGlobalSearchFilter(searchValue, true)
                                    }
                                ] : [
                                this.getGlobalSearchFilter(searchValue, true)
                            ])
                        })
                    }, (e) => {
                        if (e.mounted && !e.done) {
                            this.setState({
                                synced: false,
                                isFetching: true,
                                hasReloaded: false
                            });
                        }
                        else if (e.mounted && e.done) {
                            this.setState({
                                isFetching: false,
                                hasReloaded: true
                            });
                        }
                    });
                }
                else {
                    this.props.fetcher({
                        mode: 'reload',
                        offset: this.state.currentOffset,
                        first: this.state.currentFirst,
                        query: JSON.stringify({
                            operator: 'and',
                            queries: (this.props.baseFilter()
                                ? [
                                    this.props.baseFilter()
                                ] : [])
                        })
                    }, (e) => {
                        if (e.mounted && !e.done) {
                            this.setState({
                                synced: false,
                                isFetching: true,
                                hasReloaded: false
                            });
                        }
                        else if (e.mounted && e.done) {
                            this.setState({
                                isFetching: false,
                                hasReloaded: true
                            });
                        }
                    });
                }
            });
        }
        handleSortChange(sortName, sortOrder) {
            if (sortName && sortOrder) {
                this.setState({
                    currentOffset: 0
                }, () => {
                    this.props.fetcher({
                        mode: 'reload',
                        offset: this.state.currentOffset,
                        first: this.state.currentFirst,
                        orderBy: JSON.stringify({ attributes: [{ attribute: sortName, order: sortOrder }] })
                    }, (e) => {
                        if (e.mounted && !e.done) {
                            this.setState({
                                synced: false,
                                isFetching: true,
                                hasReloaded: false
                            });
                        }
                        else if (e.mounted && e.done) {
                            this.setState({
                                isFetching: false,
                                hasReloaded: true
                            });
                        }
                    });
                });
            }
        }
        handleLoadMore() {
            const { entityCollection } = this.props;
            if (!this.state.isFetching && entityCollection && entityCollection.pageInfo && entityCollection.pageInfo.hasNextPage) {
                const currentOffset = this.state.currentOffset;
                const newOffset = (currentOffset + this.props.pageSize);
                const newFirst = (this.props.pageSize + newOffset);
                this.setState({
                    currentFirst: newFirst
                }, () => {
                    this.props.fetcher({
                        mode: 'more',
                        offset: newOffset
                    }, (e) => {
                        if (e.mounted && !e.done) {
                            this.setState({
                                synced: false,
                                isFetching: true,
                                hasLoadedMore: false
                            });
                        }
                        else if (e.mounted && e.done) {
                            this.setState({
                                isFetching: false,
                                hasLoadedMore: true
                            });
                        }
                    });
                });
            }
        }
        cleanSelectedEntities() {
            const refs = this.refs;
            if (refs && refs.entitiesTable && refs.entitiesTable.cleanSelected) {
                refs.entitiesTable.cleanSelected();
            }
        }
        handleCreateProcessEnded(processKey, data) {
            this.props.fetcher({
                mode: 'reload',
                offset: this.state.currentOffset
            }, (e) => {
                if (e.mounted && !e.done) {
                    this.setState({
                        synced: false,
                        isFetching: true,
                        hasReloaded: false
                    });
                }
                else if (e.mounted && e.done) {
                    this.setState({
                        isFetching: false,
                        hasReloaded: true
                    });
                }
            });
        }
        handleItemProcessEnded(processKey, data) {
            this.props.fetcher({
                mode: 'reload',
                offset: this.state.currentOffset
            }, (e) => {
                if (e.mounted && !e.done) {
                    this.setState({
                        synced: false,
                        isFetching: true,
                        hasReloaded: false
                    });
                }
                else if (e.mounted && e.done) {
                    this.setState({
                        isFetching: false,
                        hasReloaded: true
                    }, () => {
                        if (processKey === ('Delete' + this.props.entityTypeName)) {
                            this.cleanSelectedEntities();
                        }
                    });
                }
            });
        }
        render() {
            const { children } = this.props;
            const { qflProps, rbtProps } = themeBuilder_js_1.buildTheme({
                theme: this.props.theme,
                sourceRbtProps: this.props.rbtProps,
                sourceQflProps: this.props.qflProps,
                componentName: 'Table'
            });
            let tableElement = null;
            if (this.state.hasLoaded) {
                tableElement = (React.createElement(Table_1.default, { tableOverlayStyles: this.props.tableOverlayStyles, tableStyles: this.props.tableStyles, executionContext: this.props.executionContext, processEngineClientApi: this.props.processEngineClientApi, theme: this.props.theme, ref: 'entitiesTable', dataClassName: this.props.entityTypeName, frame: false, onSearch: (searchValue) => this.handleSearch(searchValue), onCreateProcessEnded: (processKey, data) => this.handleCreateProcessEnded(processKey, data), onItemProcessEnded: (processKey, data) => this.handleItemProcessEnded(processKey, data), createProcessKey: 'Create', createStartToken: this.props.createStartToken, createButtonTheme: this.props.createButtonTheme, createDialogTheme: this.props.createDialogTheme, createFormItemTheme: this.props.createFormItemTheme, createConfirmTheme: this.props.createConfirmTheme, createWidgetTheme: this.props.createWidgetTheme, createTheme: this.props.createTheme, itemBasedButtonTheme: this.props.itemBasedButtonTheme, listBasedButtonTheme: this.props.listBasedButtonTheme, filterMenuTheme: this.props.filterMenuTheme, baseFilterMenuTheme: this.props.baseFilterMenuTheme, searchFieldTheme: this.props.searchFieldTheme, tableTheme: this.props.tableTheme, tableSelectorTheme: this.props.tableSelectorTheme, title: this.props.title, data: this.prepareCollection(), itemBasedButtonSchema: this.props.itemBasedButtonSchema, listBasedButtonSchema: this.props.listBasedButtonSchema, filterMenuSchema: this.props.filterMenuSchema, baseFilterMenuSchema: this.props.baseFilterMenuSchema, tableProps: Object.assign({ rbtProps: Object.assign({ remote: true, sortName: this.props.defaultSortName, sortOrder: this.props.defaultSortOrder, defaultSortName: this.props.defaultSortName, defaultSortOrder: this.props.defaultSortOrder, options: {
                                onRowDoubleClick: (row) => this.handleRowDoubleClick(row),
                                onSortChange: (sortName, sortOrder) => this.handleSortChange(sortName, sortOrder),
                                onLoadMore: () => this.handleLoadMore()
                            } }, rbtProps), thcSchema: this.props.columnSchema }, qflProps) }));
            }
            return (React.createElement("div", null,
                tableElement,
                children));
        }
    }
    ProcessableCrudTable.defaultProps = {
        rbtProps: {},
        entityCollection: {},
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
    exports.default = ProcessableCrudTable;
});

//# sourceMappingURL=CrudTable.js.map
