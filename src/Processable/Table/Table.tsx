import * as React from 'react';

import RaisedButton from '@quantusflow/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js';
import DropDown from '@quantusflow/frontend_mui/dist/commonjs/InputForms/DropDown/DropDown.js';
import TextField from '@quantusflow/frontend_mui/dist/commonjs/InputForms/TextField/TextField.js';
import Table from '@quantusflow/frontend_mui/dist/commonjs/Tables/Table/Table.js';
import {ProcessableContainer} from '../ProcessableContainer';

import MenuItem from 'material-ui/MenuItem/MenuItem.js';
import {TableOverlay} from './TableOverlay';

const $: any = require('jquery'); // tslint:disable-line no-require-imports no-var-requires

import {ExecutionContext} from '@essential-projects/core_contracts';
import {IMUIProps} from '@quantusflow/frontend_mui/dist/interfaces';
import {IProcessable, IProcessEngineClientApi, IProcessInstance} from '@quantusflow/process_engine_client_api';

export interface ITableProps extends IMUIProps {
  tableKey: string;

  dataClassName: string;
  dataClassesName: string;

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

  processButtonTheme?: {};
  processDialogTheme?: {};
  processFormItemTheme?: {};
  processConfirmItemTheme?: {};
  processWidgetTheme?: {};
  processTheme?: {};

  itemBasedButtonTheme?: {};
  itemBasedMoreButtonTheme?: {};
  listBasedButtonTheme?: {};
  listBasedMoreButtonTheme?: {};
  filterMenuTheme?: {};
  baseFilterMenuTheme?: {};
  search?: Boolean;
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
  listBasedButtonMuiProps?: {};
  listBasedButtonQflProps?: {};
  listBasedButtonProps?: {};

  listBasedMoreButtonMuiProps?: {};
  listBasedMoreButtonQflProps?: {};
  listBasedMoreButtonProps?: {};

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
    checkBoxClassName?: string;
    headerContainerClassName?: string;
    itemBasedElementsClassName?: string;
    listBasedElementsClassName?: string;
    headerElementsPlaceHolderClassName?: string;
    filterMenuElementsClassName?: string;
    baseFilterMenuElementsClassName?: string;
    tableWithFrameClassName?: string;
    tableWithoutFrameClassName?: string;
    createButtonClassName?: string;
    contentOverlayClassName?: string;
    tableBarClassName?: string;
    itemHeaderClassName?: string;
    searchFieldClassName?: string;
    itemBasedMoreButtonClassName?: string;
    listBasedMoreButtonClassName?: string;
    itemBasedMoreMenuClassName?: string;
    listBasedMoreMenuClassName?: string;
    itemBasedButtonClassName?: string;
    itemBasedDisabledButtonClassName?: string;
    listBasedButtonClassName?: string;
    tableRowClassName?: string;
    tableHeaderRowClassName?: string;
    tableColumnSelectorClassName?: string;
    tableHeaderColumnSelectorClassName?: string;
    tableClassName?: string;
  };

  tableTheme?: {};
  tableOverlayTheme?: {};
  tableSelectorTheme?: {};

  createComponentProps?: {};
  createComponentMap?: {};
  createProcessInstanceConfig?: {};
}

export interface ITableState {
  isItemBasedMoreMenuOpened?: boolean;
  isListBasedMoreMenuOpened?: boolean;
  selectedRows?: {};
  searchValue?: string;

  createOnProcessEnded?: Function;
  createProcessableContainer?: React.ReactNode;

  currentItemProcessKey?: string;
  currentItemComponentMap?: {};
  currentItemComponentProps?: {};
  currentItemProcessInstanceConfig?: {};
  currentItemProcessKeySkipClean?: boolean;
  currentItemOnProcessEnded?: Function;
  itemProcessableContainer?: React.ReactNode;
}

