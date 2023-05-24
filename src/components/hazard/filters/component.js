import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Field,
  Timeline,
  CustomSelect,
  Checkbox,
  Button,
  Icon
} from 'aqueduct-components';

// constants
import {
  RIVERINE_PROJECTION_MODEL_OPTIONS,
  COASTAL_PROJECTION_MODEL_OPTIONS,
  FLOOD_TYPES_OPTIONS,
} from 'constants/hazard';
import { SCENARIO_OPTIONS } from 'constants/app';

// utils
import { generateModalOptions } from 'utils/modal';
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class HazardFilters extends PureComponent {
  static propTypes = {
    years: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    setModal: PropTypes.func.isRequired,
    setHazardFilter: PropTypes.func.isRequired,
    resetActiveLayers: PropTypes.func.isRequired
  }

  onChangeYear = ({ value }) => {
    const { setHazardFilter } = this.props;

    logEvent('[AQ-Flood]', 'hazard tab: user sets year', value);

    setHazardFilter({
      year: value,
      ...value === '1980.0' && { scenario: 'historical' }
    });
  }

  onChangeFlood = (opt) => {
    const { setHazardFilter, resetActiveLayers } = this.props;
    const isRiverine = opt && opt.value === 'inunriver';

    const projectionModelOptions = isRiverine ?
      RIVERINE_PROJECTION_MODEL_OPTIONS : COASTAL_PROJECTION_MODEL_OPTIONS;

    setHazardFilter({
      flood: opt && opt.value,
      sub_scenario: !isRiverine,
      projection_model: projectionModelOptions.find(_opt => _opt.default).value
    });

    logEvent('[AQ-Flood]', 'hazard tab: user sets flood type', isRiverine ? 'Riverine' : 'Coastal');

    resetActiveLayers();
  }

  render() {
    const {
      years,
      filters,
      setHazardFilter,
      setModal
    } = this.props;
    const isCoastal = filters.flood === 'inuncoast';
    const isBaseline = filters.year === '2010.0';
    const modelProjectionOptions = isCoastal ?
      COASTAL_PROJECTION_MODEL_OPTIONS : RIVERINE_PROJECTION_MODEL_OPTIONS;

    return (
      <div className="c-hazard-filters">
        <div className="wrapper">
          <div className="row">
            <div className="col-xs-12">
              {/* year */}
              <Field
                name="hazard-year"
                label="Year"
                className="-bigger"
                customClass="field-timeline"
                onMoreInfo={() => setModal(generateModalOptions('info', 'year'))}
              >
                <Timeline
                  items={years}
                  onChange={this.onChangeYear}
                />
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-md-4">
              {/* flood */}
              <Field
                name="hazard-flood"
                label="Flood type"
                className="-bigger"
                onMoreInfo={() => setModal(generateModalOptions('info', 'flood-type'))}
              >
                <CustomSelect
                  instanceId="hazard-flood"
                  options={FLOOD_TYPES_OPTIONS}
                  placeholder="Select a flood type..."
                  value={filters.flood}
                  onChange={this.onChangeFlood}
                />
              </Field>
            </div>
            <div className="col-xs-12 col-md-4">
              <Field
                name="hazard-scenario"
                label="Future Scenario"
                disabled={isBaseline}
                className="-bigger"
                onMoreInfo={() => setModal(generateModalOptions('info', 'future-scenario'))}
              >
                <CustomSelect
                  instanceId="hazard-scenario"
                  isDisabled={isBaseline}
                  options={SCENARIO_OPTIONS}
                  placeholder="Select a scenario"
                  value={filters.scenario}
                  onChange={(opt) => {
                    setHazardFilter({ scenario: opt && opt.value });
                    logEvent('[AQ-Flood]', 'hazard tab: user sets scenario', opt.value === 'rcp4p5' ? 'Optimistic' : 'Business as usual / Pessimistic');
                  }}
                />
              </Field>
            </div>
            <div className="col-xs-12 col-md-4">
              <Field
                name="hazard-projection-model"
                label="Projection Model"
                disabled={isBaseline}
                className="-bigger"
                onMoreInfo={() => setModal(generateModalOptions('info', 'projection-model'))}
              >
                <CustomSelect
                  instanceId="hazard-projection-model"
                  isDisabled={isBaseline}
                  options={modelProjectionOptions}
                  placeholder="Select a projection model"
                  value={filters.projection_model}
                  onChange={opt => {
                    setHazardFilter({ projection_model: opt && opt.value });
                    logEvent('[AQ-Flood]', 'hazard tab: user sets projection model', opt.value);
                  }}
                />
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="checkbox-container">
                <Checkbox
                  label="Subsidence"
                  name="hazard-sub_scenario"
                  theme="light"
                  disabled={!isCoastal}
                  checked={filters.sub_scenario}
                  onChange={({ checked }) => {
                    setHazardFilter({ sub_scenario: checked });
                    logEvent('[AQ-Flood]', 'hazard tab: user sets subsidence option', checked.toString());
                  }}
                />
                <Button
                  onClick={() => setModal(generateModalOptions('info', 'subsidience'))}
                >
                  <Icon name="question" className="-round" theme="light" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HazardFilters;
