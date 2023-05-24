import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, CustomSelect, Button, Icon } from 'aqueduct-components';
import debounce from 'lodash/debounce';
import Link from 'redux-first-router-link'

// constants
import { SCENARIO_OPTIONS } from 'constants/app';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class AnalyzerCompareFilters extends PureComponent {
  static propTypes = {
    filters: PropTypes.shape({
      location: PropTypes.string,
      scenario: PropTypes.string,
      locationCompare: PropTypes.string,
      scenarioCompare: PropTypes.string
    }).isRequired,
    router: PropTypes.object.isRequired,
    locations: PropTypes.array.isRequired,
    locationsCompare: PropTypes.array.isRequired,
    setCommonFilter: PropTypes.func.isRequired,
    setCostFilter: PropTypes.func.isRequired,
    setCommonCompareFilter: PropTypes.func.isRequired,
    setCostCompareFilter: PropTypes.func.isRequired,
    clearCompareFilters: PropTypes.func.isRequired,
    getLocations: PropTypes.func.isRequired,
    getCompareLocations: PropTypes.func.isRequired,
    setCompareLocations: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired,
    setInputCompare: PropTypes.func.isRequired,
    getCountryDefaults: PropTypes.func.isRequired,
    getCompareCountryDefaults: PropTypes.func.isRequired,
    resetWidgets: PropTypes.func.isRequired,
    resetWidgetsCompare: PropTypes.func.isRequired,
    setExistingProt: PropTypes.func.isRequired,
    setProtFut: PropTypes.func.isRequired
  }

  componentWillMount() {
    const {
      filters,
      getCompareCountryDefaults,
      setCostCompareFilter,
      setInputCompare,
      setExistingProt,
      setProtFut
    } = this.props;
    const { locationCompare } = filters;

    setInputCompare({ loading: true });

    if (locationCompare) {
      getCompareCountryDefaults({ location: locationCompare })
        .then((defaults) => {
          setInputCompare({ loading: false });
          setCostCompareFilter({
            estimated_costs: defaults.estimated_costs,
            existing_prot: defaults.existing_prot,
            prot_fut: defaults.prot_fut
          });
          setExistingProt(defaults.existing_prot);
          setProtFut(defaults.prot_fut);
        });
    }
  }

  onClearCompareFilters = () => {
    const { clearCompareFilters, setCompareLocations } = this.props;

    clearCompareFilters();
    setCompareLocations([]);
  }

  onChangeLocation = (opt) => {
    const {
      filters,
      setInput,
      setCommonFilter,
      setCostFilter,
      getCountryDefaults,
      resetWidgets,
      setExistingProt,
      setProtFut
    } = this.props;
    const { location } = filters;

    if ((opt && opt.value) === location) return;

    setInput({ loading: true });
    setCommonFilter({ geogunit_unique_name: opt && opt.value });

    resetWidgets('cba');

    getCountryDefaults({ location: opt.value })
      .then((defaults) => {
        setInput({ loading: false });
        setCostFilter({
          estimated_costs: defaults.estimated_costs,
          existing_prot: defaults.existing_prot,
          prot_fut: defaults.prot_fut
        });
        setExistingProt(defaults.existing_prot);
        setProtFut(defaults.prot_fut);
      });

    logEvent('[AQ-Flood]', 'analyzer compare tab: user sets location', opt.value);
  }

  onChangeLocationCompare = (opt) => {
    const {
      setCommonCompareFilter,
      setCostCompareFilter,
      filters,
      setInputCompare,
      getCompareCountryDefaults,
      resetWidgetsCompare,
      setExistingProt,
      setProtFut
    } = this.props;
    const { locationCompare } = filters;

    if ((opt && opt.value) === locationCompare) return;

    setInputCompare({ loading: true })
    setCommonCompareFilter({ geogunit_unique_name: opt && opt.value });

    resetWidgetsCompare('cba');

    getCompareCountryDefaults({ location: opt.value })
      .then((defaults) => {
        const {
          estimated_costs,
          existing_prot,
          prot_fut
        } = defaults;
        setInputCompare({ loading: false });
        setCostCompareFilter({
          estimated_costs,
          existing_prot,
          prot_fut
        });
        setExistingProt(existing_prot);
        setProtFut(prot_fut);
      });

    logEvent('[AQ-Flood]', 'analyzer compare tab: user sets location to compare', opt.value);
  }

  onSearch = debounce((value) => {
    const { getLocations } = this.props;

    if (value && value.length > 2 ) getLocations(value);
  }, 150)

  onSearchCompare = debounce((value) => {
    const { getCompareLocations } = this.props;

    if (value && value.length > 2 ) getCompareLocations(value);
  }, 150)

  render() {
    const {
      filters,
      locations,
      locationsCompare,
      router,
      setCommonCompareFilter,
      setCommonFilter
    } = this.props;
    const { type } = router;

    const route = type === 'cba-embed-compare' ? { type: 'cba-embed' } : { type: 'home', payload: { tab: 'cba' } };

    return (
      <div className="c-analyzer-compare-filters">
        <div className="wrapper">
          <div className="row">
            <div className="col-xs-12">
              <div className="go-back-container">
                <Icon
                  name="arrow-left"
                  className="-small"
                  theme="light"
                />
                  <Link 
                    to={route}
                    className="go-back-btn"
                  >
                    Go back
                  </Link>
              </div>
            </div>
          </div>
          <div className="row">
            {/* location filters */}
            <div className="col-md-6">
              <Field
                name="location-filter"
                label="Select a location"
                className="-bigger"
              >
                <CustomSelect
                  instanceId="location"
                  grouped
                  options={locations}
                  placeholder="Select a location"
                  value={filters.location}
                  onInputChange={this.onSearch}
                  onChange={this.onChangeLocation}
                  isClearable
                />
              </Field>
            </div>
            <div className="col-md-6">
              <div className="clear-comparison-section">
                <Field
                  name="location-compare-filter"
                  label="Select a location"
                  className="-bigger"
                >
                  <CustomSelect
                    instanceId="location-compare"
                    grouped
                    options={locationsCompare}
                    placeholder="Compare with..."
                    isDisabled={!filters.location}
                    value={filters.locationCompare}
                    onInputChange={this.onSearchCompare}
                    onChange={this.onChangeLocationCompare}
                  />
                </Field>
                <Button
                  onClick={this.onClearCompareFilters}
                  theme="blue"
                  className="-regular -bg-white"
                >
                  Clear comparison
                </Button>
              </div>
            </div>
          </div>
          {/* compare filters */}
          <div className="row">
            <div className="col-md-6">
              <Field
                name="scenario-filter"
                label="Select a Future Scenario"
                className="-bigger"
              >
                <CustomSelect
                  instanceId="scenario"
                  options={SCENARIO_OPTIONS}
                  placeholder="Select a scenario"
                  value={filters.scenario}
                  onChange={opt => {
                    setCommonFilter({ scenario: opt && opt.value });
                    logEvent('[AQ-Flood]', 'analyzer compare tab: user sets scenario', opt.value);
                  }}
                />
              </Field>
            </div>
            <div className="col-md-6">
              {/* scenario */}
              <Field
                name="scenario-compare-filter"
                label="Select a Future Scenario"
                className="-bigger"
              >
                <CustomSelect
                  instanceId="scenario-compare"
                  options={SCENARIO_OPTIONS}
                  placeholder="Select a scenario"
                  isDisabled={!filters.locationCompare}
                  value={filters.scenarioCompare}
                  onChange={opt => {
                    setCommonCompareFilter({ scenario: opt && opt.value });
                    logEvent('[AQ-Flood]', 'analyzer compare tab: user sets scenario to compare with', opt.value);
                  }}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyzerCompareFilters;
