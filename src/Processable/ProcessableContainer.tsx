import * as React from 'react';
import * as PropTypes from 'prop-types';

import {IDatastoreService} from '@essential-projects/data_model_contracts';

import RaisedButton from '@quantusflow/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js';
import Dialog from '@quantusflow/frontend_mui/dist/commonjs/Dialogs/Dialog/Dialog.js';
import Confirm from '@quantusflow/frontend_mui/dist/commonjs/InputForms/Confirm/Confirm.js';
import Form from '@quantusflow/frontend_mui/dist/commonjs/InputForms/Form/Form.js';
import Table from '@quantusflow/frontend_mui/dist/commonjs/Tables/Table/Table.js';

import {buildTheme} from '@quantusflow/frontend_mui/dist/commonjs/themeBuilder.js';

import {ExecutionContext} from '@essential-projects/core_contracts';
import {IMUIProps} from '@quantusflow/frontend_mui/dist/interfaces';
import {IProcessInstance} from '@quantusflow/process_engine_client_api';
import * as mustache from 'mustache';

export interface IProcessableContainerProps extends IMUIProps {
  processInstance: IProcessInstance;
  executionContext: ExecutionContext;
  uiName: string;

  modal?: boolean;

  buttonTheme?: any;
  dialogTheme?: any;
  formItemTheme?: any;
  confirmItemTheme?: any;
  widgetTheme?: any;

  processableClassName?: string;
  modalProcessableClassName?: string;
  dialogMuiProps?: {};
  dialogQflProps?: {};

  uiConfig?: any;
  uiData?: any;

  isDebug?: boolean;

  componentClass?: any;
  componentProps?: {};
}

export interface IProcessableContainerState {
  modalOpen?: boolean;
  uiData?: any;
  canceled?: boolean;
  processing?: boolean;
}

export interface IProcessableContainerContextTypes {
  datastoreService?: IDatastoreService;
  executionContext?: ExecutionContext;
}

export class ProcessableContainer extends React.Component<IProcessableContainerProps, IProcessableContainerState> {

  public static defaultProps: {} = {
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
    dialogQflProps: null,

    uiConfig: null,
    uiData: {},

    isDebug: false,

    componentClass: null,
    componentProps: null,
  };

  public static contextTypes: IProcessableContainerContextTypes = {
    datastoreService: PropTypes.object,
    executionContext: PropTypes.object,
  };

  private widgetConfig: any = null;

  constructor(props: IProcessableContainerProps) {
    super(props);

    this.state = {
      modalOpen: props.modal,
      uiData: props.uiData,
      canceled: false,
      processing: false,
    };
  }

