import * as React from 'react';

import Table from '@process-engine-js/frontend_mui/dist/commonjs/Tables/Table/Table.js';
import RaisedButton from '@process-engine-js/frontend_mui/dist/commonjs/Buttons/RaisedButton/RaisedButton.js';
import TextField from '@process-engine-js/frontend_mui/dist/commonjs/InputForms/TextField/TextField.js';
import ProcessableContainer from '../ProcessableContainer';
import DropDown from '@process-engine-js/frontend_mui/dist/commonjs/InputForms/DropDown/DropDown.js';

import MenuItem from 'material-ui/MenuItem/MenuItem.js';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more.js';
import TableOverlay from './TableOverlay';

const $ = require('jquery'); // tslint:disable-line no-var-requires

import {IMUIProps} from '@process-engine-js/frontend_mui/dist/interfaces';
import {IProcessable, IProcessEngineClientApi, IProcessInstance} from '@process-engine-js/process_engine_client_api';
import {ExecutionContext} from '@process-engine-js/core_contracts';

export interface ITableProps extends IMUIProps {
  dataClassName: string;

  context?: ExecutionContext;
  processEngineClientApi?: IProcessEngineClientApi;

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
  tableSelectorTheme?: {};
}

export interface ITableState {
  isItemBasedMoreMenuOpened?: boolean;
  selectedRows?: {};
  searchValue?: string;

  createOnProcessEnded?: Function;
  createProcessInstance?: IProcessInstance;
  createProcessableContainer?: ProcessableContainer;

  currentItemProcessKey?: string;
  currentItemOnProcessEnded?: Function;
  itemProcessInstance?: IProcessInstance;
  itemProcessableContainer?: ProcessableContainer;
}

class ProcessableTable extends React.Component<ITableProps, ITableState> implements IProcessable {
  public static defaultProps = {
    theme: null,
    muiProps: {},
    qflProps: {},

    processEngineClientApi: null,
    title: null,
    frame: true,
    searchKeyDelay: 250,
    tableStyles: {
      tableWithFrameClassName: null,
      tableWithoutFrameClassName: null,
      createButtonClassName: null,
      contentOverlayClassName: null,
      tableBarClassName: null,
      itemHeaderClassName: null,
      searchFieldClassName: null,
      itemBasedMoreButtonClassName: null,
      itemBasedButtonClassName: null,
      tableRowClassName: null,
      tableHeaderRowClassName: null,
      tableColumnSelectorClassName: null,
      tableHeaderColumnSelectorClassName: null
    },
    tableOverlayStyles: {
      menuHeaderClassName: null,
      menuItemClassName: null
    },

    createProcessKey: null,
    createStartToken: null,

    createButtonMuiProps: null,
    createButtonQflProps: null,
    createButtonProps: null,

    createButtonTheme: null,
    createDialogTheme: null,
    createFormItemTheme: null,
    createConfirmTheme: null,
    createWidgetTheme: null,
    createTheme: null,

    itemBasedButtonTheme: null,
    listBasedButtonTheme: null,
    filterMenuTheme: null,
    baseFilterMenuTheme: null,
    searchFieldTheme: null,

    onSearch: null,
    searchFieldMuiProps: null,
    searchFieldQflProps: null,
    searchFieldProps: null,
    searchValue: null,
    tableProps: {
      rbtProps: null
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
    filterMenuSchema: null,
    onFilterChange: null,

    baseFilterMenuSchema: null,

    onCreateProcessEnded: null,
    onItemProcessEnded: null,

    tableTheme: null,
    tableSelectorTheme: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isItemBasedMoreMenuOpened: false,
      selectedRows: {},
      searchValue: props.searchValue,

      createOnProcessEnded: null,
      createProcessInstance: null,
      createProcessableContainer: null,

      currentItemProcessKey: null,
      currentItemOnProcessEnded: null,
      itemProcessInstance: null,
      itemProcessableContainer: null
    };
  }

  private renderProcessContainer(processKey) {
    switch (processKey) {
      case (this.props.createProcessKey + this.props.dataClassName):
        const createProcessableContainer = (
          <ProcessableContainer modal={true} key={this.state.createProcessInstance.nextTaskEntity.id}
                                processInstance={this.state.createProcessInstance}/>
        );
        this.setState({
          createProcessableContainer
        });
        break;
      case (this.state.currentItemProcessKey):
        const itemProcessableContainer = (
          <ProcessableContainer modal={true} key={this.state.itemProcessInstance.nextTaskEntity.id}
                                processInstance={this.state.itemProcessInstance}/>
        );
        this.setState({
          itemProcessableContainer
        });
        break;
      default:
    }
  };

