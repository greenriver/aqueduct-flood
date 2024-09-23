import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button} from 'aqueduct-components';

// components
import Head from 'layout/head';

// utils
import { initGA, logPageView } from 'utils/analytics';

class LayoutPreview extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  componentDidMount() {
    // Google Analytics
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    const { title, description, children, layout } = this.props;

    return (
      <div
        id="#main"
        className={ layout === 'widget-print' ? "l-preview-page c-report" : "l-preview-page"}
      >
        <Head
          title={title}
          description={description}
        />
        <div className="preview-content content">
          {children}
        </div>
        { layout === 'widget-print' ? 
        <div className='no-print'>
          <Button
          theme='light'
          className='-large -bg-dark-blue -uppercase -bold'
          style={{
            position: 'fixed',
            zIndex: 10000,
            bottom: 20,
            right: 20
          }}
          onClick={() => { window.print(); }}
          >
            Download
          </Button>
        </div>
        : null }
      </div>
    );
  }
}

export default LayoutPreview;
