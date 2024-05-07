import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'aqueduct-components';

// components
import Head from 'layout/head';
import Header from 'layout/header';
import ModalInfo from 'components/ui/modals/modal-info';
import ModalEmbedWidget from 'components/ui/modals/modal-embed-widget';
import ModalInfoWidget from 'components/ui/modals/modal-info-widget';

// utils
import { initGA, logPageView } from 'utils/analytics';
import ModalShareLink from 'components/ui/modals/modal-share-link/component';

class Layout extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    modal: PropTypes.shape({
      visible: PropTypes.bool.isRequired,
      options: PropTypes.object.isRequired
    }).isRequired,
    resetModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    const { title, description, children, modal, resetModal } = this.props;
    const { options: modalOptions } = modal;

    return (
      <div id="#main" className="l-page">
        <Head title={title} description={description} />
        <Header appRoute="https://www.wri.org/publication/aqueduct-floods" />
        <div className="page-content">
          {children}
        </div>

        <Modal
          isOpen={modal.visible}
          appElement=".l-page"
          onRequestClose={() => resetModal()}
          customClass="app-modal"
        >
          {modalOptions.type === 'info' && <ModalInfo options={modalOptions} />}
          {modalOptions.type === 'widget-share' && <ModalEmbedWidget options={modalOptions} />}
          {modalOptions.type === 'widget-info' && <ModalInfoWidget options={modalOptions} />}
          {modalOptions.type === 'share-link' && <ModalShareLink />}
        </Modal>
      </div>
    );
  }
}

export default Layout;
