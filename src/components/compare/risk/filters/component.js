import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Field, CustomSelect, Checkbox, Button, Icon } from 'aqueduct-components';
import debounce from 'lodash/debounce';
import Link from 'redux-first-router-link'

// constants
import {
  FLOOD_TYPE_OPTIONS,
  EXPOSURE_OPTIONS
} from 'constants/risk';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class RiskFilters extends PureComponent {
  static propTypes = {
    filters: PropTypes.shape({
      location: PropTypes.string,
      scenario: PropTypes.string,
      compareLocation: PropTypes.string
    }).isRequired,
    locations: PropTypes.array.isRequired,
    locationsCompare: PropTypes.array.isRequired,
    scenarios: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired
    })).isRequired,
    basins: PropTypes.array.isRequired,
    filtersCompare: PropTypes.object.isRequired,
    setCommonFilter: PropTypes.func.isRequired,
    setRiskFilter: PropTypes.func.isRequired,
    setRiskCompareFilter: PropTypes.func.isRequired,
    setCommonCompareFilter: PropTypes.func.isRequired,
    getLocations: PropTypes.func.isRequired,
    setCompareLocations: PropTypes.func.isRequired,
    getCompareLocations: PropTypes.func.isRequired,
    getCountryDefaults: PropTypes.func.isRequired,
    getCompareCountryDefaults: PropTypes.func.isRequired,
    clearCompareFilters: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired,
    setInputCompare: PropTypes.func.isRequired,
    setWidgets: PropTypes.func.isRequired,
    setWidgetsCompare: PropTypes.func.isRequired
  }

  state = { locationCompare: this.props.filters.compareLocation }

  componentWillMount() {
    const {
      filters,
      getCompareCountryDefaults,
      setRiskCompareFilter,
      setInputCompare,
      filtersCompare,
      basins
    } = this.props;
    const { location, compareLocation } = filters;
    const { flood, sub_scenario: subScenario } = filtersCompare;

    this.setState({
      isBasin: !!basins.find(_basin => _basin.value === location),
      isBasinCompare: !!basins.find(_basin => _basin.value === compareLocation)
    });

    if (compareLocation) {
      const additionalParams = {
        flood,
        sub_scenario: subScenario
      };

      getCompareCountryDefaults({ location: compareLocation, additionalParams })
        .then((defaults) => {
          const { existing_prot: existingProt } = defaults;
          setInputCompare({ loading: false });
          setRiskCompareFilter({ existing_prot: existingProt })
        });
    }
  }

  onSearch = debounce((value) => {
    const { getLocations } = this.props;

    if (value && value.length > 2 ) getLocations(value);
  }, 150)

  onChangeLocation = (opt) => {
    const { setCommonFilter, filters, setInput, getCountryDefaults } = this.props;
    const {
      location,
      flood,
      sub_scenario: subScenario
    } = filters;

    const additionalParams = {
      flood,
      sub_scenario: subScenario
    };

    this.setState({ isBasin: opt.type && opt.type === 'basin' });

    if ((opt && opt.value) === location) return;

    setInput({ loading: true })
    setCommonFilter({ geogunit_unique_name: opt && opt.value });

    getCountryDefaults({ location: opt.value, additionalParams })
      .then(() => { setInput({ loading: false }) })

    logEvent('[AQ-Flood]', `risk compare tab: user selects a country:`, opt.value);
  }

  onSearchCompare = debounce((value) => {
    const { getCompareLocations } = this.props;

    if (value && value.length > 2 ) getCompareLocations(value);
  }, 150)

  onChangeLocationCompare = (opt) => {
    const {
      filtersCompare,
      setInputCompare,
      setCommonCompareFilter,
      setRiskCompareFilter,
      getCompareCountryDefaults
    } = this.props;
    const {
      geogunit_unique_name: locationCompare,
      flood,
      sub_scenario: subScenario
    } = filtersCompare;
    const additionalParams = {
      flood,
      sub_scenario: subScenario
    };

    this.setState({ isBasinCompare: opt.type && opt.type === 'basin' });

    if ((opt && opt.value) === locationCompare) return;

    setInputCompare({ loading: true });

    this.setState({ locationCompare: opt.value });

    getCompareCountryDefaults({ location: opt.value, additionalParams })
      .then((defaults) => {
        const { existing_prot: existingProt } = defaults;

        setInputCompare({ loading: false });
        setRiskCompareFilter({
          existing_prot: existingProt,
          geogunit_unique_name: opt.value
        });
        setCommonCompareFilter({ geogunit_unique_name: opt && opt.value });
      });

    logEvent('[AQ-Flood]', `risk compare tab: user selects a country to compare with:`, opt.value);
  }

  onCheckAdvancedSettings = ({ checked }) => {
    const {
      setWidgets,
      setWidgetsCompare,
      setRiskFilter,
      setRiskCompareFilter,
      scenarios
    } = this.props;

    setWidgets({ nextTab: checked ? 'advanced_risk' : 'risk' });
    setWidgetsCompare({ nextTab: checked ? 'advanced_risk' : 'risk' });

    setRiskFilter({
      advanced_settings: checked,
      ...!checked && { scenario: scenarios[0].value }
    });

    setRiskCompareFilter({
      advanced_settings: checked,
      ...!checked && { scenario: scenarios[0].value }
    })

    logEvent('[AQ-Flood]', `risk compare tab: user checks on advanced settings:`, checked.toString());
  }

  onClearCompareFilters = () => {
    const { clearCompareFilters, setCompareLocations } = this.props;

    clearCompareFilters();
    setCompareLocations([]);
  }

  onSelectFloodType = ({ value }) => {
    const {
      setRiskFilter,
      getCountryDefaults,
      setInput
    } = this.props;
    const additionalParams = {
      flood: value,
      ...value === 'riverine' && { sub_scenario: false }
    };

    setInput({ loading: true });

    getCountryDefaults({ location: value, additionalParams })
      .then(() => {
        setInput({ loading: false });
        setRiskFilter({ flood: value });
      });

    logEvent('[AQ-Flood]', `risk compare tab: user selects flood type:`, value);
  }

  onSelectFloodTypeCompare = ({ value }) => {
    const {
      setInputCompare,
      setRiskCompareFilter,
      getCompareCountryDefaults,
      filtersCompare: { geogunit_unique_name: location }
    } = this.props;
    const additionalParams = {
      flood: value,
      ...value === 'riverine' && { sub_scenario: false }
    };

    setInputCompare({ loading: true });

    getCompareCountryDefaults({ location, additionalParams })
      .then((defaults) => {
        const { existing_prot: existingProt } = defaults;

        setInputCompare({ loading: false });
        setRiskCompareFilter({
          existing_prot: existingProt,
          flood: value
        });
      });

      logEvent('[AQ-Flood]', `risk compare tab: user selects flood type to compare with:`, value);
  }

  onCheckSubsidcience = ({ checked }) => {
    const {
      setRiskFilter,
      setInput,
      getCompareCountryDefaults,
      filters: { location, flood }
    } = this.props;
    const additionalParams = {
      flood,
      sub_scenario: checked
    };

    setInput({ loading: true });

    getCompareCountryDefaults({ location, additionalParams })
      .then((defaults) => {
        const { existing_prot: existingProt } = defaults;

        setInput({ loading: false });
        setRiskFilter({
          existing_prot: existingProt,
          sub_scenario: checked
        });
      });

    logEvent('[AQ-Flood]', `risk compare tab: user checks on subsidence:`, checked.toString());
  }

  onCheckSubsidcienceCompare = ({ checked }) => {
    const {
      setRiskCompareFilter,
      getCompareCountryDefaults,
      setInputCompare,
      filtersCompare: {
        geogunit_unique_name: location,
        flood
      }
    } = this.props;
    const additionalParams = {
      flood,
      sub_scenario: checked
    };

    setInputCompare({ loading: true });

    getCompareCountryDefaults({ location, additionalParams })
      .then((defaults) => {
        const { existing_prot: existingProt } = defaults;

        setInputCompare({ loading: false });
        setRiskCompareFilter({
          existing_prot: existingProt,
          sub_scenario: checked
        });
      });

    logEvent('[AQ-Flood]', `risk compare tab: user checks on subsidence to compare with:`, checked.toString());
  }

  render() {
    const {
      filters,
      filtersCompare,
      locations,
      locationsCompare,
      scenarios,
      setRiskFilter,
      setRiskCompareFilter
    } = this.props;
    const {
      locationCompare,
      isBasin,
      isBasinCompare
    } = this.state;
    const isCoastal = filters.flood === 'coastal';
    const isCoastalCompare = filtersCompare.flood === 'coastal';

    return (
      <div className="c-risk-filters">
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
                    to={{ type: 'home', payload: { tab: 'risk' } }}
                    className="go-back-btn"
                  >
                    Go back
                  </Link>
              </div>
            </div>
          </div>
          {/* advanced settings */}
          <div className="row">
            <div className="col-md-6">
              <Checkbox
                label="Customize Analysis"
                name="advanced_settings"
                theme="light"
                checked={filters.advanced_settings}
                onChange={this.onCheckAdvancedSettings}
              />
            </div>
            <div className="col-md-6">
              <div className="clear-comparison-section">
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
          {/* locations */}
          <div className="row">
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
                />
              </Field>
            </div>
            <div className="col-md-6">
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
                  value={locationCompare}
                  onInputChange={this.onSearchCompare}
                  onChange={this.onChangeLocationCompare}
                />
              </Field>
            </div>
          </div>
          {/* scenarios */}
          <div className="row">
            <div className="col-md-6">
              <Field
                name="future-scenario-filter"
                label="Select a future scenario"
                className="-bigger"
                disabled={!filters.advanced_settings}
              >
                <CustomSelect
                  instanceId="scenario"
                  options={scenarios}
                  isDisabled={!filters.advanced_settings}
                  placeholder="Select a future scenario"
                  value={filters.scenario}
                  onChange={opt => {
                    setRiskFilter({ scenario: opt && opt.value })
                    logEvent('[AQ-Flood]', `risk compare tab: user selects scenario:`, opt.value);
                  }}
                />
              </Field>
            </div>
            <div className="col-md-6">
              <Field
                name="future-scenario-filter-compare"
                label="Select a future scenario"
                className="-bigger"
                disabled={!filters.advanced_settings}
              >
                <CustomSelect
                  instanceId="scenario-compare"
                  options={scenarios}
                  isDisabled={!filters.advanced_settings}
                  placeholder="Select a future scenario"
                  value={filtersCompare.scenario}
                  onChange={opt => {
                    setRiskCompareFilter({ scenario: opt && opt.value })
                    logEvent('[AQ-Flood]', `risk compare tab: user selects scenario to compare with:`, opt.value);
                  }}
                />
              </Field>
            </div>
          </div>
          {/* flood type & risk indicator */}
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  {!isBasin && (
                    <Field
                      name="flood-type-filter"
                      label="Flood Type"
                      className="-bigger"
                    >
                      <CustomSelect
                        instanceId="flood"
                        options={FLOOD_TYPE_OPTIONS}
                        placeholder="Select a flood type..."
                        value={filters.flood}
                        onChange={this.onSelectFloodType}
                      />
                    </Field>)}
                </div>
                <div className="col-md-6">
                  <Field
                    name="risk-indicator-filter"
                    label="Risk Indicator"
                    className="-bigger"
                  >
                    <CustomSelect
                      instanceId="indicator"
                      options={EXPOSURE_OPTIONS}
                      placeholder="Select a risk indicator..."
                      value={filters.exposure}
                      onChange={opt => {
                        setRiskFilter({ exposure: opt && opt.value });
                        logEvent('[AQ-Flood]', `risk compare tab: user selects risk indicator:`, opt.value);
                      }}
                    />
                  </Field>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  {!isBasinCompare && (
                    <Field
                      name="flood-type-filter-compare"
                      label="Flood Type"
                      className="-bigger"
                    >
                      <CustomSelect
                        instanceId="flood-compare"
                        options={FLOOD_TYPE_OPTIONS}
                        placeholder="Select a flood type..."
                        value={filtersCompare.flood}
                        onChange={this.onSelectFloodTypeCompare}
                      />
                    </Field>)}
                </div>
                <div className="col-md-6">
                  <Field
                    name="risk-indicator-filter-compare"
                    label="Risk Indicator"
                    className="-bigger"
                  >
                    <CustomSelect
                      instanceId="indicator-compare"
                      options={EXPOSURE_OPTIONS}
                      placeholder="Select a risk indicator..."
                      value={filtersCompare.exposure}
                      onChange={opt => {
                        setRiskCompareFilter({ exposure: opt && opt.value });
                        logEvent('[AQ-Flood]', `risk compare tab: user selects risk indicator to compare with:`, opt.value);
                      }}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
          {/* subsidience */}
          <div className="row">
            <div className="col-md-6">
              {isCoastal && (
                <Checkbox
                  label="Subsidence"
                  name="sub_scenario"
                  theme="light"
                  checked={filters.sub_scenario}
                  onChange={this.onCheckSubsidcience}
                />)}
            </div>
            <div className="col-md-6">
              {isCoastalCompare && (
                <Checkbox
                  label="Subsidence"
                  name="sub_scenario-compare"
                  theme="light"
                  checked={filtersCompare.sub_scenario}
                  onChange={this.onCheckSubsidcienceCompare}
                />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RiskFilters;
