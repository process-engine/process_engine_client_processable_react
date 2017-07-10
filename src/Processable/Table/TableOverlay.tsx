import * as React from 'react';

import Link from '@process-engine-js/frontend_mui/dist/commonjs/Buttons/Link/Link.js';
import ToolBar from '@process-engine-js/frontend_mui/dist/commonjs/Bars/ToolBar/ToolBar.js';
import CheckBox from '@process-engine-js/frontend_mui/dist/commonjs/InputForms/CheckBox/CheckBox.js';
import {IMUIProps} from '@process-engine-js/frontend_mui/dist/interfaces';

import {buildTheme} from '@process-engine-js/frontend_mui/dist/commonjs/themeBuilder.js';

import {ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar/index.js';

export interface ITableOverlayProps extends IMUIProps {
  menuSchema: Array<any>;
  isCheckBox: boolean;
  onSelectedMenuItemsChange: Function;
  onMenuItemClicked: Function;
  tableOverlayStyles: any;

  title?: string;
  infoText?: string;
  primary?: boolean;
  isCheckBox?: boolean;
  menuItemClassName?: string;
  checkBoxTheme?: {};
  linkTheme?: {};
}

export interface ITableOverlayState {
  selectedMenuItems?: {};
}

class TableOverlay extends React.Component<ITableOverlayProps, ITableOverlayState> {
  public static defaultProps = {
    theme: null,
    muiProps: {},
    qflProps: {},

    title: null,
    infoText: null,
    primary: false,
    isCheckBox: false,
    menuItemClassName: null,
    checkBoxTheme: null,
    linkTheme: null
  };

  constructor() {
    super();
    this.state = {
      selectedMenuItems: {}
    };
  }

  private handleChange(e, oldValue, newValue, dataKey) {
    if (oldValue !== newValue) {
      const currentSelectedMenuItems = this.state.selectedMenuItems;
      if (newValue) {
        currentSelectedMenuItems[dataKey] = true;
      } else {
        delete currentSelectedMenuItems[dataKey];
      }
      this.setState(
        {
          selectedMenuItems: currentSelectedMenuItems
        },
        () => {
          if (this.props.onSelectedMenuItemsChange) {
            this.props.onSelectedMenuItemsChange(currentSelectedMenuItems);
          }
        }
      );
    }
  }

  private handleItemMenuClicked(e, dataKey) {
    if (this.props.onMenuItemClicked) {
      this.props.onMenuItemClicked(dataKey);
    }
  }

  public render() {
    const {theme, qflProps, muiProps} = buildTheme({
      theme: this.props.theme,
      sourceMuiProps: this.props.muiProps,
      sourceQflProps: this.props.qflProps,
      componentName: 'TableOverlay'
    }) as {theme: any, qflProps: any, muiProps: any, componentName: string};

    return (
      <div {...qflProps}>
          <ToolBar theme={this.props.theme} muiProps={muiProps}>
          {this.props.menuSchema.map((section, sectionIdx) => {
            const elements = [];
            let menuHeaderElement = null;
            if (section.sectionName) {
              menuHeaderElement = (
                <h1 className={this.props.tableOverlayStyles.menuHeaderClassName}>{section.sectionName}</h1>);
            }
            elements.push(
              <ToolbarGroup
                key={sectionIdx}
                firstChild={(sectionIdx === 0)}
                style={{
                  marginLeft: (sectionIdx === 0 ? theme.distances.secondary : theme.distances.tertiary),
                  display: 'block'
                }}
              >
                {menuHeaderElement}
                <span className={this.props.menuItemClassName}>
                  {section.items.map((item, itemIdx) => {
                    let content = null;
                    if (item.isCheckBox === true) {
                      content = (
                        <CheckBox
                          key={itemIdx}
                          theme={this.props.checkBoxTheme}
                          muiProps={{label: item.label}}
                          dataKey={item.key}
                          value={this.state.selectedMenuItems[item.key]}
                          onChange={(e, oldValue, newValue, dataKey) => {
                            this.handleChange(e, oldValue, newValue, dataKey);
                          }}
                        />
                      );
                    } else if (item.isLink === true) {
                      let to = item.to;
                      if (item.to && typeof item.to === 'function') {
                        to = item.to();
                      }

                      content =
                        <Link key={itemIdx} theme={this.props.linkTheme} to={to} label={item.label}/>;
                    } else {
                      content = (
                        <span
                          key={itemIdx}
                          style={{
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            this.handleItemMenuClicked(e, item.key);
                          }}
                        >
                                  {item.label}
                              </span>
                      );
                    }
                    return content;
                  })}
                </span>
              </ToolbarGroup>
            );

            if (sectionIdx < this.props.menuSchema.length - 1) {
              elements.push(
                <ToolbarSeparator
                  key={sectionIdx + '_seperator'}
                  style={{
                    top: '0px',
                    bottom: '0px',
                    height: 'initial',
                    left: '4px',
                    marginLeft: '14px',
                    width: '2px',
                    display: 'block',
                    backgroundColor: theme.brand.primary
                  }}
                />
              );
            }
            return (elements);
          })}
        </ToolBar>
      </div>
    );
  }
}

export default TableOverlay;
