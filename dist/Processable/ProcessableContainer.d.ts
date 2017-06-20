import * as React from 'react';
import { IMUIProps } from '@process-engine-js/frontend_mui';
import { IProcessInstance } from '@process-engine-js/process_engine_client_api';
export interface IProcessableContainerProps extends IMUIProps {
    processInstance: IProcessInstance;
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
    canceled?: boolean;
    processing?: boolean;
}
export declare class ProcessableContainer extends React.Component<IProcessableContainerProps, IProcessableContainerState> {
    defaultProps: {
        theme: string;
        muiProps: {};
        qflProps: {};
        buttonTheme: any;
        dialogTheme: any;
        modal: boolean;
        formItemTheme: any;
        widgetTheme: any;
        confirmItemTheme: any;
        processableClassName: any;
        modalProcessableClassName: any;
        dialogMuiProps: any;
        dialogQflProps: any;
    };
    constructor(props: IProcessableContainerProps);
    protected componentWillMount(): void;
    private widgetConfig;
    private handleCancel();
    private handleProceed(tokenData);
    private tokenData;
    render(): JSX.Element;
}
export default ProcessableContainer;
