import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Table from '../../Tables/Table/Table';
import RaisedButton from '../../Buttons/RaisedButton/RaisedButton';
import TextField from '../../InputForms/TextField/TextField';
import Processable from '../ProcessContainer';
import DropDown from '../../InputForms/DropDown/DropDown';

import { MenuItem } from 'material-ui';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import { TableOverlay } from './TableOverlay';

import $ from 'jquery';

class ProcessableTable extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    frame: PropTypes.bool,

    createProcessKey: PropTypes.string,
    createStartToken: PropTypes.any,

    createButtonMuiProps: PropTypes.object,
    createButtonQflProps: PropTypes.object,
    createButtonProps: PropTypes.object,

    createButtonTheme: PropTypes.object,
    createDialogTheme: PropTypes.object,
    createFormItemTheme: PropTypes.object,
    createConfirmTheme: PropTypes.object,
    createWidgetTheme: PropTypes.object,
    createTheme: PropTypes.object,

    itemBasedButtonTheme: PropTypes.object,
    listBasedButtonTheme: PropTypes.object,
    filterMenuTheme: PropTypes.object,
    baseFilterMenuTheme: PropTypes.object,
    searchFieldTheme: PropTypes.object,

    onSearch: PropTypes.func,
    searchFieldMuiProps: PropTypes.object,
    searchFieldQflProps: PropTypes.object,
    searchFieldProps: PropTypes.object,
    searchValue: PropTypes.string,
    tableProps: PropTypes.object,
    data: PropTypes.any,
    searchKeyDelay: PropTypes.number,
    controlledHeight: PropTypes.number,

    dataClassName: PropTypes.string.required,

    itemBasedButtonSchema: PropTypes.any,
    itemBasedButtonMuiProps: PropTypes.object,
    itemBasedButtonQflProps: PropTypes.object,
    itemBasedButtonProps: PropTypes.object,
    itemBasedMoreButtonMuiProps: PropTypes.object,
    itemBasedMoreButtonQflProps: PropTypes.object,
    itemBasedMoreButtonProps: PropTypes.object,

    listBasedButtonSchema: PropTypes.any,
    filterMenuSchema: PropTypes.any,
    onFilterChange: PropTypes.func,

    baseFilterMenuSchema: PropTypes.any,

    onProcessEnded: PropTypes.func,

    tableOverlayStyles: PropTypes.object,

    tableStyles: PropTypes.object,

    theme: PropTypes.object,
    tableTheme: PropTypes.object,
    tableSelectorTheme: PropTypes.object
  };

  static defaultProps = {
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
    }
  };

  static contextTypes = {
    viewer: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      mbClient: props.mbClient,
      subscriptions: {},
      isItemBasedMoreMenuOpened: false,
      selectedRows: {},
      searchValue: props.searchValue
    };
  }

  componentWillUnmount() {
    if (this.state.subscriptions) {
      Object.keys(this.state.subscriptions).forEach((subscription) => {
        this.state.subscriptions[subscription].channel.cancel();
      });
    }
  }

  handleStart(subscriptionId, startToken, onProcessEnded, done) {
    const participantUUID = this.state.mbClient._participantId;
    const msg = this.state.mbClient.createMessage({
      action: 'start',
      key: subscriptionId,
      token: startToken
    });

    this.state.mbClient.publish('/processengine', msg);
    const curChannelName = '/participant/' + participantUUID;
    const subscription = {
      channelName: curChannelName,
      channel: this.state.mbClient.subscribe(curChannelName, (fayeMsg) => {
        if (fayeMsg && fayeMsg.data && fayeMsg.data.action) {
          const data = fayeMsg.data;
          const processKey = subscriptionId;
          switch (fayeMsg.data.action) {
            case 'userTask': {
              const nextTaskEntity = fayeMsg.data.data;
              const nextTask = fayeMsg.data.data.nodeDef;

              const curTaskChannelName = '/processengine/node/' + nextTaskEntity.id;
              const currentSubscriptions = this.state.subscriptions;
              currentSubscriptions[subscriptionId].started = true;
              currentSubscriptions[subscriptionId].nextTask = nextTask;
              currentSubscriptions[subscriptionId].nextTaskEntity = nextTaskEntity;
              currentSubscriptions[subscriptionId].taskChannelName = curTaskChannelName;

              this.setState({
                subscriptions: currentSubscriptions
              });
              break;
            }
            case 'endEvent': {
              this.handleStop(subscriptionId);

              this.setState({
                currentOffset: 0
              }, () => {
                if (this.props.onProcessEnded) {
                  this.props.onProcessEnded(processKey, data);
                }
                if (onProcessEnded) {
                  onProcessEnded(processKey, data);
                }
              });

              break;
            }
            default:
              break;
          }
        }
      })
    };

    subscription.channel.then(() => {
      const currentSubscriptions = this.state.subscriptions;
      currentSubscriptions[subscriptionId] = subscription;
      this.setState({
        subscriptions: currentSubscriptions
      }, done);
    });
  }

  handleStop(subscriptionId, done) {
    const currentSubscriptions = this.state.subscriptions;
    const currentSubscription = currentSubscriptions[subscriptionId];
    currentSubscription.channel.cancel();

    delete currentSubscriptions[subscriptionId];

    this.setState({
      subscriptions: currentSubscriptions
    }, done);
  }

  delay = (() => {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  handleItemClicked(item) {
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
      this.handleStart(item.processableKey, startToken, item.onProcessEnded);
    }
  }

  handleSelectedRowsChanged(selectedRows) {
    this.setState({
      selectedRows
    });
  }

  cleanSelected() {
    if (this.refs && this.refs.listBoxTable && this.refs.listBoxTable.cleanSelected) {
      this.refs.listBoxTable.cleanSelected();
    }
  }

  handleFilterItemChange(key, oldValue, newValue, choosenElement, element) {
    if (this.props.onFilterChange) {
      this.props.onFilterChange(key, newValue, choosenElement, element);
    }
  }

  itemBasedMoreMenuId = 'vorstartItemBasedMoreMenu';

  render() {
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
              this.handleStart(this.props.createProcessKey + this.props.dataClassName, this.props.createStartToken);
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

      let createProcessContainer = null;
      const createProcessable = ((this.state.subscriptions && this.state.subscriptions['Create' + this.props.dataClassName]) || null);
      if (createProcessable && createProcessable.started && createProcessable.taskChannelName) {
        createProcessContainer = (
          <Processable modal key={createProcessable.nextTaskEntity.id} processable={createProcessable}
                       buttonTheme={this.props.createButtonTheme} dialogTheme={this.props.createDialogTheme}
                       formItemTheme={this.props.createFormItemTheme} confirmTheme={this.props.createConfirmTheme}
                       widgetTheme={this.props.createWidgetTheme} theme={this.props.createTheme}
                       mbClient={this.state.mbClient}/>
        );
      }

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
          onChange={(event, index, oldValue, newValue) => this.handleFilterItemChange(filterMenuSchemaItem.key, oldValue, newValue, filterMenuSchemaItem.items[index], filterMenuSchemaItem)}
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
          let itemBasedButtonProcessContainer = null;
          const itemBasedButtonProcessable = ((this.state.subscriptions && this.state.subscriptions[buttonSchemaItem.processableKey]) || null);
          if (itemBasedButtonProcessable && itemBasedButtonProcessable.started && itemBasedButtonProcessable.taskChannelName) {
            itemBasedButtonProcessContainer = (
              <Processable
                modal
                key={itemBasedButtonProcessable.nextTaskEntity.id}
                processable={itemBasedButtonProcessable}
                buttonTheme={buttonSchemaItem.themes.buttonTheme}
                dialogTheme={buttonSchemaItem.themes.dialogTheme}
                formItemTheme={buttonSchemaItem.themes.formItemTheme}
                confirmTheme={buttonSchemaItem.themes.confirmTheme}
                widgetTheme={buttonSchemaItem.themes.widgetTheme}
                theme={buttonSchemaItem.themes.theme}
                mbClient={this.state.mbClient}
              />
            );
          }

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
              let itemBasedButtonProcessContainer = null;
              const itemBasedButtonProcessable = ((this.state.subscriptions && this.state.subscriptions[buttonSchemaItem.processableKey]) || null);
              if (itemBasedButtonProcessable && itemBasedButtonProcessable.started && itemBasedButtonProcessable.taskChannelName) {
                itemBasedButtonProcessContainer = (
                  <Processable
                    modal
                    key={itemBasedButtonProcessable.nextTaskEntity.id}
                    processable={itemBasedButtonProcessable}
                    buttonTheme={buttonSchemaItem.themes.buttonTheme}
                    dialogTheme={buttonSchemaItem.themes.dialogTheme}
                    formItemTheme={buttonSchemaItem.themes.formItemTheme}
                    confirmTheme={buttonSchemaItem.themes.confirmTheme}
                    widgetTheme={buttonSchemaItem.themes.widgetTheme}
                    theme={buttonSchemaItem.themes.theme}
                    mbClient={this.state.mbClient}
                  />
                );
              }

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
                  marginLeft: this.props.theme.distances.halfPrimary,
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
              this.delay(() => {
                this.props.onSearch(newValue);
              }, (e && e.keyCode === 13 ? 0 : this.props.searchKeyDelay));
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
          ref="listBoxTable"
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

