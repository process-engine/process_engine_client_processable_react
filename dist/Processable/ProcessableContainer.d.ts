import * as React from 'react';
import { IMUIProps } from '@process-engine-js/frontend_mui/dist/interfaces';
import { IProcessInstance } from '@process-engine-js/process_engine_client_api';
import { ExecutionContext } from '@process-engine-js/core_contracts';
export interface IProcessableContainerProps extends IMUIProps {
    processInstance: IProcessInstance;
    executionContext: ExecutionContext;
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
}
export interface IProcessableContainerState {
    modalOpen?: boolean;
    formData?: any;
    selectedItem?: any;
    canceled?: boolean;
    processing?: boolean;
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
    };
    static childContextTypes: {
        muiTheme: any;
    };
    constructor(props: IProcessableContainerProps);
    protected getChildContext(): {
        muiTheme: any;
    };
    protected componentWillMount(): void;
    private widgetConfig;
    private handleCancel(executionContext);
    private handleProceed(executionContext, tokenData);
    render(): JSX.Element;
}
export default ProcessableContainer;
