import * as React from 'react';
import * as PropTypes from 'prop-types';

import RaisedButton from '@process-engine-js/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js';
import Dialog from '@process-engine-js/frontend_mui/dist/commonjs/Dialogs/Dialog/Dialog.js';
import Form from '@process-engine-js/frontend_mui/dist/commonjs/InputForms/Form/Form.js';
import Confirm from '@process-engine-js/frontend_mui/dist/commonjs/InputForms/Confirm/Confirm.js';

import {buildTheme} from '@process-engine-js/frontend_mui/dist/commonjs/themeBuilder.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme.js';

import * as mustache from 'mustache';
import {IMUIProps} from '@process-engine-js/frontend_mui/dist/interfaces';
import {IProcessInstance} from '@process-engine-js/process_engine_client_api';
import {ExecutionContext} from '@process-engine-js/core_contracts';

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
  canceled?: boolean;
  processing?: boolean;
}

export class ProcessableContainer extends React.Component<IProcessableContainerProps, IProcessableContainerState> {
  public static defaultProps = {
    theme: 'Default',
    muiProps: {},
    qflProps: {},

    buttonTheme: 'Default',
    dialogTheme: 'Default',
    modal: false,
    formItemTheme: 'Default',
    widgetTheme: 'Default',
    confirmItemTheme: 'Default',
    processableClassName: null,
    modalProcessableClassName: null,
    dialogMuiProps: null,
    dialogQflProps: null
  };

  public static childContextTypes = {
    muiTheme: PropTypes.object
  };

  constructor(props: IProcessableContainerProps) {
    super(props);

    this.state = {
      modalOpen: props.modal,
      formData: {},
      canceled: false,
      processing: false
    };
  }

  protected getChildContext() {
    return {
      muiTheme: getMuiTheme(this.props.theme)
    };
  }

  protected componentWillMount() {
    const { processInstance } = this.props;

    let widget = null;
    let widgetName = null;
    const widgetNameArr = processInstance.nextTaskDef.extensions.properties.filter((property) => property.name === 'widgetName');

    if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
      widgetNameArr && widgetNameArr.length === 1) {
      widgetName = widgetNameArr[0].value;
      const tokenData = (processInstance.nextTaskEntity && processInstance.nextTaskEntity.processToken ? processInstance.nextTaskEntity.processToken.data : null);
      switch (widgetName) {
        case 'Form': {
          let formElements = [];
          if (processInstance.nextTaskDef.extensions.formFields && processInstance.nextTaskDef.extensions.formFields.length > 0) {
            formElements = processInstance.nextTaskDef.extensions.formFields.map((formField) => {
              let parsedType = null;
              const options: any = {};
              let formFieldWidgetNameArr;
              let formFieldMuiPropsArr;
              let muiProps = {};

              formFieldMuiPropsArr = formField.formProperties.filter((formFieldProperty) => formFieldProperty.name === 'muiProps');
              if (formField.formProperties && formFieldMuiPropsArr && formFieldMuiPropsArr.length === 1 && formFieldMuiPropsArr[0].value) {
                muiProps = JSON.parse(formFieldMuiPropsArr[0].value.replace(/\&\#34\;/gi, '"'));
              }

              switch (formField.type) {
                case 'string':
                  parsedType = 'TextField';
                  break;
                case 'boolean':
                  parsedType = 'CheckBox';
                  options.initialValue = null;
                  if (formField.defaultValue !== null) {
                    options.initialValue = (formField.defaultValue === '1');
                  }
                  break;
                case 'enum':
                  parsedType = 'DropDown';
                  formFieldWidgetNameArr = formField.formProperties.filter((formFieldProperty) => formFieldProperty.name === 'widgetName');
                  if (formField.formProperties && formFieldWidgetNameArr && formFieldWidgetNameArr.length === 1) {
                    parsedType = formFieldWidgetNameArr[0].value;
                  }

                  if (parsedType === 'RadioBox') {
                    options.radioButtonMuiProps = buildTheme({
                      theme: this.props.formItemTheme,
                      sourceMuiProps: {},
                      componentName: 'RadioButton'
                    }).muiProps;
                  }

                  if (formField.formValues && formField.formValues.length > 0) {
                    options.items = formField.formValues.map((formValue) => {
                      const value = formValue.id;
                      const label = formValue.name;
                      if (value && label) {
                        return {
                          value,
                          label
                        };
                      }

                      return null;
                    }).filter((formValue) => (formValue !== null));
                  }
                  if (formField.defaultValue) {
                    options.initialValue = formField.defaultValue;
                  }
                  break;
                default:
                  break;
              }
              if (parsedType) {
                return {
                  theme: this.props.formItemTheme,
                  label: formField.label,
                  type: parsedType,
                  muiProps,
                  key: formField.id,
                  ...options
                };
              }
              return null;
            }).filter((formField) => (formField !== null));
          }

          widget = {
            component: Form,
            isModal: this.props.modal,
            props: {
              theme: this.props.widgetTheme,
              layout: formElements
            }
          };
        }
        break;
        case 'Confirm': {
          const confirmLayoutArr = processInstance.nextTaskDef.extensions.properties.filter((property) => property.name === 'confirmLayout');
          const confirmMessageArr = processInstance.nextTaskDef.extensions.properties.filter((property) => property.name === 'confirmMessage');
          let confirmLayout = [];
          let confirmMessage = '';

          let confirmElements = [];
          if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
            confirmMessageArr && confirmLayoutArr.length === 1) {
            confirmLayout = JSON.parse(confirmLayoutArr[0].value);

            confirmElements = confirmLayout.map((element) => {
              const elementObj: any = {
                theme: this.props.confirmItemTheme,
                key: element.key,
                label: element.label
              };

              if (element.isCancel) {
                elementObj.muiProps = {
                  primary: false,
                  secondary: true
                };
              }

              return elementObj;
            });
          }
          if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
            confirmMessageArr && confirmMessageArr.length === 1) {
            confirmMessage = mustache.render(confirmMessageArr[0].value, tokenData);
          }

          widget = {
            component: Confirm,
            isModal: this.props.modal,
            props: {
              theme: this.props.widgetTheme,
              layout: confirmElements,
              message: confirmMessage
            }
          };
        }
        break;
        default:
          break;
      }
    }

