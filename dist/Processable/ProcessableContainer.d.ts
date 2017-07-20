import * as React from 'react';
import { IMUIProps } from '@process-engine-js/frontend_mui/dist/interfaces';
import { IProcessInstance } from '@process-engine-js/process_engine_client_api';
import { ExecutionContext } from '@process-engine-js/core_contracts';
export interface IProcessableContainerProps extends IMUIProps {
    processInstance: IProcessInstance;
    executionContext: ExecutionContext;
    uiName: string;
    buttonTheme?: any;
    dialogTheme?: any;
    modal?: boolean;
    formItemTheme?: any;
    widgetTheme?: any;
    confirmItemTheme?: any;
    processableClassName?: string;
    modalProcessableClassName?: string;
    dialogMuiProps?: {};
    dialogQflProps?: {};
    uiConfig?: any;
    uiData?: any;
}
export interface IProcessableContainerState {
    modalOpen?: boolean;
    uiData?: any;
    canceled?: boolean;
    processing?: boolean;
}
export interface IProcessableContainerChildContext {
    muiTheme?: {};
}
export declare class ProcessableContainer extends React.Component<IProcessableContainerProps, IProcessableContainerState> {
    static defaultProps: {
        theme: string;
        muiProps: {};
        qflProps: {};
        buttonTheme: string;
        dialogTheme: string;
        modal: boolean;
        formItemTheme: string;
        widgetTheme: string;
        confirmItemTheme: string;
        processableClassName: any;
        modalProcessableClassName: any;
        dialogMuiProps: any;
        dialogQflProps: any;
        uiConfig: any;
        uiData: {};
    };
    constructor(props: IProcessableContainerProps);
    componentWillMount(): void;
    private widgetConfig;
    private handleCancel(executionContext);
    private handleProceed(executionContext);
    render(): JSX.Element;
}
export default ProcessableContainer;
