import * as React from 'react';
import * as PropTypes from 'prop-types';

import {IDatastoreService} from '@essential-projects/data_model_contracts';

import FlatButton from '@quantusflow/frontend_mui/dist/commonjs/Buttons/FlatButton/FlatButton.js';
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

  buttonTheme?: {};
  dialogTheme?: {};
  formItemTheme?: {};
  confirmItemTheme?: {};
  widgetTheme?: {};

  processableClassName?: string;
  modalProcessableClassName?: string;
  dialogMuiProps?: {};
  dialogQflProps?: {};

  uiConfig?: any;
  uiData?: any;

  isDebug?: boolean;

  componentClass?: any;
  componentProps?: {};
  customThemeContext?: string;

  processInstanceConfig?: any;
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

    buttonTheme: null,
    dialogTheme: null,
    modal: false,
    formItemTheme: null,
    widgetTheme: null,
    confirmItemTheme: null,
    processableClassName: null,
    modalProcessableClassName: null,
    dialogMuiProps: null,
    dialogQflProps: null,

    uiConfig: null,
    uiData: {},

    isDebug: false,

    componentClass: null,
    componentProps: null,
    customThemeContext: 'custom',

    processInstanceConfig: {},
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

          let formMessage: string = null;
          let formButtonElements: Array<any> = null;

          const convertFormLayout: any = (formButtonLayout: any): Array<any> => {
            return formButtonLayout.map((element: any) => {
              const elementObj: any = {
                theme: this.props.confirmItemTheme,
                key: element.key,
                label: element.label,
                isCancel: element.isCancel,
                isProceed: element.isProceed,
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
              formMessage = mustache.render(this.props.uiConfig.message, tokenData);
            }
            if (this.props.uiConfig.hasOwnProperty('layout')) {
              formButtonElements = convertFormLayout(this.props.uiConfig.layout);
            }
          }

          if (extensions.formFields && extensions.formFields.length > 0) {
            formElements = extensions.formFields.map((formField: any, idx: number) => {
              let parsedType: string = null;
              let parsedComponentClass: any = null;
              let parsedComponentProps: any = {};
              const options: any = {};
              let formFieldWidgetNameArr: Array<any>;
              let formFieldMuiPropsArr: Array<any>;
              let muiProps: any = {};

              formFieldMuiPropsArr = formField.formProperties.filter((formFieldProperty: any) => formFieldProperty.name === 'muiProps');
              if (formField.formProperties && formFieldMuiPropsArr && formFieldMuiPropsArr.length === 1 && formFieldMuiPropsArr[0].value) {
                muiProps = JSON.parse(formFieldMuiPropsArr[0].value.replace(/\&\#34\;/gi, '"'));
              }

              if (formField.defaultValue && formField.defaultValue.indexOf('$') === 0) {
                const token: {} = uiData;
                options.initialValue = eval(formField.defaultValue.substring(1));
              } else {
                options.initialValue = formField.defaultValue;
              }

              let doShow: boolean = true;

              switch (formField.type) {
                case 'string':
                  parsedType = 'TextField';
                  formFieldWidgetNameArr = formField.formProperties.filter((formFieldProperty: any) => formFieldProperty.name === 'widgetName');
                  if (formField.formProperties && formFieldWidgetNameArr && formFieldWidgetNameArr.length === 1) {
                    parsedType = formFieldWidgetNameArr[0].value;
                  }
                  if (parsedType !== 'TextField') {
                    if (this.props.processInstanceConfig &&
                        this.props.processInstanceConfig.formItemComponentMap &&
                        this.props.processInstanceConfig.formItemComponentMap.hasOwnProperty(parsedType)) {
                      const formItemComponentClass: any = this.props.processInstanceConfig.formItemComponentMap[parsedType];
                      const formFieldConfigArr = formField.formProperties.filter((formFieldProperty: any) => formFieldProperty.name === 'config');
                      let formItemComponentProps: any = {};
                      if (formField.formProperties && formFieldConfigArr && formFieldConfigArr.length === 1) {
                        if (formFieldConfigArr[0].value.indexOf('$') === 0) {
                          const token: {} = uiData;
                          eval(`formItemComponentProps = ${formFieldConfigArr[0].value.substring(1)}`);
                        }
                      }
                      parsedComponentClass = formItemComponentClass;
                      parsedComponentProps = {
                        ...formItemComponentProps,
                      };
                    }
                  }
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

                  if (parsedType === 'RadioBox') {
                    options.radioButtonMuiProps = buildTheme({
                      theme: this.props.formItemTheme,
                      sourceMuiProps: {},
                      componentName: 'RadioButton',
                    }).muiProps;
                  }

                  if (parsedType === 'AutoComplete') {
                    options.autoCompleteMuiProps = buildTheme({
                      theme: {
                        ...this.props.formItemTheme,
                        themeContext: (idx === 0 ? 'first' : 'second'),
                      },
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
                    const formFieldShowArr: Array<any> = formField.formProperties.filter(
                      (formFieldProperty: any) => formFieldProperty.name === 'show',
                    );
                    if (formField.formProperties &&
                      formFieldShowArr &&
                      formFieldShowArr.length === 1 &&
                      formFieldShowArr[0].value) {
                      if (formFieldShowArr[0].value.indexOf('$') === 0) {
                        const token: {} = uiData;
                        eval(`doShow = ${formFieldShowArr[0].value.substring(1)}`);
                        if (!doShow) {
                          break;
                        }
                      }
                    }
                    if (doShow && formField.formProperties && formFieldItemsArr && formFieldItemsArr.length === 1 && formFieldItemsArr[0].value) {
                      if (formFieldItemsArr[0].value.indexOf('$') === 0) {
                        const token: {} = uiData;
                        const dataProvider: Array<{}> = eval(formFieldItemsArr[0].value.substring(1));
                        if (dataProvider) {
                          let labelKey: string = 'name';
                          const formFieldLabelKeyArr: Array<any> = formField.formProperties.filter(
                            (formFieldProperty: any) => formFieldProperty.name === 'labelKey',
                          );
                          if (formField.formProperties && formFieldLabelKeyArr && formFieldLabelKeyArr.length === 1 &&
                              formFieldLabelKeyArr[0].value) {
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
                    }
                    if (doShow && formField.formProperties &&
                               formFieldDatasourceArr &&
                               formFieldDatasourceArr.length === 1 &&
                               formFieldDatasourceArr[0].value) {
                      if (formFieldDatasourceArr[0].value.indexOf('$') === 0) {
                        const token: {} = uiData;
                        let datasource: any = null;

                        eval(`datasource = ${formFieldDatasourceArr[0].value.substring(1)}`);
                        if (datasource) {
                          let labelKey: string = 'name';
                          const formFieldLabelKeyArr: Array<any> = formField.formProperties.filter(
                            (formFieldProperty: any) => formFieldProperty.name === 'labelKey',
                          );
                          if (formField.formProperties && formFieldLabelKeyArr && formFieldLabelKeyArr.length === 1 && formFieldLabelKeyArr[0].value) {
                            labelKey = formFieldLabelKeyArr[0].value;
                          }

                          if (this.context.datastoreService && this.context.executionContext) {
                            let datasourceOptions: any = {
                              query: {
                                operator: 'and',
                                queries: [],
                              },
                              select: (datasource.baseFilter.select ? [ labelKey ].concat(datasource.baseFilter.select) : [ labelKey ]),
                              limit: 10,
                            };
                            if (datasource.baseFilter.expand) {
                              datasourceOptions.expandCollection = datasource.baseFilter.expand;
                            }
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
                            if (!muiProps.hasOwnProperty('openOnFocus')) {
                              muiProps.openOnFocus = true;
                            }
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
              if (parsedType && doShow) {
                return {
                  theme: this.props.formItemTheme,
                  label: formField.label,
                  type: (parsedComponentClass ? null : parsedType),
                  itemComponentClass: parsedComponentClass,
                  itemComponentProps: parsedComponentProps,
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
              layout: formElements
            },
            buttonLayout: formButtonElements,
            message: formMessage,
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
                muiProps: { ...element.muiProps }
              };

              if (element.isCancel) {
                elementObj.muiProps = {
                  primary: false,
                  secondary: true,
                  ...element.muiProps
                };
              }

              if (element.keyCode) {
                

                const handler = function (e) {
                  if (e.keyCode === this.keyCode) {

                    // document.removeEventListener('keydown', proxyFunc);
                    console.log(e.keyCode + ', ' + this.elementKey);

                    const confirmData: any = {
                      key: this.elementKey,
                    };
                    const mergedUiData: any = Object.assign(this.state.uiData, confirmData);
                    this.processable.setState(
                      {
                        uiData: mergedUiData,
                      },
                      () => {
                        this.processable.handleProceed.call(this.processable, this.processable.props.executionContext);
                      });
                  }
                }

                const binding = {
                  keyCode: element.keyCode,
                  elementKey: element.key,
                  processable: this
                };

                document.addEventListener('keydown', (e) => {
                  handler.call(binding, e);
                });
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
            const imgProps = this.props.uiConfig ? this.props.uiConfig.imgProps : {};
            widgetChildren = <img src={confirmImageUrl}  {...imgProps}/>;
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
    const moreButtons: Array<any> = [];

    let widget: any = null;
    let themeContext: string = null;
    if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Table') {
      themeContext = 'selectableList';
      proceedButton = (
        <FlatButton
          theme={{
            ...(this.props.buttonTheme),
            themeContext: 'proceed',
          }}
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
      themeContext = 'form';
      const preceedingText: string = this.widgetConfig.message;
      const buttonLayout: Array<any> = this.widgetConfig.buttonLayout;
      proceedButton = (
        <FlatButton
          theme={{
            ...(this.props.buttonTheme),
            themeContext: 'proceed',
          }}
          muiProps={{
            label: 'Weiter',
            primary: true,
            onClick: (e: Event): void => {
              this.handleProceed(this.props.executionContext);
            },
          }}
        />
      );

      if (this.props.modal) {
        cancelButton = (
          <FlatButton
            theme={{
              ...(this.props.buttonTheme),
              themeContext: 'cancel',
            }}
            muiProps={{
              label: 'Abbrechen',
              primary: true,
              onClick: (e: Event): void => {
                this.handleCancel(this.props.executionContext);
              },
            }}
          />
        );

        if (buttonLayout && buttonLayout.length > 0) {
          for (const button of buttonLayout) {
            if (button.isCancel) {
              cancelButton = null;
            }
            if (button.isProceed) {
              proceedButton = null;
            }

            moreButtons.push(
              <FlatButton
                theme={{
                  ...(this.props.buttonTheme),
                  themeContext: button.isCancel ? 'cancel' : '',
                }}
                muiProps={{
                  label: button.label,
                  ...button.muiProps,
                  onClick: (e: Event): void => {
                    if (button.isCancel) {
                      this.state.uiData.key = button.key;
                      this.handleProceed(this.props.executionContext);

                    } else {
                      this.handleProceed(this.props.executionContext);
                    }
                  },
                }}
              />,
            );
          }
        }
      }

      const onChange: any = (formData: any): void => {
        const mergedUiData: any = Object.assign(this.state.uiData, formData);
        this.setState({
          uiData: mergedUiData,
        });
      };
      widget = (
        <div style={{
          maxHeight: 'inherit',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          <div>{preceedingText}</div>
          <this.widgetConfig.component onChange={(formData: any): any => onChange(formData)} {...this.widgetConfig.props}/>
        </div>
      );
    } else if (this.widgetConfig && this.widgetConfig.component && this.widgetConfig.component.name === 'Confirm') {
      themeContext = 'confirm';
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
      themeContext = this.props.customThemeContext;
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
          const dcProps = buildTheme({
            theme: this.props.theme,
            sourceMuiProps: this.props.muiProps,
            sourceQflProps: this.props.qflProps,
            componentName: 'DialogContainer',
          });

          return (
            <div {...dcProps.qflProps}>
              <Dialog
                theme={{
                  ...this.props.dialogTheme,
                  themeContext,
                }}
                muiProps={{
                  title: processInstance.nextTaskDef.name,
                  actions: [proceedButton, cancelButton].concat(moreButtons),
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
          <div {...qflProps}>
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
        <div {...qflProps}>
          {processingComponent}
          <hr/>
        </div>
      );
    }

    return null;
  }
}
