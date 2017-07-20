import * as React from 'react';
import { IMUIProps } from '@process-engine-js/frontend_mui/dist/interfaces';
import { IColumnSchema } from '../../interfaces';
import { IProcessEngineClientApi } from '@process-engine-js/process_engine_client_api';
import { ExecutionContext } from '@process-engine-js/core_contracts';
export interface IProcessableCrudTableProps extends IMUIProps {
    fetcher: Function;
    executionContext: ExecutionContext;
    processEngineClientApi: IProcessEngineClientApi;
    rbtProps?: any;
    entityCollection?: {
        edges?: Array<{
            node: {};
        }>;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
    };
    title?: string;
    fetchingMode?: {};
    baseFilter?: Function;
    pageSize?: number;
    entityTypeName?: string;
    defaultSortName?: string;
    defaultSortOrder?: string;
    onRowDoubleClick?: Function;
    createStartToken?: {};
    createButtonTheme?: {};
    createDialogTheme?: {};
    createFormItemTheme?: {};
    createConfirmTheme?: {};
    createWidgetTheme?: {};
    createTheme?: {};
    itemBasedButtonSchema?: Array<{}>;
    listBasedButtonSchema?: Array<{}>;
    filterMenuSchema?: Array<{}>;
    baseFilterMenuSchema?: Array<{}>;
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
declare class ProcessableCrudTable extends React.Component<IProcessableCrudTableProps, IProcessableCrudTableState> {
    static defaultProps: {
        rbtProps: {};
        entityCollection: {};
        title: any;
        fetchingMode: string;
        baseFilter: any;
        pageSize: number;
        entityTypeName: string;
        defaultSortName: string;
        defaultSortOrder: string;
        onRowDoubleClick: any;
        createStartToken: any;
        createButtonTheme: any;
        createDialogTheme: any;
        createFormItemTheme: any;
        createConfirmTheme: any;
        createWidgetTheme: any;
        createTheme: any;
        itemBasedButtonSchema: any[];
        listBasedButtonSchema: any[];
        filterMenuSchema: any[];
        baseFilterMenuSchema: any[];
        itemBasedButtonTheme: any;
        listBasedButtonTheme: any;
        filterMenuTheme: any;
        baseFilterMenuTheme: any;
        searchFieldTheme: any;
        columnSchema: any[];
        tableOverlayStyles: any;
        tableStyles: any;
        theme: any;
        tableTheme: any;
        tableSelectorTheme: any;
    };
    constructor(props: any);
    componentDidMount(): void;
    getGlobalSearchFilter(searchValue: any, ignoreCase: any): ({
        attribute: string;
        type: string;
        operator: string;
        value: any;
    } | {
        attribute: string;
        operator: string;
        value: any;
        ignoreCase: any;
    })[];
    private initCollection(firstCall);
    private extendCollection();
    private prepareCollection();
    private handleRowDoubleClick(row);
    private handleSearch(searchValue);
    private handleSortChange(sortName, sortOrder);
    private handleLoadMore();
    cleanSelectedEntities(): void;
    private handleCreateProcessEnded(processKey, data);
    private handleItemProcessEnded(processKey, data);
    render(): JSX.Element;
}
export default ProcessableCrudTable;
