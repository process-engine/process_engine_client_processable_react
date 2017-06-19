import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getMuiTheme } from 'material-ui/styles';

import Link from '../../Buttons/Link/Link';
import ToolBar from '../../Bars/ToolBar/ToolBar';
import CheckBox from '../../InputForms/CheckBox/CheckBox';

import { ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';

class TableOverlay extends Component {
    static propTypes = {
        children: PropTypes.node,
        menuSchema: PropTypes.array,
        isCheckBox: PropTypes.bool,
        onSelectedMenuItemsChange: PropTypes.func,
        onMenuItemClicked: PropTypes.func,
        tableOverlayStyles: PropTypes.object
    };

    constructor() {
        super();
        this.state = {
            selectedMenuItems: {}
        };
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(applyTheme())
        };
    }
    handleChange(e, oldValue, newValue, dataKey) {
        if (oldValue !== newValue) {
            const currentSelectedMenuItems = this.state.selectedMenuItems;
            if (newValue) {
                currentSelectedMenuItems[dataKey] = true;
            } else {
                delete currentSelectedMenuItems[dataKey];
            }
            this.setState({
                selectedMenuItems: currentSelectedMenuItems
            }, () => {
                if (this.props.onSelectedMenuItemsChange) {
                    this.props.onSelectedMenuItemsChange(currentSelectedMenuItems);
                }
            });
        }
    }

    handleItemMenuClicked(e, dataKey) {
        if (this.props.onMenuItemClicked) {
            this.props.onMenuItemClicked(dataKey);
        }
    }

    render() {
        const themeObj = applyTheme();
        
        return (
            <ToolBar theme={applyTheme('Menu')}>
                {this.props.menuSchema.map((section, sectionIdx) => {
                    const elements = [];
                    let menuHeaderElement = null;
                    if (section.sectionName) {
                        menuHeaderElement = (<h1 className={this.props.tableOverlayStyles.menuHeaderClassName}>{section.sectionName}</h1>);
                    }
                    elements.push(
                        <ToolbarGroup
                            key={sectionIdx}
                            firstChild={(sectionIdx === 0)}
                            style={{
                                marginLeft: (sectionIdx === 0 ? themeObj.distances.secondary : themeObj.distances.tertiary),
                                display: 'block'
                            }}
                        >
                            {menuHeaderElement}
                            <span className={tableOverlayStyles.menuItemClassName}>
                                {section.items.map((item, itemIdx) => {
                                    let content = null;
                                    if (item.isCheckBox === true) {
                                        content = (
                                            <CheckBox
                                                key={itemIdx}
                                                theme={applyTheme('Menu')}
                                                muiProps={{ label: item.label }}
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

                                        content = <Link key={itemIdx} theme={applyTheme('Menu')} to={to} label={item.label}/>;
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
                                    backgroundColor: themeObj.brand.primary
                                }}
                            />
                        );
                    }
                    return (elements);
                })}
            </ToolBar>
        );
    }
}


TableOverlay.childContextTypes = {
    muiTheme: PropTypes.object
};

TableOverlay.defaultProps = {
    title: null,
    infoText: null,
    children: null,
    primary: false,
    isCheckBox: false
};

export default TableOverlay;

