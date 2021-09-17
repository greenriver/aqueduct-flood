import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'aqueduct-components';
// components
import AnalyzerFilters from 'components/analyzer/filters';
import AnalyzerInputs from 'components/analyzer/analyzer-inputs';
import ApplyFilters from 'components/apply-filters';

// utils
import { generateModalOptions } from 'utils/modal';

// styles
import './styles.scss';

class Analyzer extends PureComponent {
  static propTypes = {
    defaultsLoading: PropTypes.bool.isRequired,
    widgetLoading: PropTypes.bool.isRequired,
    filters: PropTypes.shape({}).isRequired,
    input: PropTypes.shape({ loading: PropTypes.bool.isRequired }).isRequired,
    setCostFilter: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { setModal } = this.props;

    if (typeof window !== 'undefined' && !localStorage.getItem('CBA_FIRST_TIME')) {
      setModal(generateModalOptions('info', 'cba-notification'));
      localStorage.setItem('CBA_FIRST_TIME', true);
    }
  }

  render() {
    const {
      defaultsLoading,
      widgetLoading,
      filters,
      input,
      setCostFilter
    } = this.props;
    const { loading } = input;

    const loadingStyles = {
      ...loading && { overflowY: 'hidden' }
    };

    // TODO: remove this early return once we fix the CBA tab
    return (
      <div className="c-risk">
        <div className="l-filters">
          <div class="c-analyzer-filters">
            <div class="wrapper">
              <div class="row">
                <div class="col" style={{color: 'white'}}>
                  The Cost-Benefit Analyzer tool is currently unavailable as the site is undergoing maintenance.
                  Please check back again soon to use this functionality.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="c-analyzer">
        <div className="l-filters">
          <AnalyzerFilters />
        </div>

        <div className="l-analyzer-inputs" style={loadingStyles}>
          <div className="wrapper">
            <div className="row">
              <div className="col-xs-12">
                {defaultsLoading && <Spinner className="-transparent" />}
                {!defaultsLoading &&
                  <AnalyzerInputs onChangeFilter={setCostFilter} filters={filters} />}
              </div>
            </div>
          </div>
        </div>
        {(!defaultsLoading && !widgetLoading) && <ApplyFilters />}
      </div>
    );
  }
}

export default Analyzer;