  public componentWillMount(): void {
    const { processInstance, uiData } = this.props;

    let widget: {} = null;
    const widgetName: string = this.props.uiName;

    if (widgetName) {
      const tokenData: {} = (processInstance && processInstance.tokenData) || {};

      switch (widgetName) {
        case 'SelectableList':
          let selectableListDataSource: any = null;
          let selectableListColumnSchema: any = null;
          if (typeof this.props.uiConfig === 'object' && this.props.uiConfig) {
            if (this.props.uiConfig.hasOwnProperty('dataSource')) {
              selectableListDataSource = this.props.uiConfig.dataSource;
            }
            if (this.props.uiConfig.hasOwnProperty('thcSchema')) {
              selectableListColumnSchema = this.props.uiConfig.thcSchema;
            }
          }

          widget = {
            component: Table,
            props: {
              dataSource: selectableListDataSource,
              thcSchema: selectableListColumnSchema,
              theme: this.props.widgetTheme,
              rbtProps: {
                selectRow: {
                  mode: 'radio',
                },
              },
            },
          };
          break;
        case 'Form':
          let formElements: Array<any> = [];
          let extensions: any = null;

          if (processInstance.nextTaskDef.extensions && typeof processInstance.nextTaskDef.extensions === 'string') {
            extensions = JSON.parse(processInstance.nextTaskDef.extensions);
          } else {
            extensions = processInstance.nextTaskDef.extensions;
          }
          if (extensions.formFields && extensions.formFields.length > 0) {
            formElements = extensions.formFields.map((formField: any) => {
              let parsedType: string = null;
              const options: any = {};
              let formFieldWidgetNameArr: Array<any>;
              let formFieldMuiPropsArr: Array<any>;
              let muiProps: any = {};

              formFieldMuiPropsArr = formField.formProperties.filter((formFieldProperty: any) => formFieldProperty.name === 'muiProps');
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
                  formFieldWidgetNameArr = formField.formProperties.filter((formFieldProperty: any) => formFieldProperty.name === 'widgetName');
                  if (formField.formProperties && formFieldWidgetNameArr && formFieldWidgetNameArr.length === 1) {
                    parsedType = formFieldWidgetNameArr[0].value;
                  }
                  formFieldWidgetNameArr = formField.formProperties.filter((formFieldProperty: any) => formFieldProperty.name === 'widgetName');
                  if (formField.formProperties && formFieldWidgetNameArr && formFieldWidgetNameArr.length === 1) {
                    parsedType = formFieldWidgetNameArr[0].value;
                  }

                  if (parsedType === 'RadioBox') {
                    options.radioButtonMuiProps = buildTheme({
                      theme: this.props.formItemTheme,
                      sourceMuiProps: {},
                      componentName: 'RadioButton',
                    }).muiProps;
                  }

                  if (parsedType === 'AutoComplete') {
                    options.autoCompleteMuiProps = buildTheme({
                      theme: this.props.formItemTheme,
                      sourceMuiProps: {},
                      componentName: 'AutoComplete',
                    }).muiProps;
                  }

                  if (formField.formValues && formField.formValues.length > 0) {
                    options.items = formField.formValues.map((formValue: any) => {
                      const value: string = formValue.id;
                      const label: string = formValue.name;
                      if (value && label) {
                        return {
                          value,
                          label,
                        };
                      }

                      return null;
                    }).filter((formValue: any) => (formValue !== null));
                  } else {
                    const formFieldItemsArr: Array<any> = formField.formProperties.filter(
                      (formFieldProperty: any) => formFieldProperty.name === 'items',
                    );
                    const formFieldDatasourceArr: Array<any> = formField.formProperties.filter(
                      (formFieldProperty: any) => formFieldProperty.name === 'datasource',
                    );
                    if (formField.formProperties && formFieldItemsArr && formFieldItemsArr.length === 1 && formFieldItemsArr[0].value) {
                      if (formFieldItemsArr[0].value.indexOf('$') === 0) {
                        const token: {} = uiData;
                        const dataProvider: Array<{}> = eval(formFieldItemsArr[0].value.substring(1));
                        if (dataProvider) {
                          let labelKey: string = 'name';
                          const formFieldLabelKeyArr: Array<any> = formField.formProperties.filter(
                            (formFieldProperty: any) => formFieldProperty.name === 'labelKey',
                          );
                          if (formField.formProperties && formFieldLabelKeyArr && formFieldLabelKeyArr.length === 1 && formFieldItemsArr[0].value) {
                            labelKey = formFieldLabelKeyArr[0].value;
                          }
                          options.items = dataProvider.map((formValue: any) => {
                            const value: string = formValue.id;
                            const label: string = eval(`formValue.${labelKey}`);
                            if (value && label) {
                              return {
                                value,
                                label,
                              };
                            }
                          });
                        }
                      } else {
                        options.items = JSON.parse(formFieldItemsArr[0].value);
                      }
                    } else if (formField.formProperties &&
                               formFieldDatasourceArr &&
                               formFieldDatasourceArr.length === 1 &&
                               formFieldDatasourceArr[0].value) {
                      if (formFieldDatasourceArr[0].value.indexOf('$') === 0) {
                        const datasource: any = JSON.parse(formFieldDatasourceArr[0].value.substring(1));
                        if (datasource) {
                          let labelKey: string = 'name';
                          const formFieldLabelKeyArr: Array<any> = formField.formProperties.filter(
                            (formFieldProperty: any) => formFieldProperty.name === 'labelKey',
                          );
                          if (formField.formProperties && formFieldLabelKeyArr && formFieldLabelKeyArr.length === 1 && formFieldItemsArr[0].value) {
                            labelKey = formFieldLabelKeyArr[0].value;
                          }

                          if (this.context.datastoreService && this.context.executionContext) {
                            let datasourceOptions: any = {
                              query: {
                                operator: 'and',
                                queries: [],
                              },
                              select: [ labelKey ],
                              limit: 10,
                            };
                            if (datasource.baseFilter && datasource.baseFilter.query) {
                              datasourceOptions.query.queries.push(datasource.baseFilter.query);
                            } else {
                              datasourceOptions = {};
                            }

                            const doFilter: Function = (searchString: string, component: React.Component<{}, {}>): void => {
                              if (searchString) {
                                const queryClause: any = {
                                  attribute: labelKey,
                                  operator: 'like',
                                  value: `%${searchString.toLowerCase()}%`,
                                  ignoreCase: true,
                                };

                                if (datasource.baseFilter && datasource.baseFilter.query) {
                                  if (datasourceOptions.query.queries.length === 1) {
                                    datasourceOptions.query.queries.push(queryClause);
                                  } else {
                                    datasourceOptions.query
                                      .queries[datasourceOptions.query.queries.length - 1] = queryClause;
                                  }

                                  datasourceOptions.query.queries.push(queryClause);
                                } else {
                                  datasourceOptions.query = queryClause;
                                }
                              }
                              this.context.datastoreService.getCollection(
                                datasource.className,
                                this.context.executionContext,
                                datasourceOptions,
                              ).then(async(result: any) => {
                                if (result) {
                                  const dataProvider: Array<{}> = result.data.map((formValue: any) => {
                                    const value: string = formValue.id;
                                    const label: string = eval(`formValue.${labelKey}`);
                                    if (value && label) {
                                      return {
                                        value,
                                        label,
                                      };
                                    }
                                  });

                                  if (component) {
                                    component.setState({
                                      items: dataProvider,
                                    });
                                  }
                                }
                              });
                            };

                            options.dataFetcher = (searchText: string, component: React.Component<{}, {}>): void => {
                              doFilter(searchText, component);
                            };

                            options.items = [];
                            muiProps.openOnFocus = true;
                            muiProps.dataSourceConfig = {
                              text: 'label',
                              value: 'value',
                            };
                            options.noFilter = true;
                          }

                        }
                      } else {
                        options.items = [];
                      }
                    }
                  }
                  if (formField.defaultValue) {
                    options.initialValue = formField.defaultValue;
                  } else {
                    // default pick first
                    if (options.items && options.items.length > 0) {
                      options.initialValue = options.items[0].value;
                    }
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
                  ...options,
                };
              }

              return null;
            }).filter((formField: any) => (formField !== null));
          }

          widget = {
            component: Form,
            isModal: this.props.modal,
            props: {
              theme: this.props.widgetTheme,
              ...this.props.uiConfig,
              layout: formElements,
            },
          };
          break;
        case 'Confirm':
          let confirmElements: Array<any> = [];
          let confirmMessage: string = '';
          let confirmImageUrl: string = null;

          const convertLayout: any = (confirmLayout: any): Array<any> => {
            return confirmLayout.map((element: any) => {
              const elementObj: any = {
                theme: this.props.confirmItemTheme,
                key: element.key,
                label: element.label,
              };

              if (element.isCancel) {
                elementObj.muiProps = {
                  primary: false,
                  secondary: true,
                };
              }

              return elementObj;
            });
          };

          if (this.props.uiConfig) {
            if (this.props.uiConfig.hasOwnProperty('message')) {
              confirmMessage = mustache.render(this.props.uiConfig.message, tokenData);
            }
            if (this.props.uiConfig.hasOwnProperty('layout')) {
              confirmElements = convertLayout(this.props.uiConfig.layout);
            }
            if (this.props.uiConfig.hasOwnProperty('imageUrl')) {
              confirmImageUrl = this.props.uiConfig.imageUrl;
            }
          } else {
            const confirmLayoutArr: Array<any> = processInstance.nextTaskDef.extensions.properties.filter(
              (property: any) => property.name === 'confirmLayout',
            );
            const confirmMessageArr: Array<any> = processInstance.nextTaskDef.extensions.properties.filter(
              (property: any) => property.name === 'confirmMessage',
            );

            if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
              confirmMessageArr && confirmLayoutArr.length === 1) {
              confirmElements = convertLayout(JSON.parse(confirmLayoutArr[0].value));
            }
            if (processInstance.nextTaskDef && processInstance.nextTaskDef.extensions && processInstance.nextTaskDef.extensions.properties &&
              confirmMessageArr && confirmMessageArr.length === 1) {
              confirmMessage = mustache.render(confirmMessageArr[0].value, tokenData);
            }
          }

          let widgetChildren: any = null;
          if (confirmImageUrl) {
            widgetChildren = <img src={confirmImageUrl}/>;
          }

          widget = {
            component: Confirm,
            isModal: this.props.modal,
            props: {
              theme: this.props.widgetTheme,
              ...this.props.uiConfig,
              layout: confirmElements,
              message: confirmMessage,
              children: [widgetChildren],
            },
          };
          break;
        default:
          break;
      }
    } else {
      widget = {
        componentClass: this.props.componentClass,
        isModal: this.props.modal,
        children: [this.props.children],
        props: {
          theme: this.props.widgetTheme,
          ...this.props.uiConfig,
          ...this.props.componentProps,
        },
      };
    }

    if (widget) {
      this.widgetConfig = widget;
    }
  }

  private handleCancel(executionContext: ExecutionContext): void {
    const { processInstance } = this.props;

    const fireCancel: any = (): void => {
      if (processInstance) {
        processInstance.doCancel(executionContext).then(() => {
          this.setState({
            canceled: true,
            processing: true,
          });
        });
      }
    };

    this.setState(
      {
        modalOpen: false,
      },
      fireCancel,
    );
  }

  private handleProceed(executionContext: ExecutionContext): void {
    const { processInstance } = this.props;

    const fireProceed: any = (): void => {
      if (processInstance) {
        processInstance.doProceed(executionContext).then(() => {
          this.setState({
            canceled: false,
            processing: true,
          });
        });
      }
    };

    if (this.props.modal) {
      this.setState(
        {
          canceled: false,
          modalOpen: false,
        },
        fireProceed,
      );
    } else {
      fireProceed();
    }
  }

  public render(): JSX.Element | Array<JSX.Element> | string | number | null | false {
    const { qflProps } = buildTheme({
      theme: this.props.theme,
      sourceMuiProps: this.props.muiProps,
      sourceQflProps: this.props.qflProps,
      componentName: 'Processable',
    });

    const { processInstance } = this.props;

    let proceedButton: any = null;
    let cancelButton: any = null;

    let widget: any = null;
    if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Table') {
      proceedButton = (
        <RaisedButton
          theme={this.props.buttonTheme}
          muiProps={{
            label: 'Auswählen',
            primary: true,
          }}
          qflProps={{
            onClick: (e: Event): void => {
              this.handleProceed(this.props.executionContext);
            },
          }}
        />
      );

      const onSelect: any = (selectedItems: any): void => {
        let selectedItem: any = null;
        if (selectedItems) {
          Object.keys(selectedItems).map((item: any) => {
            selectedItem = selectedItems[item];
          });

          if (selectedItem) {
            const mergedUiData: any = Object.assign(this.state.uiData, selectedItem);
            this.setState({
              uiData: mergedUiData,
            });
          }
        }

      };
      widget = <this.widgetConfig.component onSelectedRowsChanged={(selectedItem: any): any => onSelect(selectedItem)} {...this.widgetConfig.props}/>;
    } else if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Form') {
      proceedButton = (
        <RaisedButton
          theme={this.props.buttonTheme}
          muiProps={{
            label: 'Weiter',
            primary: true,
          }}
          qflProps={{
            onClick: (e: Event): void => {
              this.handleProceed(this.props.executionContext);
            },
          }}
        />
      );

      if (this.props.modal) {
        cancelButton = (
          <RaisedButton
            theme={this.props.buttonTheme}
            muiProps={{
              label: 'Abbrechen',
              primary: true,
            }}
            qflProps={{
              onClick: (e: Event): void => {
                this.handleCancel(this.props.executionContext);
              },
            }}
          />
        );
      }

      const onChange: any = (formData: any): void => {
        const mergedUiData: any = Object.assign(this.state.uiData, formData);
        this.setState({
          uiData: mergedUiData,
        });
      };
      widget = <this.widgetConfig.component onChange={(formData: any): any => onChange(formData)} {...this.widgetConfig.props}/>;
    } else if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Confirm') {
      const onChoose: any = (key: string): any => {
        const confirmData: any = {
          key,
        };
        const mergedUiData: any = Object.assign(this.state.uiData, confirmData);
        this.setState(
        {
          uiData: mergedUiData,
        },
        () => {
          this.handleProceed(this.props.executionContext);
        });
      };

      let childs: Array<any> = [];
      if (this.widgetConfig.props && this.widgetConfig.props.children) {
        childs = childs.concat(this.widgetConfig.props.children);
      }

      widget = (
        <this.widgetConfig.component onChoose={(key: string): any => onChoose(key)} {...this.widgetConfig.props}>
          {childs}
        </this.widgetConfig.component>
      );
    } else {
      let childs: Array<any> = [];
      if (this.widgetConfig && this.widgetConfig.children) {
        childs = childs.concat(this.widgetConfig.children);
      }

      const handleProceed: any = (componentState: any): any => {
        const mergedUiData: any = Object.assign(this.state.uiData, componentState);
        this.setState({
          uiData: mergedUiData,
        }, () => {
          this.handleProceed(this.props.executionContext);
        });
      };

      const handleCancel: any = (lastComponentState: any): any => {
        const mergedUiData: any = Object.assign(this.state.uiData, lastComponentState);
        this.setState({
          uiData: mergedUiData,
        }, () => {
          this.handleCancel(this.props.executionContext);
        });
      };

      widget = (
        <this.widgetConfig.componentClass {...this.widgetConfig.props}
                                          onProceed={(componentState: any): any => handleProceed(componentState)}
                                          onCancel={(componentState: any): any => handleCancel(componentState)}>
          {childs}
        </this.widgetConfig.componentClass>
      );
    }

    if (processInstance) {
      let tokenDataElement: any = null;
      let tokenData: any = null;
      if (processInstance && processInstance.nextTaskEntity && processInstance.nextTaskEntity.processToken &&
          processInstance.nextTaskEntity.processToken.data) {
        tokenData = processInstance.nextTaskEntity.processToken.data;
      }

      if (tokenData && this.props.isDebug) {
        tokenDataElement = (
          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              display: 'inline-block',
              top: '170px',
              left: '10px',
              padding: '0px',
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
                textAlign: 'left',
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
                  ...this.props.dialogMuiProps,
                }}
                qflProps={{
                  ...this.props.dialogQflProps,
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
              padding: '10px',
            }}
            {...qflProps}
          >
            {widget}<br/>
            {proceedButton}<br/>
            {tokenDataElement}
            <hr/>
          </div>
        );
      }

      let processingComponent: any = (<span>Bitte warten...</span>);
      if (this.state.canceled) {
        processingComponent = null;
      }

      return (
        <div
          style={{
            display: 'table',
            padding: '10px',
            margin: '0 auto',
          }}
          {...qflProps}
        >
          <div
            style={{
              display: 'table-cell',
              textAlign: 'center',
              verticalAlign: 'middle',
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
