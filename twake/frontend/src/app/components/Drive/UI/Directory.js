import React, { Component } from 'react';

import FolderIcon from '@material-ui/icons/FolderOutlined';
import Menu from 'components/Menus/Menu.js';
import Numbers from 'services/utils/Numbers.js';
import Collections from 'app/services/Depreciated/Collections/Collections.js';
import Icon from 'components/Icon/Icon.js';
import '../Drive.scss';
import 'moment-timezone';

export default class Directory extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    var app = {};
    if (this.props.data.application_id && this.props.data.external_storage) {
      app = Collections.get('applications').find(this.props.data.application_id);
    }

    return [
      <div style={{ display: 'inherit', width: '100%' }}>
        <div className="icon">
          {!app.id && <FolderIcon className="m-icon-small" />}
          {!!app.id && (
            <div className="app_icon" style={{ backgroundImage: "url('" + app.icon_url + "')" }} />
          )}
        </div>
        <div className="text">
          {this.props.data.name}
          {!!app.id && <i> ({app.name})</i>}
        </div>

        {(this.props.data.acces_info || {}).token && (
          <Icon type="cloud-share" className="m-icon-small" />
        )}

        {this.props.details && (
          <div className="size no-grid">
            {this.props.data.size ? Numbers.humanFileSize(this.props.data.size, true) : '-'}
          </div>
        )}
        {this.props.menu && this.props.menu.length > 0 && (
          <Menu menu={this.props.menu} className="options">
            <Icon type="ellipsis-h" className="m-icon-small" />
          </Menu>
        )}
      </div>,
    ];
  }
}
