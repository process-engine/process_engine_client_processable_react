import * as React from 'react';

import {buildTheme} from '@quantusflow/frontend_mui/dist/commonjs/themeBuilder.js';
import {IMUIProps} from '@quantusflow/frontend_mui/dist/interfaces';
import {ProcessableTable} from '../Table/Table';

import {ExecutionContext} from '@essential-projects/core_contracts';
import {IProcessEngineClientApi} from '@quantusflow/process_engine_client_api';
import {IColumnSchema} from '../../interfaces';

export interface IProcessableCrudTableProps extends IMUIProps {
  fetcher: Function;
  executionContext: ExecutionContext;
  processEngineClientApi: IProcessEngineClientApi;

  rbtProps?: any;
  entityCollection?: { edges?: Array<{ node: {}}>, pageInfo?: { hasNextPage?: boolean, hasPreviousPage?: boolean } };

  title?: string;
  fetchingMode?: {};
  baseFilter?: Function;
  extendedFilter?: Function;

  pageSize?: number;
  entityTypeName?: string;
  defaultSortName?: string;
  defaultSortOrder?: string;
  onRowDoubleClick?: Function;

  createStartToken?: {};
  createButtonMuiProps?: {};
  createButtonQflProps?: {};
  createButtonProps?: {};
  createButtonTheme?: {};

  processButtonTheme?: {};
  processDialogTheme?: {};
  processFormItemTheme?: {};
  processConfirmTheme?: {};
  processWidgetTheme?: {};
  processTheme?: {};

  itemBasedButtonSchema?: Array<{}>;
  listBasedButtonSchema?: Array<{}>;
  filterMenuSchema?: Array<{}>;
  baseFilterMenuSchema?: Array<{}>;

  onFilterChange?: Function;

  itemBasedButtonTheme?: {};
  listBasedButtonTheme?: {};
  filterMenuTheme?: {};
  baseFilterMenuTheme?: {};

  searchFieldTheme?: {};

  columnSchema?: Array<IColumnSchema>;

  tableOverlayStyles?: {};
  tableStyles?: {};

  theme?: {};
  tableTheme?: {};
  tableOverlayTheme?: {};
  tableSelectorTheme?: {};
}

export interface IProcessableCrudTableState {
  currentOffset?: number;
  currentFirst?: number;
  isFetching?: boolean;
  hasLoadedMore?: boolean;
  hasReloaded?: boolean;
  hasLoaded?: boolean;
  synced?: boolean;
  entityCollection?: Array<{}>;
}

export class ProcessableCrudTable extends React.Component<IProcessableCrudTableProps, IProcessableCrudTableState> {
  public static defaultProps: any = {
    rbtProps: {},
    entityCollection: {},

    title: null,
    fetchingMode: 'initial',
    baseFilter: null,
    extendedFilter: (): {} => ({}),

    pageSize: 16,
    entityTypeName: 'Entity',
    defaultSortName: 'id',
    defaultSortOrder: 'asc',
    onRowDoubleClick: null,

    createStartToken: null,
    createButtonMuiProps: null,
    createButtonQflProps: null,
    createButtonProps: null,
    createButtonTheme: null,

    processButtonTheme: null,
    processDialogTheme: null,
    processFormItemTheme: null,
    processConfirmTheme: null,
    processWidgetTheme: null,
    processTheme: null,

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
    tableOverlayTheme: null,
    tableSelectorTheme: null,
  };

  constructor(props: IProcessableCrudTableProps) {
    super(props);

    this.state = {
      currentOffset: 0,
      currentFirst: props.pageSize,
      isFetching: true,
      hasLoadedMore: false,
      hasReloaded: false,
      hasLoaded: false,
      synced: false,
      entityCollection: [],
    };
  }

