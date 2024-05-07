import React, { PureComponent } from 'react';

// constants

// styles
import './styles.scss';

class ModalShareLink extends PureComponent {
  
  state = {
    isLoading: true,
    data: null, //{ link: 'http://localhost:3000/shortenlink' }
  }

  handleData = (data) => {
    this.setState({ isLoading: false, data })
  }

  componentDidMount = () => {
    fetch(process.env.REACT_APP_BITLY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_BITLY_API_KEY}`
      },
      body: JSON.stringify({
        long_url: `${window.location.href}`
      })
    })
      .then(response => response.json())
      .then(data => this.handleData(data));
  }

  handleCopyToClipboard = () => {
    navigator.clipboard.writeText(this.state.data.link);
  }

  render() {

    if (this.state.isLoading) {
      return <div>Loading...</div>
    }

    return (
      <div className="c-modal-share">
        <h3 className="modal-title">
          Share link
        </h3>
        <div className="modal-content">
          
            <div>
              <div className="content-value">
                
                <div className="input-container">
                  <div className="input">
                    <input type="text" value={this.state.data.link} />
                  </div>
                  <button onClick={this.handleCopyToClipboard} type='button' className="input-button">
                    COPY
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default ModalShareLink;