    if (widget) {
      this.widgetConfig = widget;
    }
  }

  private widgetConfig = null;

  private handleCancel(executionContext) {
    const { processInstance } = this.props;

    const fireCancel = () => {
      if (processInstance) {
        processInstance.doCancel(executionContext).then(() => {
          this.setState({
            canceled: true,
            processing: true
          });
        });
      }
    };

    this.setState(
      {
        modalOpen: false
      },
      fireCancel
    );
  }

  private handleProceed(executionContext, tokenData) {
    const { processInstance } = this.props;

    const fireProceed = () => {
      if (processInstance) {
        processInstance.doProceed(executionContext, tokenData).then(() => {
          this.setState({
            canceled: false,
            processing: true
          });
        });
      }
    };

    if (this.props.modal) {
      this.setState(
        {
          canceled: false,
          modalOpen: false
        },
        fireProceed
      );
    } else {
      fireProceed();
    }
  }

  public render() {
    const { qflProps } = buildTheme({
      theme: this.props.theme,
      sourceMuiProps: this.props.muiProps,
      sourceQflProps: this.props.qflProps,
      componentName: 'Processable'
    });

    const { processInstance } = this.props;

    let proceedButton = null;
    let cancelButton = null;

    let widget = null;
    if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Form') {
      proceedButton = (
        <RaisedButton
          theme={this.props.buttonTheme}
          muiProps={{
            label: 'Weiter',
            primary: true
          }}
          qflProps={{
            onClick: (e) => {
              this.handleProceed(this.props.executionContext, { formData: this.state.formData });
            }
          }}
        />
      );

      if (this.props.modal) {
        cancelButton = (
          <RaisedButton
            theme={this.props.buttonTheme}
            muiProps={{
              label: 'Abbrechen',
              primary: true
            }}
            qflProps={{
              onClick: (e) => {
                this.handleCancel(this.props.executionContext);
              }
            }}
          />
        );
      }

      const onChange = (formData) => {
        this.setState({
          formData
        });
      };
      widget = <this.widgetConfig.component onChange={(formData) => onChange(formData)} {...this.widgetConfig.props}/>;
    } else if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Confirm') {
      const onChoose = (key) => {
        const confirmData = {
          key
        };
        this.handleProceed(this.props.executionContext, { confirmData });
      };
      widget = <this.widgetConfig.component onChoose={(key) => onChoose(key)} {...this.widgetConfig.props}/>;
    }

    if (processInstance) {
      let tokenDataElement = null;
      let tokenData = null;
      if (processInstance && processInstance.nextTaskEntity && processInstance.nextTaskEntity.processToken && processInstance.nextTaskEntity.processToken.data) {
        tokenData = processInstance.nextTaskEntity.processToken.data;
      }

      if (tokenData) {
        tokenDataElement = (
          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              display: 'inline-block',
              top: '170px',
              left: '10px',
              padding: '0px'
            }}
          />
        );
      }

      if (processInstance.nextTaskDef && !this.state.processing) {
        if (this.props.modal) {
          return (
            <div
              style={{
                display: 'inline-block',
                padding: '10px',
                textAlign: 'left'
              }}
              {...qflProps}
            >
              <Dialog
                theme={this.props.dialogTheme}
                muiProps={{
                  title: processInstance.nextTaskDef.name,
                  actions: [cancelButton, proceedButton],
                  modal: true,
                  open: this.state.modalOpen,
                  ...this.props.dialogMuiProps
                }}
                qflProps={{
                  ...this.props.dialogQflProps
                }}
              >
                {widget}<br/>
              </Dialog><br/>
              {tokenDataElement}
            </div>
          );
        }

        return (
          <div
            style={{
              padding: '10px'
            }}
            {...qflProps}
          >
            <h4>{processInstance.nextTaskDef.name}</h4>
            {widget}<br/>
            {proceedButton}<br/>
            {tokenDataElement}
            <hr/>
          </div>
        );
      }

      let processingComponent = (<span>Bitte warten...</span>);
      if (this.state.canceled) {
        processingComponent = null;
      }

      return (
        <div
          style={{
            display: 'table',
            padding: '10px',
            margin: '0 auto'
          }}
          {...qflProps}
        >
          <div
            style={{
              display: 'table-cell',
              textAlign: 'center',
              verticalAlign: 'middle'
            }}
          >
            {processingComponent}
          </div>
          <hr/>
        </div>
      );
    }

    return null;
  }
}

export default ProcessableContainer;