export class ProcessableTable extends React.Component<ITableProps, ITableState> implements IProcessable {
  public static defaultProps: {} = {
    tableKey: (new Date()).getTime(),

    theme: null,
    muiProps: {},
    qflProps: {},

    title: null,
    frame: true,
    searchKeyDelay: 250,
    tableStyles: {
      checkBoxClassName: null,
      headerContainerClassName: null,
      itemBasedElementsClassName: null,
      listBasedElementsClassName: null,
      headerElementsPlaceHolderClassName: null,
      filterMenuElementsClassName: null,
      baseFilterMenuElementsClassName: null,
      tableWithFrameClassName: null,
      tableWithoutFrameClassName: null,
      createButtonClassName: null,
      contentOverlayClassName: null,
      tableBarClassName: null,
      itemHeaderClassName: null,
      searchFieldClassName: null,
      itemBasedMoreButtonClassName: null,
      listBasedMoreButtonClassName: null,
      itemBasedMoreMenuClassName: null,
      listBasedMoreMenuClassName: null,
      itemBasedButtonClassName: null,
      listBasedButtonClassName: null,
      tableRowClassName: null,
      tableHeaderRowClassName: null,
      tableColumnSelectorClassName: null,
      tableHeaderColumnSelectorClassName: null,
    },
    tableOverlayStyles: {
      menuHeaderClassName: null,
      menuItemClassName: null,
    },

    createProcessKey: null,
    createStartToken: null,

    createButtonMuiProps: null,
    createButtonQflProps: null,
    createButtonProps: null,
    createButtonTheme: null,

    processButtonTheme: null,
    processDialogTheme: null,
    processFormItemTheme: null,
    processConfirmItemTheme: null,
    processWidgetTheme: null,
    processTheme: null,

    itemBasedButtonTheme: null,
    itemBasedMoreButtonTheme: null,
    listBasedButtonTheme: null,
    listBasedMoreButtonTheme: null,
    filterMenuTheme: null,
    baseFilterMenuTheme: null,
    search: true,
    searchFieldTheme: null,

    onSearch: null,
    searchFieldMuiProps: null,
    searchFieldQflProps: null,
    searchFieldProps: null,
    searchValue: null,
    tableProps: {
      rbtProps: {},
    },
    data: null,
    controlledHeight: null,

    itemBasedButtonSchema: null,
    itemBasedButtonMuiProps: null,
    itemBasedButtonQflProps: null,
    itemBasedButtonProps: null,

    itemBasedMoreButtonMuiProps: null,
    itemBasedMoreButtonQflProps: null,
    itemBasedMoreButtonProps: null,

    listBasedButtonSchema: null,
    listBasedButtonMuiProps: null,
    listBasedButtonQflProps: null,
    listBasedButtonProps: null,

    listBasedMoreButtonMuiProps: null,
    listBasedMoreButtonQflProps: null,
    listBasedMoreButtonProps: null,

    filterMenuSchema: null,
    onFilterChange: null,

    baseFilterMenuSchema: null,

    onCreateProcessEnded: null,
    onItemProcessEnded: null,

    tableTheme: null,
    tableOverlayTheme: null,
    tableSelectorTheme: null,

    createComponentProps: null,
    createComponentMap: null,
    createProcessInstanceConfig: null,
  };

