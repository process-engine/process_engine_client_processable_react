import * as React from 'react';
import { IProcessable } from '@process-engine-js/process_engine_client_api';
import { IMUIProps } from '@process-engine-js/frontend_mui';
import { IMessage } from '@process-engine-js/messagebus_contracts';
export interface IProcessableContainerProps extends IMUIProps {
    subscription?: any;
    mbClient?: any;
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
export declare class ProcessableContainer extends React.Component<IProcessableContainerProps, IProcessableContainerState> implements IProcessable {
    defaultProps: {
        theme: string;
        muiProps: {};
        qflProps: {};
        subscription: any;
        mbClient: any;
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
    handleUserTask(message: IMessage): void;
    handleManualTask(message: IMessage): void;
    handleEndEvent(message: IMessage): void;
    protected componentWillMount(): void;
    private widgetConfig;
    private handleCancel();
    private handleProceed(tokenData);
    private tokenData;
    render(): JSX.Element;
}
export default ProcessableContainer;