  public componentDidMount(): void {
    this.props.fetcher(
      {
        mode: 'load',
        offset: this.state.currentOffset,
        first: this.props.pageSize,
        query: JSON.stringify({
          operator: 'and',
          queries: (this.props.baseFilter
            ? [
              this.props.baseFilter(),
            ] : []
          ),
        }),
        ...this.props.extendedFilter(),
      },
      (e: any): void => {
        if (e.mounted && !e.done) {
          this.setState({
            isFetching: true,
            hasLoaded: false,
            synced: false,
          });
        } else if (e.mounted && e.done) {
          this.setState({
            isFetching: false,
            hasLoaded: true,
          });
        }
      },
    );
  }

  public getGlobalSearchFilter(searchValue: string, ignoreCase: boolean): void {
    const searchFilter: any = this.props.columnSchema.filter((element: any) => (element.searchable)).map((element: any) => {
      if (element.searchableType === 'float' || element.searchableType === 'integer') {
        const parsedSearchValue: any = (element.searchableType === 'float' ? parseFloat(searchValue) : parseInt(searchValue));
        if (isNaN(parsedSearchValue)) {
          return null;
        }
        searchValue = parsedSearchValue;

        return {
          attribute: element.thcProps.dataField,
          type: 'number',
          operator: '=',
          value: searchValue,
        };
      }

      return {
        attribute: element.thcProps.dataField,
        operator: 'contains',
        value: searchValue,
        ignoreCase,
      };
    }).filter((element: any) => (element !== null && element !== undefined));

    return searchFilter;
  }

  private initCollection(firstCall: any): any {
    let newEntityCollection: any = (this.state.entityCollection || []);
    const { entityCollection } = this.props;

    if (entityCollection && entityCollection.edges) {
      newEntityCollection = entityCollection.edges.map((item: any) => item.node);
    }

    setTimeout(
      () => {
        this.setState({
          entityCollection: newEntityCollection,
          synced: true,
        });
      },
      0,
    );

    return newEntityCollection;
  }

  private extendCollection(): any {
    const currentEntityCollection: any = (this.state.entityCollection || []);
    let newEntityCollection: any = currentEntityCollection;
    const { entityCollection } = this.props;
    if (entityCollection && entityCollection.edges) {
      newEntityCollection = currentEntityCollection.concat(entityCollection.edges.map((item: any) => item.node));
    }

    setTimeout(
      () => {
        this.setState({
          currentOffset: (this.state.currentOffset + this.props.pageSize),
          entityCollection: newEntityCollection,
          synced: true,
        });
      },
      0,
    );

    return newEntityCollection;
  }

  private prepareCollection(): any {
    if (!this.state.synced) {
      if (!this.state.isFetching) {
        if (this.state.hasLoaded && this.props.fetchingMode === 'load') {
          return this.initCollection(true);
        } else if (this.state.hasReloaded && this.state.hasLoaded && this.props.fetchingMode === 'reload') {
          return this.initCollection(false);
        } else if (this.state.hasLoadedMore && this.state.hasLoaded && this.props.fetchingMode === 'more') {
          return this.extendCollection();
        } else {
          return this.initCollection(true);
        }
      }
    }

    return (this.state.entityCollection || []);
  }

  private handleRowDoubleClick(row: any): void {
    if (this.props.onRowDoubleClick) {
      this.props.onRowDoubleClick(row);
    }
  }