  private delay: any = ((): any => {
    let timer: NodeJS.Timer = null;

    return (callback: (...args: Array<any>) => void, ms: number): void => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  public itemBasedMoreMenuId: string = 'itemBasedMoreMenu';
  public listBasedMoreMenuId: string = 'listBasedMoreMenu';

  constructor(props: ITableProps) {
    super(props);

    this.state = {
      isItemBasedMoreMenuOpened: false,
      isListBasedMoreMenuOpened: false,
      selectedRows: {},
      searchValue: props.searchValue,

      createOnProcessEnded: null,
      createProcessableContainer: null,

      currentItemProcessKey: null,
      currentItemComponentMap: null,
      currentItemComponentProps: null,
      currentItemProcessInstanceConfig: null,
      currentItemProcessKeySkipClean: false,
      currentItemOnProcessEnded: null,
      itemProcessableContainer: null,
    };
  }

  private renderProcessContainer(processInstance: IProcessInstance, uiName: string, uiConfig?: any, uiData?: any): void {
    const themes: any = {
      buttonTheme: this.props.processButtonTheme,
      dialogTheme: this.props.processDialogTheme,
      formItemTheme: this.props.processFormItemTheme,
      confirmItemTheme: this.props.processConfirmItemTheme,
      widgetTheme: this.props.processWidgetTheme,
      theme: this.props.processTheme,
    };

    const createProcessName: string = (
      this.props.createProcessKey !== 'Create' ?
        this.props.createProcessKey :
        this.props.createProcessKey + this.props.dataClassName
    );

    switch (processInstance.processKey) {
      case (createProcessName):
        let createProcessableComponent: any = null;
        if (this.props.createComponentMap && this.props.createComponentMap.hasOwnProperty(uiName)) {
          createProcessableComponent = this.props.createComponentMap[uiName];
        }

        const createProcessableContainer: any = (
          <ProcessableContainer modal={true} key={processInstance.nextTaskEntity.id}
                                processInstance={processInstance} executionContext={this.props.executionContext}
                                uiName={uiName} uiConfig={uiConfig} uiData={uiData} {...themes}
                                componentClass={createProcessableComponent} componentProps={this.props.createComponentProps}
                                processInstanceConfig={this.props.createProcessInstanceConfig}/>
        );
        this.setState({
          createProcessableContainer,
        });
        break;
      case (this.state.currentItemProcessKey):
        let itemProcessableComponent: any = null;
        if (this.state.currentItemComponentMap && this.state.currentItemComponentMap.hasOwnProperty(uiName)) {
          itemProcessableComponent = this.state.currentItemComponentMap[uiName];
        }

        const itemProcessableContainer: any = (
          <ProcessableContainer modal={true} key={processInstance.nextTaskEntity.id}
                                processInstance={processInstance} executionContext={this.props.executionContext}
                                uiName={uiName} uiConfig={uiConfig} uiData={uiData} {...themes}
                                componentClass={itemProcessableComponent} componentProps={this.state.currentItemComponentProps}
                                processInstanceConfig={this.state.currentItemProcessInstanceConfig}/>
        );
        this.setState({
          itemProcessableContainer,
        });
        break;
      default:
    }
  }

  public async handleUserTask(processInstance: IProcessInstance, uiName: string, uiConfig?: any, uiData?: any): Promise<void> {
    this.renderProcessContainer(processInstance, uiName, uiConfig, uiData);
  }

  public async handleManualTask(processInstance: IProcessInstance, uiName: string, uiConfig?: any, uiData?: any): Promise<void> {
    return;
  }

  public async handleEvent(processInstance: IProcessInstance, eventType: string, eventData?: any): Promise<void> {
    return;
  }

  public async handleCancel(processInstance: IProcessInstance): Promise<void> {
    return;
  }

  public async handleEndEvent(processInstance: IProcessInstance, endEventData?: any): Promise<void> {
    const createProcessName: string = (
      this.props.createProcessKey !== 'Create' ?
        this.props.createProcessKey :
        this.props.createProcessKey + this.props.dataClassName
    );
    switch (processInstance.processKey) {
      case (createProcessName):
        this.setState(
          {
            createProcessableContainer: null,
          },
          () => {
            if (this.state.createOnProcessEnded) {
              this.state.createOnProcessEnded(endEventData);
            }
          },
        );
      case (this.state.currentItemProcessKey):
        this.setState(
          {
            itemProcessableContainer: null,
          },
          () => {
            if (this.state.currentItemOnProcessEnded) {
              this.state.currentItemOnProcessEnded(this.state.currentItemProcessKey, endEventData);
            }
            if (this.props.onItemProcessEnded) {
              this.props.onItemProcessEnded(this.state.currentItemProcessKey, endEventData, this.state.currentItemProcessKeySkipClean);
            }
          },
        );
        break;
      default:
    }
  }

  private async handleStartCreate(startToken: any, onProcessEnded?: Function, done?: Function): Promise<void> {
    if (this.props.processEngineClientApi) {
      const createProcessName: string = (
        this.props.createProcessKey !== 'Create' ?
          this.props.createProcessKey :
          this.props.createProcessKey + this.props.dataClassName
      );

      await this.props.processEngineClientApi.startProcess(
        (createProcessName),
        this,
        this.props.executionContext,
        (startToken ? (typeof startToken === 'function' ? startToken() : startToken ) : null),
      );
      if (done) {
        done();
      }
      this.setState({
        createOnProcessEnded: onProcessEnded,
      });
    }
  }

  private async handleStartItem(processKey: string,
                                startToken: any,
                                onProcessEnded?: Function,
                                skipClean?: boolean,
                                done?: Function,
                                componentMap?: {},
                                componentProps?: {},
                                processInstanceConfig?: {}): Promise<void> {
    if (this.props.processEngineClientApi) {
      await this.props.processEngineClientApi.startProcess(
        processKey,
        this,
        this.props.executionContext,
        startToken,
      );
      if (done) {
        done();
      }
      this.setState({
        currentItemOnProcessEnded: onProcessEnded,
        currentItemProcessKey: processKey,
        currentItemComponentMap: componentMap,
        currentItemComponentProps: componentProps,
        currentItemProcessInstanceConfig: processInstanceConfig,
        currentItemProcessKeySkipClean: skipClean,
      });
    }
  }

  private handleItemClicked(item: any): void {
    this.setState({
      isItemBasedMoreMenuOpened: false,
      isListBasedMoreMenuOpened: false,
    });

    const selectedItems: Array<any> = [];
    if (this.state.selectedRows) {
      Object.keys(this.state.selectedRows).forEach((key: string) => {
        selectedItems.push(this.state.selectedRows[key]);
      });
    }
    if (selectedItems && selectedItems.length > 0 && item && item.processableKey) {
      let startToken: any = null;
      if (selectedItems.length === 1) {
        startToken = { id: selectedItems[0].id };
        if (item.startTokenTransformer) {
          startToken = item.startTokenTransformer(startToken, selectedItems[0]);
        }
      } else {
        startToken = selectedItems.map((selectedItem: any) => {
          let resultToken: any = { id: selectedItem.id };
          if (item.startTokenTransformer) {
            resultToken = item.startTokenTransformer(resultToken, selectedItem);
          }

          return resultToken;
        });
      }
      this.handleStartItem(
        item.processableKey,
        startToken,
        item.onProcessEnded,
        item.skipClean,
        item.componentMap,
        item.componentProps,
        item.processInstanceConfig,
      );
    }
  }

  private handleSelectedRowsChanged(selectedRows: any): void {
    this.setState({
      selectedRows,
    });
  }

  public cleanSelected(): void {
    const refs: any = this.refs;
    if (refs && refs[`listBoxTable_${this.props.tableKey}`] && refs[`listBoxTable_${this.props.tableKey}`].cleanSelected) {
      refs[`listBoxTable_${this.props.tableKey}`].cleanSelected();
    }
  }

  private handleFilterItemChange(key: string, oldValue: any, newValue: any, choosenElement: any, element: any): void {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(key, newValue, choosenElement, element);
    }
  }

  public render(): JSX.Element | Array<JSX.Element> | string | number | null | false {
    let newClassName: string = null;
    if (this.props.frame === true) {
      newClassName = this.props.tableStyles.tableWithFrameClassName;
    } else {
      newClassName = this.props.tableStyles.tableWithoutFrameClassName;
    }

    const { rbtProps } = (this.props.tableProps || { rbtProps: {} });

    const processables: Array<any> = [];

    let createButton: any = null;
    if (this.props.createProcessKey) {
      createButton = (
        <RaisedButton
          theme={this.props.createButtonTheme}
          muiProps={{
            primary: true,
            className: this.props.tableStyles.createButtonClassName,
            onClick: (e: Event): void => {
              this.handleStartCreate(this.props.createStartToken, this.props.onCreateProcessEnded);
            },
            ...this.props.createButtonMuiProps,
          }}
          qflProps={{
            ...this.props.createButtonQflProps,
          }}
          {...this.props.createButtonProps}
        />
      );

      const createProcessContainer: any = this.state.createProcessableContainer;
      processables.push(createProcessContainer);
    }

    let filterMenuElements: Array<any> = [];
    if (this.props.filterMenuSchema && this.props.filterMenuSchema.length > 0) {
      filterMenuElements = this.props.filterMenuSchema.map((filterMenuSchemaItem: any) => (
        <DropDown
          key={filterMenuSchemaItem.key}
          theme={filterMenuSchemaItem.theme}
          value={filterMenuSchemaItem.currentValue}
          items={filterMenuSchemaItem.items.map((dropDownItem: any, dropDownItemIdx: number) => <MenuItem
            key={`${filterMenuSchemaItem.key}-${dropDownItemIdx}`}
            value={dropDownItem.value}
            primaryText={dropDownItem.label}
          />)}
          muiProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            floatingLabelText: filterMenuSchemaItem.label,
            ...filterMenuSchemaItem.muiProps,
          }}
          onChange={(event: any, index: number, oldValue: any, newValue: any): any => this.handleFilterItemChange(
            filterMenuSchemaItem.key, oldValue, newValue, filterMenuSchemaItem.items[index], filterMenuSchemaItem)}
          qflProps={{
            ...filterMenuSchemaItem.qflProps,
          }}
        />
      ));
    }

