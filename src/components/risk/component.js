import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'aqueduct-components';

// components
import RiskFilters from 'components/risk/filters';
import RiskInputs from 'components/risk/risk-inputs';

// styles
import './styles.scss';

class Risk extends PureComponent {
  static propTypes = {
    advancedSettings: PropTypes.bool.isRequired,
    defaultsLoading: PropTypes.bool.isRequired,
    setWidgets: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { setWidgets, advancedSettings } = this.props;

    if (advancedSettings) setWidgets({ nextTab: 'advanced_risk' });
  }

  render() {
    const {
      advancedSettings,
      defaultsLoading,
    } = this.props;

    const loadingStyles = {
      ...defaultsLoading && {
        display: 'flex',
        minHeight: 250
      }
    };

    return (
      <div className="c-risk">
        <div className="l-filters">
          <RiskFilters />
        </div>

        <div
          className="l-risk-inputs"
          style={loadingStyles}
        >
          <div className="wrapper">
            <div className="row">
              <div className="col-xs-12">
                {(defaultsLoading && advancedSettings) && <Spinner className="-transparent" />}
                {(!defaultsLoading && advancedSettings) && <RiskInputs />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Risk;