  private handleSearch(searchValue: any): void {
    this.setState(
      {
        currentOffset: 0,
      },
      () => {
        if (searchValue) {
          this.props.fetcher(
            {
              mode: 'reload',
              offset: this.state.currentOffset,
              first: this.state.currentFirst,
              query: JSON.stringify({
                operator: 'and',
                queries: (this.props.baseFilter
                  ? [
                    this.props.baseFilter(), {
                      operator: 'or',
                      queries: this.getGlobalSearchFilter(searchValue, true),
                    },
                  ] : [
                    this.getGlobalSearchFilter(searchValue, true),
                  ]
                ),
              }),
              ...this.props.extendedFilter(),
            },
            (e: any) => {
              if (e.mounted && !e.done) {
                this.setState({
                  synced: false,
                  isFetching: true,
                  hasReloaded: false,
                });
              } else if (e.mounted && e.done) {
                this.setState({
                  isFetching: false,
                  hasReloaded: true,
                });
              }
            },
          );
        } else {
          this.props.fetcher(
            {
              mode: 'reload',
              offset: this.state.currentOffset,
              first: this.state.currentFirst,
              query: JSON.stringify({
                operator: 'and',
                queries: (this.props.baseFilter()
                  ? [
                    this.props.baseFilter(),
                  ] : []
                ),
              }),
              ...this.props.extendedFilter(),
            },
            (e: any) => {
              if (e.mounted && !e.done) {
                this.setState({
                  synced: false,
                  isFetching: true,
                  hasReloaded: false,
                });
              } else if (e.mounted && e.done) {
                this.setState({
                  isFetching: false,
                  hasReloaded: true,
                });
              }
            },
          );
        }
      },
    );
  }

  private handleSortChange(sortName: any, sortOrder: any): void {
    if (sortName && sortOrder) {
      this.setState(
        {
          currentOffset: 0,
        },
        () => {
          this.props.fetcher(
            {
              mode: 'reload',
              offset: this.state.currentOffset,
              first: this.state.currentFirst,
              orderBy: JSON.stringify({ attributes: [{ attribute: sortName, order: sortOrder }] }),
            },
            (e: any) => {
              if (e.mounted && !e.done) {
                this.setState({
                  synced: false,
                  isFetching: true,
                  hasReloaded: false,
                });
              } else if (e.mounted && e.done) {
                this.setState({
                  isFetching: false,
                  hasReloaded: true,
                });
              }
            },
          );
        },
      );
    }
  }

  private handleLoadMore(): void {
    const { entityCollection } = this.props;

    if (!this.state.isFetching && entityCollection && entityCollection.pageInfo && entityCollection.pageInfo.hasNextPage) {
      const currentOffset: any = this.state.currentOffset;
      const newOffset: any = (currentOffset + this.props.pageSize);
      const newFirst: any = (this.props.pageSize + newOffset);
      this.setState(
        {
          currentFirst: newFirst,
        },
        () => {
          this.props.fetcher(
            {
              mode: 'more',
              offset: newOffset,
            },
            (e: any) => {
              if (e.mounted && !e.done) {
                this.setState({
                  synced: false,
                  isFetching: true,
                  hasLoadedMore: false,
                });
              } else if (e.mounted && e.done) {
                this.setState({
                  isFetching: false,
                  hasLoadedMore: true,
                });
              }
            },
          );
        },
      );
    }
  }

  public cleanSelectedEntities(): void {
    const refs: any = this.refs;
    if (refs && refs.entitiesTable && refs.entitiesTable.cleanSelected) {
      refs.entitiesTable.cleanSelected();
    }
  }

  private handleCreateProcessEnded(processKey: any, data: any): void {
    this.props.fetcher(
      {
        mode: 'reload',
        offset: this.state.currentOffset,
      },
      (e: any) => {
        if (e.mounted && !e.done) {
          this.setState({
            synced: false,
            isFetching: true,
            hasReloaded: false,
          });
        } else if (e.mounted && e.done) {
          this.setState(
            {
              isFetching: false,
              hasReloaded: true,
            },
          );
        }
      },
    );
  }

  private handleItemProcessEnded(processKey: any, data: any): void {
    this.props.fetcher(
      {
        mode: 'reload',
        offset: this.state.currentOffset,
      },
      (e: any) => {
        if (e.mounted && !e.done) {
          this.setState({
            synced: false,
            isFetching: true,
            hasReloaded: false,
          });
        } else if (e.mounted && e.done) {
          this.setState(
            {
              isFetching: false,
              hasReloaded: true,
            },
            () => {
              if (processKey === (`Delete${this.props.entityTypeName}`)) {
                this.cleanSelectedEntities();
              }
            },
          );
        }
      },
    );
  }