    let itemBasedElements: Array<any> = [];
    if (Object.keys(this.state.selectedRows).length > 0) {
      if (this.props.itemBasedButtonSchema && this.props.itemBasedButtonSchema.length > 0) {
        itemBasedElements = itemBasedElements.concat(this.props.itemBasedButtonSchema.filter((buttonSchemaItem: any) => {
          let visibleState: boolean = true;
          if (buttonSchemaItem.visibleCondition) {
            visibleState = buttonSchemaItem.visibleCondition(this.state.selectedRows);
          }

          if (!buttonSchemaItem.multiple && Object.keys(this.state.selectedRows).length > 1) {
            return false;
          }

          return (visibleState && !buttonSchemaItem.isMore);
        }).map((buttonSchemaItem: any, buttonSchemaIdx: number) => {
          const itemBasedButtonProcessContainer: any = this.state.itemProcessableContainer;
          processables.push(itemBasedButtonProcessContainer);

          let disableState: boolean = false;
          if (buttonSchemaItem.disableCondition) {
            disableState = buttonSchemaItem.disableCondition(this.state.selectedRows);
          }

          let icon: any = buttonSchemaItem.icon;
          if (icon && typeof icon === 'function') {
            icon = icon(disableState);
          }

          return (
            <RaisedButton
              theme={this.props.itemBasedButtonTheme}
              muiProps={{
                icon,
                primary: true,
                className: (
                  !disableState
                  ? this.props.tableStyles.itemBasedButtonClassName
                  : this.props.tableStyles.itemBasedDisabledButtonClassName
                ),
                onClick: (e: Event): void => {
                  this.handleItemClicked.bind(this, buttonSchemaItem)();
                },
                ...this.props.itemBasedButtonMuiProps,
                disabled: disableState,
              }}
              qflProps={{
                ...this.props.itemBasedButtonQflProps,
              }}
              {...this.props.itemBasedButtonProps}
            />
          );
        }));

        const itemBasedMoreButtons: any = this.props.itemBasedButtonSchema.filter((buttonSchemaItem: any) => {
          let visibleState: boolean = true;
          if (buttonSchemaItem.visibleCondition) {
            visibleState = buttonSchemaItem.visibleCondition(this.state.selectedRows);
          }

          if (!buttonSchemaItem.multiple && Object.keys(this.state.selectedRows).length > 1) {
            return false;
          }

          return (visibleState && buttonSchemaItem.isMore);
        });
        if (itemBasedMoreButtons.length > 0) {
          const menuSchema: Array<any> = [{
            sectionName: null,
            items: itemBasedMoreButtons.map((buttonSchemaItem: any) => {
              const itemBasedButtonProcessContainer: any = this.state.itemProcessableContainer;
              processables.push(itemBasedButtonProcessContainer);

              let disableState: boolean = false;
              if (buttonSchemaItem.disableCondition) {
                disableState = buttonSchemaItem.disableCondition(this.state.selectedRows);
              }

              return {
                label: buttonSchemaItem.name,
                key: buttonSchemaItem.key,
                disabled: disableState,
              };
            }),
          }];

          itemBasedElements = itemBasedElements.concat([
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
              }}
            >
              <RaisedButton
                theme={this.props.itemBasedMoreButtonTheme}
                muiProps={{
                  labelPosition: 'before',
                  label: 'MEHR',
                  primary: true,
                  className: this.props.tableStyles.itemBasedMoreButtonClassName,
                  onClick: (e: Event): void => {
                    if (!this.state.isItemBasedMoreMenuOpened) {
                      $(window.document).on('click', (ce: any): void => {
                        if (ce.originalEvent && ce.originalEvent.path.filter((item: any) => item.id === this.itemBasedMoreMenuId).length === 0) {
                          $(window.document).off('click');
                          this.setState({
                            isItemBasedMoreMenuOpened: false,
                          });
                        }
                      });
                    }
                    this.setState({
                      isItemBasedMoreMenuOpened: !this.state.isItemBasedMoreMenuOpened,
                    });
                  },
                  ...this.props.itemBasedMoreButtonMuiProps,
                }}
                qflProps={{
                  style: {
                    width: 'auto',
                    display: 'inline-block',
                  },
                  ...this.props.itemBasedMoreButtonQflProps,
                }}
                {...this.props.itemBasedMoreButtonProps}
              />
              <div
                id={this.itemBasedMoreMenuId}
                className={this.props.tableStyles.itemBasedMoreMenuClassName}
                style={{
                  display: (this.state.isItemBasedMoreMenuOpened ? 'block' : 'none'),
                }}
              >
                <TableOverlay
                  menuSchema={menuSchema}
                  tableOverlayStyles={this.props.tableOverlayStyles}
                  theme={this.props.tableOverlayTheme}
                  onMenuItemClicked={(key: string): void => {
                    const matchedButtonSchemaItems: any = itemBasedMoreButtons.filter(
                      (itemBasedMoreButtonItem: any) => (itemBasedMoreButtonItem.key === key),
                    );
                    let buttonSchemaItem: any = null;
                    if (matchedButtonSchemaItems.length === 1) {
                      buttonSchemaItem = matchedButtonSchemaItems[0];
                    }
                    if (buttonSchemaItem) {
                      this.handleItemClicked.bind(this, buttonSchemaItem)();
                    }
                  }}
                />
              </div>
            </div>,
          ]);
        }
      }
    }

    let listBasedElements: Array<any> = [];

    if (this.props.listBasedButtonSchema &&
        this.props.listBasedButtonSchema.items &&
        this.props.listBasedButtonSchema.items.length > 0) {
      listBasedElements = listBasedElements.concat(this.props.listBasedButtonSchema.items.filter((buttonSchemaItem: any) => {
        return !buttonSchemaItem.isMore;
      }).map((buttonSchemaItem: any, buttonSchemaIdx: number) => {
        if (buttonSchemaItem.processableKey) {
          const listBasedButtonProcessContainer: any = this.state.itemProcessableContainer;
          processables.push(listBasedButtonProcessContainer);
        }

        return (
          <RaisedButton
            theme={this.props.listBasedButtonTheme}
            muiProps={{
              icon: buttonSchemaItem.icon,
              primary: true,
              className: this.props.tableStyles.listBasedButtonClassName,
              onClick: (e: Event): void => {
                this.handleItemClicked.bind(this, buttonSchemaItem)();
              },
              ...this.props.listBasedButtonMuiProps,
            }}
            qflProps={{
              ...this.props.listBasedButtonQflProps,
            }}
            {...this.props.listBasedButtonProps}
          />
        );
      }));

      const listBasedMoreButtons: any = this.props.listBasedButtonSchema.items.filter((buttonSchemaItem: any) => {
        return buttonSchemaItem.isMore;
      });
      if (listBasedMoreButtons.length > 0) {
        const menuSchema: Array<any> = [{
          sectionName: null,
          items: listBasedMoreButtons.map((buttonSchemaItem: any) => {
            if (buttonSchemaItem.processableKey) {
              const listBasedButtonProcessContainer: any = this.state.itemProcessableContainer;
              processables.push(listBasedButtonProcessContainer);
            }

            return {
              label: buttonSchemaItem.name,
              key: buttonSchemaItem.key,
            };
          }),
        }];

        listBasedElements = listBasedElements.concat([
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <RaisedButton
              theme={this.props.listBasedMoreButtonTheme}
              muiProps={{
                labelPosition: 'before',
                label: (this.props.listBasedButtonSchema.label ? this.props.listBasedButtonSchema : 'MEHR'),
                primary: true,
                className: this.props.tableStyles.listBasedMoreButtonClassName,
                onClick: (e: Event): void => {
                  if (!this.state.isListBasedMoreMenuOpened) {
                    $(window.document).on('click', (ce: any): void => {
                      if (ce.originalEvent && ce.originalEvent.path.filter((item: any) => item.id === this.listBasedMoreMenuId).length === 0) {
                        $(window.document).off('click');
                        this.setState({
                          isListBasedMoreMenuOpened: false,
                        });
                      }
                    });
                  }
                  this.setState({
                    isListBasedMoreMenuOpened: !this.state.isListBasedMoreMenuOpened,
                  });
                },
                ...this.props.listBasedMoreButtonMuiProps,
              }}
              qflProps={{
                style: {
                  width: 'auto',
                  display: 'inline-block',
                },
                ...this.props.listBasedMoreButtonQflProps,
              }}
              {...this.props.listBasedMoreButtonProps}
            />,
            <div
              id={this.listBasedMoreMenuId}
              className={this.props.tableStyles.listBasedMoreMenuClassName}
              style={{
                display: (this.state.isListBasedMoreMenuOpened ? 'block' : 'none'),
              }}
            >
              <TableOverlay
                menuSchema={menuSchema}
                tableOverlayStyles={this.props.tableOverlayStyles}
                theme={this.props.tableOverlayTheme}
                onMenuItemClicked={(key: string): void => {
                  const matchedButtonSchemaItems: any = listBasedMoreButtons.filter(
                    (itemBasedMoreButtonItem: any) => (itemBasedMoreButtonItem.key === key),
                  );
                  let buttonSchemaItem: any = null;
                  if (matchedButtonSchemaItems.length === 1) {
                    buttonSchemaItem = matchedButtonSchemaItems[0];
                  }
                  if (buttonSchemaItem) {
                    this.handleItemClicked.bind(this, buttonSchemaItem)();
                  }
                }}
              />
            </div>
          </div>,
        ]);
      }
    } else if (this.props.listBasedButtonSchema &&
               !this.props.listBasedButtonSchema.items &&
               (this.props.listBasedButtonSchema.menuSchema || this.props.listBasedButtonSchema.overlayComponent)) {
      let overlayComponent: JSX.Element = (
        <TableOverlay
          menuSchema={this.props.listBasedButtonSchema.menuSchema}
          tableOverlayStyles={this.props.tableOverlayStyles}
          theme={this.props.tableOverlayTheme}
          onMenuItemClicked={(item: {}): void => {
            if (item) {
              this.handleItemClicked.bind(this, item)();
            }
          }}
        />
      );

      if (this.props.listBasedButtonSchema.overlayComponent && !this.props.listBasedButtonSchema.menuSchema) {
        overlayComponent = this.props.listBasedButtonSchema.overlayComponent;
      }

      let menuOverlay: JSX.Element = null;
      if (this.state.isListBasedMoreMenuOpened) {
        menuOverlay = (
          <div
            id={this.listBasedMoreMenuId}
            className={this.props.tableStyles.listBasedMoreMenuClassName}
            style={{
              display: 'block',
            }}
          >
            {overlayComponent}
          </div>
        );
      }

      listBasedElements = listBasedElements.concat([
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <RaisedButton
            theme={this.props.listBasedMoreButtonTheme}
            muiProps={{
              labelPosition: 'before',
              label: (this.props.listBasedButtonSchema.label ? this.props.listBasedButtonSchema.label : 'MEHR'),
              primary: true,
              className: this.props.tableStyles.listBasedMoreButtonClassName,
              onClick: (e: Event): void => {
                if (!this.state.isListBasedMoreMenuOpened) {
                  $(window.document).on('click', (ce: any): void => {
                    if (ce.originalEvent && ce.originalEvent.path.filter((item: any) => item.id === this.listBasedMoreMenuId).length === 0) {
                      $(window.document).off('click');
                      this.setState({
                        isListBasedMoreMenuOpened: false,
                      });
                    }
                  });
                }
                this.setState({
                  isListBasedMoreMenuOpened: !this.state.isListBasedMoreMenuOpened,
                });
              },
              ...this.props.listBasedMoreButtonMuiProps,
            }}
            qflProps={{
              style: {
                width: 'auto',
                display: 'inline-block',
              },
              ...this.props.listBasedMoreButtonQflProps,
            }}
            {...this.props.listBasedMoreButtonProps}
          />
          {menuOverlay}
        </div>,
      ]);
    }

    let baseFilterElements: Array<any> = [];
    if (this.props.baseFilterMenuSchema && this.props.baseFilterMenuSchema.length > 0) {
      baseFilterElements = baseFilterElements.concat(
        this.props.baseFilterMenuSchema.map((baseFilterSchemaItem: any, baseFilterSchemaItemIdx: number): any => (
          <DropDown
            key={baseFilterSchemaItem.key}
            theme={baseFilterSchemaItem.theme}
            value={baseFilterSchemaItem.currentValue}
            items={baseFilterSchemaItem.items.map((dropDownItem: any, dropDownItemIdx: number): any => <MenuItem
              key={`${baseFilterSchemaItem.key}-${dropDownItemIdx}`}
              value={dropDownItem.value}
              primaryText={dropDownItem.label}
            />)}
            muiProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              floatingLabelText: baseFilterSchemaItem.label,
              ...baseFilterSchemaItem.muiProps,
            }}
            onChange={(event: Event, index: number, oldValue: any, newValue: any): any => this.handleFilterItemChange(
              baseFilterSchemaItem.key, oldValue, newValue, baseFilterSchemaItem.items[index], baseFilterSchemaItem)}
            qflProps={{
              ...baseFilterSchemaItem.qflProps,
            }}
          />
        )),
      );
    }

    let searchField: any = null;
    if (this.props.search && this.props.onSearch) {
      searchField = (
        <TextField
          watch
          value={this.state.searchValue}
          theme={this.props.searchFieldTheme}
          muiProps={{
            hintText: 'Suchen',
            className: this.props.tableStyles.searchFieldClassName,
            ...this.props.searchFieldMuiProps,
          }}
          qflProps={{
            style: {
              verticalAlign: 'top',
              display: 'inline-block',
              position: 'relative',
            },
            ...this.props.searchFieldQflProps,
          }}
          {...this.props.searchFieldProps}
          onChange={(oldValue: any, newValue: any, e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (this.props.onSearch) {
              this.delay(
                () => {
                  this.props.onSearch(newValue);
                },
                (e && e.keyCode === 13 ? 0 : this.props.searchKeyDelay), // tslint:disable-line no-magic-numbers
              );
            }
          }}
        />
      );
    }

    let titleElement: JSX.Element = null;
    if (this.props.title) {
      titleElement = (
        <div className={this.props.tableStyles.itemHeaderClassName}>
          {this.props.title}
        </div>
      );
    }

    return (
      <div className={newClassName}>
        {titleElement}
        <div className={this.props.tableStyles.tableBarClassName}>
          {createButton}{searchField}
          <div className={this.props.tableStyles.filterMenuElementsClassName}>{filterMenuElements}</div>
          <div className={this.props.tableStyles.itemBasedElementsClassName}>{itemBasedElements}</div>
          <div className={this.props.tableStyles.listBasedElementsClassName}>{listBasedElements}</div>
          <div className={this.props.tableStyles.headerElementsPlaceHolderClassName}/>
          <div className={this.props.tableStyles.baseFilterMenuElementsClassName}>{baseFilterElements}</div>
        </div>

        <div
          style={{
            display: (this.state.isItemBasedMoreMenuOpened || this.state.isListBasedMoreMenuOpened ? 'block' : 'none'),
          }}
          className={this.props.tableStyles.contentOverlayClassName}
        />

        <Table
          ref={`listBoxTable_${this.props.tableKey}`}
          tableKey={this.props.tableKey}

          theme={this.props.tableTheme}
          selectorTheme={this.props.tableSelectorTheme}
          onSelectedRowsChanged={(selectedRows: any): any => {
            this.handleSelectedRowsChanged(selectedRows);
          }}
          {...this.props.tableProps}
          checkBoxClassName={this.props.tableStyles.checkBoxClassName}
          rbtProps={{
            data: this.props.data,
            headerContainerClass: this.props.tableStyles.headerContainerClassName,
            columnFilter: false,
            search: false,
            striped: true,
            hover: true,
            condensed: true,
            pagination: false,
            insertRow: false,
            deleteRow: false,
            trClassName: this.props.tableStyles.tableRowClassName,
            tableHeaderClass: this.props.tableStyles.tableHeaderRowClassName,
            selectRowTdClassName: this.props.tableStyles.tableColumnSelectorClassName,
            selectRowHeaderTdClassName: this.props.tableStyles.tableHeaderColumnSelectorClassName,
            tableBodyClass: this.props.tableStyles.tableClassName,
            ...rbtProps,
          }}
          stylingProps={{
            containerStyle: {
              height: `${this.props.controlledHeight}px`,
            },
            tableStyle: {
              height: `${(this.props.controlledHeight - 10)}px`, // tslint:disable-line no-magic-numbers
            },
            headerStyle: {
              height: '35px',
            },
            bodyStyle: {
              height: `${(this.props.controlledHeight - 10 - 35)}px`, // tslint:disable-line no-magic-numbers
            },
          }}

        />
        {this.props.children}
        {processables}
      </div>
    );
  }
}
