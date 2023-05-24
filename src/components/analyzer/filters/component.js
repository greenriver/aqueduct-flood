import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, CustomSelect } from 'aqueduct-components';
import debounce from 'lodash/debounce';

// constants
import { SCENARIO_OPTIONS } from 'constants/app';

// utils
import { generateModalOptions } from 'utils/modal';
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class AnalyzerFilters extends PureComponent {
  static propTypes = {
    filters: PropTypes.shape({
      location: PropTypes.string,
      scenario: PropTypes.string,
      locationCompare: PropTypes.string
    }).isRequired,
    router: PropTypes.object.isRequired,
    locations: PropTypes.array.isRequired,
    locationsCompare: PropTypes.array.isRequired,
    setCommonFilter: PropTypes.func.isRequired,
    setCostFilter: PropTypes.func.isRequired,
    setCommonCompareFilter: PropTypes.func.isRequired,
    getLocations: PropTypes.func.isRequired,
    getCompareLocations: PropTypes.func.isRequired,
    getCountryDefaults: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired,
    setInputCompare: PropTypes.func.isRequired,
    resetWidgets: PropTypes.func.isRequired,
    setIsNullTime: PropTypes.func.isRequired,
    applyFilters: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired,
    setExistingProt: PropTypes.func.isRequired,
    setProtFut: PropTypes.func.isRequired
  };

  onSearch = debounce((value) => {
    const { getLocations } = this.props;

    if (value && value.length > 2 ) getLocations(value);
  }, 150)

  onChangeLocation = (opt) => {
    const {
      setCommonFilter,
      setCostFilter,
      filters,
      setInput,
      getCountryDefaults,
      resetWidgets,
      // applyFilters,
      // setIsNullTime,
      setExistingProt,
      setProtFut
    } = this.props;
    const { location } = filters;

    if ((opt && opt.value) === location) return;

    // setIsNullTime(true);
    // applyFilters(true);

    setInput({ loading: true });
    setCommonFilter({ geogunit_unique_name: opt && opt.value });

    resetWidgets('cba');

    getCountryDefaults({ location: opt.value })
      .then((defaults) => {
        setInput({ loading: false });
        setCostFilter({
          estimated_costs: defaults.estimated_costs,
          existing_prot: defaults.existing_prot,
          prot_fut: defaults.prot_fut,
          original_existing_prot: defaults.existing_prot,
          original_prot_fut: defaults.prot_fut,
          original_estimated_costs: defaults.estimated_costs
        });
        setExistingProt(defaults.existing_prot);
        setProtFut(defaults.prot_fut);
      });

    logEvent('[AQ-Flood]', 'analyzer tab: user sets location', opt.value);
  }

  onSearchCompare = debounce((value) => {
    const { getCompareLocations } = this.props;

    if (value && value.length > 2 ) getCompareLocations(value);
  }, 150)

  onChangeLocationCompare = (opt) => {
    const { setInputCompare, setCommonCompareFilter, setIsNullTime, setRouter, tab, router } = this.props;

    setIsNullTime(true);
    setInputCompare({ loading: true })
    setCommonCompareFilter({ geogunit_unique_name: opt && opt.value });

    logEvent('[AQ-Flood]', 'analyzer tab: user sets location to compare', opt.value);

    if (opt) {
      if (router.type === 'cba-embed') return setRouter('cba-embed-compare');
      setRouter('compare', { tab });
    }
  }

  render() {
    const {
      filters,
      locations,
      locationsCompare,
      setCommonFilter,
      setModal
    } = this.props;

    return (
      <div className="c-analyzer-filters">
        <div className="wrapper">
          <div className="row">
            <div className="col-md-6">
              {/* location */}
              <Field
                name="location-filter"
                label="Select a location"
                className="-bigger"
                onMoreInfo={() => setModal(generateModalOptions('info', 'location'))}
              >
                <CustomSelect
                  instanceId="location"
                  grouped
                  options={locations}
                  placeholder="Select a location"
                  value={filters.location}
                  onInputChange={this.onSearch}
                  onChange={this.onChangeLocation}
                />
              </Field>
              {/* future scenarios */}
              <Field
                name="future-scenario-filter"
                label="Select a future scenario"
                className="-bigger"
                onMoreInfo={() => setModal(generateModalOptions('info', 'future-scenario'))}
              >
                <CustomSelect
                  instanceId="scenario"
                  options={SCENARIO_OPTIONS}
                  placeholder="Select a future scenario"
                  value={filters.scenario}
                  onChange={opt => {
                    setCommonFilter({ scenario: opt && opt.value });
                    logEvent('[AQ-Flood]', 'analyzer tab: user sets scenario', opt.value);
                  }}
                />
              </Field>
            </div>
            <div className="col-md-6">
              {/* location compare */}
              <Field
                name="location-compare-filter"
                label="Compare with"
                className="-bigger"
              >
                <CustomSelect
                  instanceId="location-compare"
                  grouped
                  options={locationsCompare}
                  placeholder="Compare with..."
                  isDisabled={!filters.location}
                  value={filters.compareLocation}
                  onInputChange={this.onSearchCompare}
                  onChange={this.onChangeLocationCompare}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyzerFilters;