  public render(): JSX.Element | Array<JSX.Element> | string | number | null | false {
    const { children } = this.props;

    const { qflProps, rbtProps } = buildTheme({
      theme: this.props.theme,
      sourceRbtProps: this.props.rbtProps,
      sourceQflProps: this.props.qflProps,
      componentName: 'Table',
    });

    let tableElement: any = null;
    if (this.state.hasLoaded) {
      tableElement = (
        <ProcessableTable
          tableOverlayStyles={this.props.tableOverlayStyles}
          tableStyles={this.props.tableStyles}

          executionContext={this.props.executionContext}
          processEngineClientApi={this.props.processEngineClientApi}

          theme={this.props.theme}

          ref='entitiesTable'
          dataClassName={this.props.entityTypeName}
          frame={false}
          onSearch={(searchValue: any): any => this.handleSearch(searchValue)}
          onCreateProcessEnded={(processKey: any, data: any): any => this.handleCreateProcessEnded(processKey, data)}
          onItemProcessEnded={(processKey: any, data: any): any => this.handleItemProcessEnded(processKey, data)}
          createProcessKey='Create'
          createStartToken={this.props.createStartToken}

          createButtonMuiProps={this.props.createButtonMuiProps}
          createButtonQflProps={this.props.createButtonQflProps}
          createButtonProps={this.props.createButtonProps}
          createButtonTheme={this.props.createButtonTheme}

          processButtonTheme={this.props.processButtonTheme}
          processDialogTheme={this.props.processDialogTheme}
          processFormItemTheme={this.props.processFormItemTheme}
          processConfirmTheme={this.props.processConfirmTheme}
          processWidgetTheme={this.props.processWidgetTheme}
          processTheme={this.props.processTheme}

          itemBasedButtonTheme={this.props.itemBasedButtonTheme}
          listBasedButtonTheme={this.props.listBasedButtonTheme}
          filterMenuTheme={this.props.filterMenuTheme}
          baseFilterMenuTheme={this.props.baseFilterMenuTheme}

          searchFieldTheme={this.props.searchFieldTheme}

          tableTheme={this.props.tableTheme}
          tableOverlayTheme={this.props.tableOverlayTheme}
          tableSelectorTheme={this.props.tableSelectorTheme}

          title={this.props.title}
          data={this.prepareCollection()}
          itemBasedButtonSchema={this.props.itemBasedButtonSchema}
          listBasedButtonSchema={this.props.listBasedButtonSchema}
          filterMenuSchema={this.props.filterMenuSchema}
          baseFilterMenuSchema={this.props.baseFilterMenuSchema}

          onFilterChange={(key: any, newValue: any, choosenElement: any, element: any): void => {
            if (this.props.onFilterChange) {
              this.props.onFilterChange(key, newValue, choosenElement, element, (query: any) => {
                this.props.fetcher(query, (e: any) => {
                  if (e.mounted && !e.done) {
                    this.setState({
                      synced: false,
                      isFetching: true,
                      hasReloaded: false,
                    });
                  } else if (e.mounted && e.done) {
                    this.setState({
                      isFetching: false,
                      hasReloaded: true,
                    });
                  }
                });
              });
            }
          }}

          tableProps={{
            rbtProps: {
              remote: true,
              sortName: this.props.defaultSortName,
              sortOrder: this.props.defaultSortOrder,
              defaultSortName: this.props.defaultSortName,
              defaultSortOrder: this.props.defaultSortOrder,
              options: {
                onRowDoubleClick: (row: any): any => this.handleRowDoubleClick(row),
                onSortChange: (sortName: any, sortOrder: any): any => this.handleSortChange(sortName, sortOrder),
                onLoadMore: (): any => this.handleLoadMore(),
              },
              ...rbtProps,
            },
            thcSchema: this.props.columnSchema,
            ...qflProps,
          }}
        />
      );
    }

    return (
      <div>
        {tableElement}
        {children}
      </div>
    );
  }
}