  public async handleUserTask(processKey: string, message: any) {
    this.renderProcessContainer(processKey);
  };

  public async handleManualTask(processKey: string, message: any) {
    return;
  };

  public async handleEndEvent(processKey: string, message: any) {
    switch (processKey) {
      case (this.props.createProcessKey + this.props.dataClassName):
        this.setState(
          {
            createProcessInstance: null,
            createProcessableContainer: null
          },
          () => {
            if (this.state.createOnProcessEnded) {
              this.state.createOnProcessEnded();
            }
          }
        );
        break;
      case (this.state.currentItemProcessKey):
        this.setState(
          {
            itemProcessInstance: null,
            itemProcessableContainer: null
          },
          () => {
            if (this.state.currentItemOnProcessEnded) {
              this.state.currentItemOnProcessEnded();
            }
            if (this.props.onItemProcessEnded) {
              this.props.onItemProcessEnded();
            }
          }
        );
        break;
      default:
    }
  };

  private async handleStartCreate(startToken, onProcessEnded?: Function, done?: Function) {
    if (this.props.processEngineClientApi) {
      const createProcessInstance = await this.props.processEngineClientApi.startProcess(
        (this.props.createProcessKey + this.props.dataClassName),
        this,
        startToken,
        this.props.context
      );
      if (done) {
        done();
      }
      this.setState({
        createOnProcessEnded: onProcessEnded,
        createProcessInstance
      });
    }
  }

  private async handleStartItem(processKey, startToken, onProcessEnded?: Function, done?: Function) {
    if (this.props.processEngineClientApi) {
      const itemProcessInstance = await this.props.processEngineClientApi.startProcess(
        processKey,
        this,
        startToken,
        this.props.context
      );
      if (done) {
        done();
      }
      this.setState({
        currentItemOnProcessEnded: onProcessEnded,
        currentItemProcessKey: processKey,
        itemProcessInstance
      });
    }
  }

