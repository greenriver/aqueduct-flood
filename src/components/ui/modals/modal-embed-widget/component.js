import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'aqueduct-components';
import ReactIframeResizer from 'react-iframe-resizer-super';

// styles
import './styles.scss';

class ModalEmbedWidget extends PureComponent {
  static propTypes = {
    options: PropTypes.object
  }

  static defaultProps = { options: {} }

  state = {
    width: 0,
    height: 0
  }

  onCopy = () => {
    const { input } = this;

    input.select();

    try {
      if (this.timeout) clearTimeout(this.timeout);

      document.execCommand('copy');

      this.setState({ copied: true });

      this.timeout = setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    } catch (err) {
      console.error('Oops, unable to copy');
    }
  }

  render() {
    const { options } = this.props;
    const { width, height, copied } = this.state;
    const { embedURL, previewURL, widget } = options;
    const { params } = widget;
    const { title } = params;
    const shareableUrl  = `${window.location.origin}${window.location.pathname}#${embedURL}`;
    const iframeUrl = `<iframe src="${shareableUrl}" width="${width}" height="${height}" frameBorder="0"></frame>`;

    return (
      <div className="c-modal-embed-widget">
        <div className="row">
          <div className="col-xs-12 col-md-8">
            <h2 className="widget-title">
              {title}
            </h2>
            <div className="container">
              <ReactIframeResizer
                title="widget-preview"
                src={previewURL}
                frameBorder={0}
                style={{
                  width: '100%',
                  minHeight: 350
                }}
                iframeResizerOptions={{
                  checkOrigin: false,
                  log: false,
                  resizedCallback: ({ height: h, width: w }) => {
                    this.setState({ height: `${h}px`, width: `${w}px` });
                  }
                }}
              />
            </div>

          </div>
          <div className="col-xs-12 col-md-4">
            <div className="url-container">
              <textarea
                readOnly
                value={iframeUrl}
                id="url-share"
                name="url-share"
                className="url-code"
                ref={(n) => { this.input = n; }}
              />

              <Button
                onClick={this.onCopy}
                theme="light"
                className="-large -bg-light-blue -uppercase -bold"
              >
                {copied ? 'Copied' : 'Get embed code'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalEmbedWidget;
