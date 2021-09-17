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

    // TODO: remove this early return once we fix the Risk tab
    return (
      <div className="c-risk">
        <div className="l-filters">
          <div class="c-analyzer-filters">
            <div class="wrapper">
              <div class="row">
                <div class="col" style={{color: 'white'}}>
                  The Risk tool is currently unavailable as the site is undergoing maintenance.
                  Please check back again soon to use this functionality.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

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