  private delay = (() => {
    let timer: NodeJS.Timer = null;
    return (callback: Function, ms: number) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  private handleItemClicked(item) {
    this.setState({
      isItemBasedMoreMenuOpened: false
    });

    const selectedItems = [];
    if (this.state.selectedRows) {
      Object.keys(this.state.selectedRows).forEach((key) => {
        selectedItems.push(this.state.selectedRows[key]);
      });
    }
    if (selectedItems && selectedItems.length > 0 && item && item.processableKey) {
      let startToken = null;
      if (selectedItems.length === 1) {
        startToken = { id: selectedItems[0].id };
        if (item.startTokenTransformer) {
          startToken = item.startTokenTransformer(startToken, selectedItems[0]);
        }
      } else {
        startToken = selectedItems.map((selectedItem) => {
          let resultToken = { id: selectedItem.id };
          if (item.startTokenTransformer) {
            resultToken = item.startTokenTransformer(resultToken, selectedItem);
          }
          return resultToken;
        });
      }
      this.handleStartItem(item.processableKey, startToken, item.onProcessEnded);
    }
  }

  private handleSelectedRowsChanged(selectedRows) {
    this.setState({
      selectedRows
    });
  }

  public cleanSelected() {
    const refs: any = this.refs;
    if (refs && refs.listBoxTable && refs.listBoxTable.cleanSelected) {
      refs.listBoxTable.cleanSelected();
    }
  }

  private handleFilterItemChange(key, oldValue, newValue, choosenElement, element) {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(key, newValue, choosenElement, element);
    }
  }

  public itemBasedMoreMenuId = 'itemBasedMoreMenu';

  public render() {
    let newClassName = null;
    if (this.props.frame === true) {
      newClassName = this.props.tableStyles.tableWithFrameClassName;
    } else {
      newClassName = this.props.tableStyles.tableWithoutFrameClassName;
    }

    const { rbtProps } = (this.props.tableProps || {});
    if (this.props.tableProps) {
      delete this.props.tableProps.rbtProps;
    }

    const processables = [];

    let createButton = null;
    if (this.props.createProcessKey) {
      createButton = (
        <RaisedButton
          theme={this.props.createButtonTheme}
          muiProps={{
            label: '+',
            primary: true,
            className: this.props.tableStyles.createButtonClassName,
            style: {
              borderRadius: '0px'
            },
            onClick: (e) => {
              this.handleStartCreate(this.props.createStartToken, this.props.onCreateProcessEnded);
            },
            ...this.props.createButtonMuiProps
          }}
          qflProps={{
            style: {
              paddingTop: '9px',
              width: 'auto',
              display: 'inline-block',
              top: '-14px',
              position: 'relative'
            },
            ...this.props.createButtonQflProps
          }}
          {...this.props.createButtonProps}
        />
      );

      let createProcessContainer = this.state.createProcessableContainer;
      processables.push(createProcessContainer);
    }

    let filterMenuElements = [];
    if (this.props.filterMenuSchema && this.props.filterMenuSchema.length > 0) {
      filterMenuElements = this.props.filterMenuSchema.map((filterMenuSchemaItem) => (
        <DropDown
          key={filterMenuSchemaItem.key}
          theme={filterMenuSchemaItem.theme}
          value={filterMenuSchemaItem.currentValue}
          items={filterMenuSchemaItem.items.map((dropDownItem, dropDownItemIdx) => <MenuItem
            key={filterMenuSchemaItem.key + '-' + dropDownItemIdx}
            value={dropDownItem.value}
            primaryText={dropDownItem.label}
          />)}
          muiProps={{
            floatingLabelText: filterMenuSchemaItem.label,
            ...filterMenuSchemaItem.muiProps
          }}
          onChange={(event, index, oldValue, newValue) => this.handleFilterItemChange(
            filterMenuSchemaItem.key, oldValue, newValue, filterMenuSchemaItem.items[index], filterMenuSchemaItem)}
          qflProps={{
            style: {
              paddingTop: this.props.theme.distances.primary,
              display: 'inline-block',
              width: '150px',
              marginLeft: this.props.theme.distances.primary
            },
            ...filterMenuSchemaItem.qflProps
          }}
        />
      ));
    }

    let itemBasedElements = [];
    if (Object.keys(this.state.selectedRows).length > 0) {
      if (this.props.itemBasedButtonSchema && this.props.itemBasedButtonSchema.length > 0) {
        itemBasedElements = itemBasedElements.concat(this.props.itemBasedButtonSchema.filter((buttonSchemaItem) => {
          if (!buttonSchemaItem.multiple && Object.keys(this.state.selectedRows).length > 1) {
            return false;
          }
          return !buttonSchemaItem.isMore;
        }).map((buttonSchemaItem, buttonSchemaIdx) => {
          let itemBasedButtonProcessContainer = this.state.itemProcessableContainer;
          processables.push(itemBasedButtonProcessContainer);

          return (
            <RaisedButton
              theme={this.props.itemBasedButtonTheme}
              muiProps={{
                icon: buttonSchemaItem.icon,
                primary: true,
                className: this.props.tableStyles.itemBasedButtonClassName,
                style: {
                  borderRadius: '0px'
                },
                onClick: (e) => {
                  this.handleItemClicked.bind(this, buttonSchemaItem)();
                },
                ...this.props.itemBasedButtonMuiProps
              }}
              qflProps={{
                style: {
                  paddingTop: this.props.theme.distances.primary,
                  width: 'auto',
                  display: 'inline-block',
                  position: 'relative',
                  top: '-2px',
                  marginLeft: this.props.theme.distances.halfPrimary
                },
                ...this.props.itemBasedButtonQflProps
              }}
              {...this.props.itemBasedButtonProps}
            />
          );
        }));

        const itemBasedMoreButtons = this.props.itemBasedButtonSchema.filter((buttonSchemaItem) => {
          if (!buttonSchemaItem.multiple && Object.keys(this.state.selectedRows).length > 1) {
            return false;
          }
          return buttonSchemaItem.isMore;
        });
        if (itemBasedMoreButtons.length > 0) {
          const menuSchema = [{
            sectionName: null,
            items: itemBasedMoreButtons.map((buttonSchemaItem) => {
              let itemBasedButtonProcessContainer = this.state.itemProcessableContainer;
              processables.push(itemBasedButtonProcessContainer);

              return {
                label: buttonSchemaItem.name,
                key: buttonSchemaItem.key
              };
            })
          }];

          itemBasedElements = itemBasedElements.concat([
            <div
              style={{
                position: 'relative',
                display: 'inline-block'
              }}
            >
              <RaisedButton
                theme={this.props.itemBasedButtonTheme}
                muiProps={{
                  icon: <ExpandMoreIcon/>,
                  labelPosition: 'before',
                  label: 'MEHR',
                  primary: true,
                  className: this.props.tableStyles.itemBasedMoreButtonClassName,
                  style: {
                    borderRadius: '0px'
                  },
                  onClick: (e) => {
                    if (!this.state.isItemBasedMoreMenuOpened) {
                      $(window.document).on('click', (ce) => {
                        if (ce.originalEvent && ce.originalEvent.path.filter((item) => item.id === this.itemBasedMoreMenuId).length === 0) {
                          $(window.document).off('click');
                          this.setState({
                            isItemBasedMoreMenuOpened: false
                          });
                        }
                      });
                    }
                    this.setState({
                      isItemBasedMoreMenuOpened: !this.state.isItemBasedMoreMenuOpened
                    });
                  },
                  ...this.props.itemBasedMoreButtonMuiProps
                }}
                qflProps={{
                  style: {
                    paddingTop: this.props.theme.distances.primary,
                    width: 'auto',
                    display: 'inline-block',
                    marginLeft: this.props.theme.distances.halfPrimary
                  },
                  ...this.props.itemBasedMoreButtonQflProps
                }}
                {...this.props.itemBasedMoreButtonProps}
              />
              <div
                id={this.itemBasedMoreMenuId}
                style={{
                  display: (this.state.isItemBasedMoreMenuOpened ? 'block' : 'none'),
                  position: 'absolute',
                  zIndex: '10',
                  whiteSpace: 'nowrap',
                  color: 'black',
                  backgroundColor: 'white',
                  padding: this.props.theme.distances.halfPrimary,
                  marginLeft: this.props.theme.distances.halfPrimary
                }}
              >
                <TableOverlay
                  menuSchema={menuSchema}
                  tableOverlayStyles={this.props.tableOverlayStyles}
                  onMenuItemClicked={(key) => {
                    const matchedButtonSchemaItems = itemBasedMoreButtons.filter((buttonSchemaItem) => (buttonSchemaItem.key === key));
                    let buttonSchemaItem = null;
                    if (matchedButtonSchemaItems.length === 1) {
                      buttonSchemaItem = matchedButtonSchemaItems[0];
                    }
                    if (buttonSchemaItem) {
                      this.handleItemClicked.bind(this, buttonSchemaItem)();
                    }
                  }}
                />
              </div>
            </div>
          ]);
        }
      }
    }

    let searchField = null;
    if (this.props.onSearch) {
      searchField = (
        <TextField
          watch
          value={this.state.searchValue}
          theme={this.props.searchFieldTheme}
          muiProps={{
            hintText: 'Suchen',
            className: this.props.tableStyles.searchFieldClassName,
            ...this.props.searchFieldMuiProps
          }}
          qflProps={{
            style: {
              paddingTop: '9px',
              display: 'inline-block',
              position: 'relative',
              top: '-13px'
            },
            ...this.props.searchFieldQflProps
          }}
          {...this.props.searchFieldProps}
          onChange={(oldValue, newValue, e) => {
            if (this.props.onSearch) {
              this.delay(
                () => {
                  this.props.onSearch(newValue);
                },
                (e && e.keyCode === 13 ? 0 : this.props.searchKeyDelay)
              );
            }
          }}
        />
      );
    }

    return (
      <div
        className={newClassName}
        style={{
          padding: '0px',
          verticalAlign: 'top',
          lineHeight: 1.2,
          position: 'relative'
        }}
      >
        <div className={this.props.tableStyles.itemHeaderClassName}>
          {this.props.title}
        </div>
        <div style={{
          paddingTop: '9px'
        }} className={this.props.tableStyles.tableBarClassName}>
          {createButton}{searchField}
          <div style={{
            display: 'inline-block',
            width: 'auto',
            position: 'relative',
            top: '-12px'
          }}>{filterMenuElements}</div>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginLeft: this.props.theme.distances.halfPrimary,
              top: '-12px'
            }}
          >{itemBasedElements}</div>

        </div>

        <div
          style={{
            display: (this.state.isItemBasedMoreMenuOpened ? 'block' : 'none')
          }}
          className={this.props.tableStyles.contentOverlayClassName}
        />

        <Table
          ref='listBoxTable'
          theme={this.props.tableTheme}
          selectorTheme={this.props.tableSelectorTheme}
          onSelectedRowsChanged={(selectedRows) => {
            this.handleSelectedRowsChanged(selectedRows);
          }}
          {...this.props.tableProps}
          rbtProps={{
            data: this.props.data,
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
            ...rbtProps
          }}
          stylingProps={{
            containerStyle: {
              height: this.props.controlledHeight + 'px'
            },
            tableStyle: {
              height: (this.props.controlledHeight - 10) + 'px'
            },
            headerStyle: {
              height: '35px'
            },
            bodyStyle: {
              height: (this.props.controlledHeight - 10 - 35) + 'px'
            }
          }}

        />
        {this.props.children}
        {processables}
      </div>
    );
  }
}

export default ProcessableTable;

