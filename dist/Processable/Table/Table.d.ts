import * as React from 'react';
import { IMUIProps } from '@process-engine-js/frontend_mui/dist/interfaces';
import { IProcessable, IProcessEngineClientApi, IProcessInstance } from '@process-engine-js/process_engine_client_api';
import { ExecutionContext } from '@process-engine-js/core_contracts';
export interface ITableProps extends IMUIProps {
    dataClassName: string;
    executionContext: ExecutionContext;
    processEngineClientApi: IProcessEngineClientApi;
    title?: string;
    children?: React.ReactNode;
    frame?: boolean;
    createProcessKey?: string;
    createStartToken?: any;
    createButtonMuiProps?: {};
    createButtonQflProps?: {};
    createButtonProps?: {};
    createButtonTheme?: {};
    createDialogTheme?: {};
    createFormItemTheme?: {};
    createConfirmTheme?: {};
    createWidgetTheme?: {};
    createTheme?: {};
    itemBasedButtonTheme?: {};
    listBasedButtonTheme?: {};
    filterMenuTheme?: {};
    baseFilterMenuTheme?: {};
    searchFieldTheme?: {};
    onSearch?: Function;
    searchFieldMuiProps?: {};
    searchFieldQflProps?: {};
    searchFieldProps?: {};
    searchValue?: string;
    tableProps?: {
        rbtProps?: any;
    };
    data?: any;
    searchKeyDelay?: number;
    controlledHeight?: number;
    itemBasedButtonSchema?: any;
    itemBasedButtonMuiProps?: {};
    itemBasedButtonQflProps?: {};
    itemBasedButtonProps?: {};
    itemBasedMoreButtonMuiProps?: {};
    itemBasedMoreButtonQflProps?: {};
    itemBasedMoreButtonProps?: {};
    listBasedButtonSchema?: any;
    filterMenuSchema?: any;
    onFilterChange?: Function;
    baseFilterMenuSchema?: any;
    onCreateProcessEnded?: Function;
    onItemProcessEnded?: Function;
    tableOverlayStyles?: {
        menuHeaderClassName?: string;
        menuItemClassName?: string;
    };
    tableStyles?: {
        tableWithFrameClassName?: string;
        tableWithoutFrameClassName?: string;
        createButtonClassName?: string;
        contentOverlayClassName?: string;
        tableBarClassName?: string;
        itemHeaderClassName?: string;
        searchFieldClassName?: string;
        itemBasedMoreButtonClassName?: string;
        itemBasedButtonClassName?: string;
        tableRowClassName?: string;
        tableHeaderRowClassName?: string;
        tableColumnSelectorClassName?: string;
        tableHeaderColumnSelectorClassName?: string;
    };
    tableTheme?: {};
    tableOverlayTheme?: {};
    tableSelectorTheme?: {};
}
export interface ITableState {
    isItemBasedMoreMenuOpened?: boolean;
    selectedRows?: {};
    searchValue?: string;
    createOnProcessEnded?: Function;
    createProcessableContainer?: React.ReactNode;
    currentItemProcessKey?: string;
    currentItemOnProcessEnded?: Function;
    itemProcessableContainer?: React.ReactNode;
}
declare class ProcessableTable extends React.Component<ITableProps, ITableState> implements IProcessable {
    static defaultProps: {
        theme: any;
        muiProps: {};
        qflProps: {};
        title: any;
        frame: boolean;
        searchKeyDelay: number;
        tableStyles: {
            tableWithFrameClassName: any;
            tableWithoutFrameClassName: any;
            createButtonClassName: any;
            contentOverlayClassName: any;
            tableBarClassName: any;
            itemHeaderClassName: any;
            searchFieldClassName: any;
            itemBasedMoreButtonClassName: any;
            itemBasedButtonClassName: any;
            tableRowClassName: any;
            tableHeaderRowClassName: any;
            tableColumnSelectorClassName: any;
            tableHeaderColumnSelectorClassName: any;
        };
        tableOverlayStyles: {
            menuHeaderClassName: any;
            menuItemClassName: any;
        };
        createProcessKey: any;
        createStartToken: any;
        createButtonMuiProps: any;
        createButtonQflProps: any;
        createButtonProps: any;
        createButtonTheme: any;
        createDialogTheme: any;
        createFormItemTheme: any;
        createConfirmTheme: any;
        createWidgetTheme: any;
        createTheme: any;
        itemBasedButtonTheme: any;
        listBasedButtonTheme: any;
        filterMenuTheme: any;
        baseFilterMenuTheme: any;
        searchFieldTheme: any;
        onSearch: any;
        searchFieldMuiProps: any;
        searchFieldQflProps: any;
        searchFieldProps: any;
        searchValue: any;
        tableProps: {
            rbtProps: {};
        };
        data: any;
        controlledHeight: any;
        itemBasedButtonSchema: any;
        itemBasedButtonMuiProps: any;
        itemBasedButtonQflProps: any;
        itemBasedButtonProps: any;
        itemBasedMoreButtonMuiProps: any;
        itemBasedMoreButtonQflProps: any;
        itemBasedMoreButtonProps: any;
        listBasedButtonSchema: any;
        filterMenuSchema: any;
        onFilterChange: any;
        baseFilterMenuSchema: any;
        onCreateProcessEnded: any;
        onItemProcessEnded: any;
        tableTheme: any;
        tableOverlayTheme: any;
        tableSelectorTheme: any;
    };
    constructor(props: any);
    private renderProcessContainer(processInstance, uiName, uiConfig?, uiData?);
    handleUserTask(processInstance: IProcessInstance, uiName: string, uiConfig?: any, uiData?: any): Promise<void>;
    handleManualTask(processInstance: IProcessInstance, uiName: string, uiConfig?: any, uiData?: any): Promise<void>;
    handleEvent(processInstance: IProcessInstance, eventType: string, eventData?: any): Promise<void>;
    handleCancel(processInstance: IProcessInstance): Promise<void>;
    handleEndEvent(processInstance: IProcessInstance, endEventData?: any): Promise<void>;
    private handleStartCreate(startToken, onProcessEnded?, done?);
    private handleStartItem(processKey, startToken, onProcessEnded?, done?);
    private delay;
    private handleItemClicked(item);
    private handleSelectedRowsChanged(selectedRows);
    cleanSelected(): void;
    private handleFilterItemChange(key, oldValue, newValue, choosenElement, element);
    itemBasedMoreMenuId: string;
    render(): JSX.Element;
}
export default ProcessableTable;
