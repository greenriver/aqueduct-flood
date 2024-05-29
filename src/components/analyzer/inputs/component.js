import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  Field,
  CustomSelect,
  Range,
  Slider,
  Spinner
} from 'aqueduct-components';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

// components
import SectionHeader from 'components/ui/section-header';
import SliderInput from 'components/ui/slider-input';

// constants
import {
  DESIGN_PROTECTION_LEVEL_YEAR_OPTIONS,
  EXISTING_PROTECTION_LEVEL_OPTIONS,
  IMPLEMENTATION_YEAR_OPTIONS,
  INFRASTRUCTURE_LIFE_TIME_OPTIONS,
  UNIT_COST_OPTIONS,
  DISCOUNT_RATE_OPTIONS,
  OPERATION_MAINTENANCE_COST_OPTIONS
} from 'constants/analyzer';

// utils
import { generateModalOptions } from 'utils/modal';

// styles
import './styles.scss';

class AnalyzerInputs extends PureComponent {
  static propTypes = {
    filters: PropTypes.shape({
      existing_prot: PropTypes.number,
      prot_fut: PropTypes.number,
      ref_year: PropTypes.number.isRequired,
      implementation_start: PropTypes.number.isRequired,
      implementation_end: PropTypes.number.isRequired,
      infrastructure_life: PropTypes.number.isRequired,
      benefits_start: PropTypes.number.isRequired,
      user_urb_cost: PropTypes.number,
      discount_rate: PropTypes.number.isRequired,
      om_costs: PropTypes.number.isRequired
    }).isRequired,
    inputState: PropTypes.shape({ loading: PropTypes.bool.isRequired }).isRequired,
    isCompare: PropTypes.bool,
    onChangeFilter: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired,
    getCountryDefaults: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired,
    setExistingProt: PropTypes.func.isRequired,
    setProtFut: PropTypes.func.isRequired,
    setExistingProtCompare: PropTypes.func.isRequired,
    setProtFutCompare: PropTypes.func.isRequired
  };

  static defaultProps = { isCompare: false }

  constructor(props) {
    super(props);

    const { filters } = props;
    const {
      existing_prot: existingProt,
      user_urb_cost: estimatedCosts,
    } = filters;
    const indexExistingProtection = EXISTING_PROTECTION_LEVEL_OPTIONS.findIndex(opt => opt === existingProt);
    const nextIndex = indexExistingProtection + 1 >= EXISTING_PROTECTION_LEVEL_OPTIONS.length ?
      indexExistingProtection : indexExistingProtection + 1;

    this.designProtectionOptions = EXISTING_PROTECTION_LEVEL_OPTIONS.slice(nextIndex);
    this.designProtectionMarks = {}
    this.designProtectionOptions.forEach(opt => { this.designProtectionMarks[opt] = opt; });

    this.state = {
      existingProtValue: existingProt,
      estimatedCosts,
      costToggle: false
    };
  }

  componentWillMount() {
    const {
      filters,
      getCountryDefaults,
      onChangeFilter,
      setExistingProt,
      setInput,
      setProtFut
    } = this.props;
    const { geogunit_unique_name: location, existing_prot: existingProt } = filters;

    if (location && !existingProt) {
      setInput({ loading: true });

      getCountryDefaults({ location })
        .then((defaults) => {
          setInput({ loading: false });
          onChangeFilter({
            user_urb_cost: defaults.estimated_costs < 2 ? defaults.estimated_costs * 7 : defaults.estimated_costs,
            existing_prot: defaults.existing_prot,
            prot_fut: defaults.prot_fut,
          });
          setExistingProt(defaults.existing_prot);
          setProtFut(defaults.prot_fut);
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      existing_prot: nextExistingProt,
      prot_fut: nextProtFut,
      user_urb_cost: nextEstimatedCosts
    } = nextProps.filters;
    const { filters } = this.props;
    const { existing_prot: existingProt, prot_fut: protFut } = filters;
    const existingProtChanged = !isEqual(existingProt, nextExistingProt);
    const protFutChanged = !isEqual(protFut, nextProtFut);

    if (existingProtChanged) {
      const indexExistingProtection = EXISTING_PROTECTION_LEVEL_OPTIONS.findIndex(opt => opt === nextExistingProt);
      const nextIndex = indexExistingProtection + 1 >= EXISTING_PROTECTION_LEVEL_OPTIONS.length ?
        indexExistingProtection : indexExistingProtection + 1;

      this.designProtectionOptions = EXISTING_PROTECTION_LEVEL_OPTIONS.slice(nextIndex);
      this.designProtectionMarks = {};
      this.designProtectionOptions.forEach(opt => { this.designProtectionMarks[opt] = opt; });

      this.setState({
        existingProtValue: nextExistingProt,
        protFut: AnalyzerInputs.getProtFutValue(nextExistingProt),
        estimatedCosts: nextEstimatedCosts
      });
    }

    if (protFutChanged && !existingProtChanged) {
      this.setState({ protFut: nextProtFut });
    }
  }

  onChangeExistingProtectionLevel = debounce((value) => {
    const {
      onChangeFilter,
      setExistingProt,
      setProtFut,
      isCompare,
      setExistingProtCompare,
      setProtFutCompare
    } = this.props;
    const protFutValue = AnalyzerInputs.getProtFutValue(value);

    if (isCompare) {
      setExistingProtCompare(value);
      setProtFutCompare(protFutValue);
    } else {
      setExistingProt(value);
      setProtFut(protFutValue);
    }

    onChangeFilter({
      existing_prot: value,
      prot_fut: protFutValue
    });
  }, 300);

  onChangeDesignProtectionLevel = debounce((value) => {
    const {
      onChangeFilter,
      isCompare,
      setProtFutCompare,
      setProtFut
    } = this.props;

    if (isCompare) {
      setProtFutCompare(value);
    } else {
      setProtFut(value);
    }

    onChangeFilter({ prot_fut: value });
    setProtFut(value);
  }, 300)

  static getProtFutValue = (existingProt) => {
    let result = 0;
    let found = false;

    EXISTING_PROTECTION_LEVEL_OPTIONS.forEach((value, index) => {
      const nextLevel = EXISTING_PROTECTION_LEVEL_OPTIONS[index + 1] ?
        EXISTING_PROTECTION_LEVEL_OPTIONS[index + 1] : EXISTING_PROTECTION_LEVEL_OPTIONS[index]

      if ((existingProt >= value && existingProt < nextLevel) && !found) {
        result = nextLevel
        found = true;
      }
    })

    return result;
  }

  render() {
    const { filters, inputState, onChangeFilter, setModal } = this.props;
    const { loading } = inputState;
    const { existingProtValue, protFut, estimatedCosts, costToggle } = this.state;

    return (
      <div className="c-analyzer-inputs">
        {loading && <Spinner />}
        <SectionHeader title="input table" />
        <section>
          <div className="category">
            <span className="category-name">
              Design Protection Standards
            </span>
            <Button
              onClick={() => setModal(generateModalOptions('info', 'design-protection-standards'))}
            >
              <Icon
                name="question"
                theme="dark"
                className="-round"
              />
            </Button>
          </div>
          <div className="selectors-container">
            {/* existing protection level */}
            <Field
              name="existing-protection-level"
              theme="dark"
              label="Existing Protection Level (Return Period)"
              className="-bolder"
              onClick={() => setModal(generateModalOptions('info', 'design-protection-standards'))}
            >
              <SliderInput
                name="existing-protection-level"
                min={EXISTING_PROTECTION_LEVEL_OPTIONS[0]}
                max={EXISTING_PROTECTION_LEVEL_OPTIONS[EXISTING_PROTECTION_LEVEL_OPTIONS.length - 1]}
                theme="dark"
                value={existingProtValue}
                defaultValue={existingProtValue}
                onChange={(value) => this.setState({ existingProtValue: value })}
                onAfterChange={this.onChangeExistingProtectionLevel}
              />
            </Field>

            <Field
              name="design-protection-level"
              theme="dark"
              label="Design Protection Level (Return Period)"
              className="-higher-margin-top -bolder"
            >
              <Slider
                min={this.designProtectionOptions[0]}
                max={this.designProtectionOptions[this.designProtectionOptions.length - 1]}
                disabled={this.designProtectionOptions.length <= 1}
                theme="dark"
                step={null}
                marks={this.designProtectionMarks}
                value={protFut}
                onChange={(value) => this.setState({ protFut: value })}
                defaultValue={AnalyzerInputs.getProtFutValue(existingProtValue)}
                onAfterChange={this.onChangeDesignProtectionLevel}
              />
            </Field>

            <Field
              name="target-year-design-protection-level"
              theme="dark"
              label="Target Year for the Design Protection Level"
              className="-inline -bolder"
            >
              <CustomSelect
                instanceId="year"
                options={DESIGN_PROTECTION_LEVEL_YEAR_OPTIONS}
                placeholder="Select a year"
                theme="dark"
                value={filters.ref_year}
                onChange={opt => onChangeFilter({ ref_year: opt && opt.value })}
              />
            </Field>
          </div>
        </section>
        <section>
          <div className="category">
            <span className="category-name">
              Timeframes
            </span>
            <Button
              onClick={() => setModal(generateModalOptions('info', 'timeframes'))}
            >
              <Icon name="question" theme="dark" className="-round" />
            </Button>
          </div>
          <div className="selectors-container">
            <Field
              name="implementation-year"
              theme="dark"
              label="Implementation Range"
              className="-higher-margin-top -bolder"
            >
              <Range
                min={IMPLEMENTATION_YEAR_OPTIONS[0]}
                max={IMPLEMENTATION_YEAR_OPTIONS[1]}
                theme="dark"
                defaultValue={[filters.implementation_start, filters.implementation_end]}
                onAfterChange={value => {
                  onChangeFilter({
                    implementation_start: value[0],
                    implementation_end: value[1],
                    benefits_start: value[0]
                  })
                }}
                pushable
              />
            </Field>

            <Field
              name="infrastructure-life-time"
              theme="dark"
              label="Infrastructure Life Time"
              className="-bolder"
            >
              <SliderInput
                name="infrastructure-life-time"
                min={INFRASTRUCTURE_LIFE_TIME_OPTIONS[0]}
                max={INFRASTRUCTURE_LIFE_TIME_OPTIONS[1]}
                theme="dark"
                value={filters.infrastructure_life}
                defaultValue={filters.infrastructure_life}
                onChange={value => { onChangeFilter({ infrastructure_life: value }) }}
                onAfterChange={value => { onChangeFilter({ infrastructure_life: value }) }}
              />
            </Field>

            <Field
              name="benefit-start-year"
              theme="dark"
              label="Benefit Start Year"
              className="-bolder"
            >
              <SliderInput
                name="benefit-start-year"
                min={filters.implementation_start}
                max={filters.implementation_end}
                theme="dark"
                value={filters.benefits_start}
                defaultValue={filters.benefits_start}
                onChange={value => { onChangeFilter({ benefits_start: value }) }}
                onAfterChange={value => { onChangeFilter({ benefits_start: value }) }}
              />
            </Field>
          </div>
        </section>
        <section>
          <div className="category">
            <span className="category-name">
              Costs
            </span>
            <Button
              onClick={() => setModal(generateModalOptions('info', 'costs'))}
            >
              <Icon name="question" theme="dark" className="-round" />
            </Button>
          </div>
          <div className="selectors-container">
            <div className='toggle-wrapper'>
              <span>Adjust by factor</span>
              <div className='toggle'>
                <button onClick={() => this.setState({ costToggle: !costToggle})} className={`toggle-button ${!costToggle ? 'toggle-on': ''}`} />
                <button onClick={() => this.setState({ costToggle: !costToggle})} className={`toggle-button ${costToggle ? 'toggle-on': ''}`} />
              </div>
            </div>
            
            <Field
              name="user-urb-cost"
              theme="dark"
              label="Adjustable Construction Cost"
              className="-bolder"
            >
              { !costToggle ? 
              <Slider
                name="user-urb-cost-slider"
                min={0.8}
                max={1.21}
                step={0.01}
                theme="dark"
                value={estimatedCosts/7}
                formatValue={value => `${(value*100).toFixed(0)}%`}
                onChange={(value) => this.setState({ estimatedCosts: (value*7).toFixed(2)})}
                onAfterChange={value => { onChangeFilter({ user_urb_cost: (value*7).toFixed(2) }) }}
              />
              :
              <Slider
                name="user-urb-cost-slider"
                min={UNIT_COST_OPTIONS[0]}
                max={UNIT_COST_OPTIONS[1]}
                step={0.01}
                theme="dark"
                value={estimatedCosts}
                formatValue={value => `${(value).toFixed(2)} ($million/meter/kilometer)`}
                onChange={(value) => this.setState({ estimatedCosts: (value).toFixed(2) })}
                onAfterChange={value => { onChangeFilter({ user_urb_cost: (value).toFixed(2) }) }}
              />}
              <div className='cost-labels'>
                <div>Less expensive</div>
                <div>More expensive</div>
              </div>
            </Field>
            <Field
              name="discount-rate"
              theme="dark"
              label="Annual Discount Rate (%)"
              className="-bolder"
            >
              <SliderInput
                name="discount-rate"
                min={DISCOUNT_RATE_OPTIONS[0]}
                max={DISCOUNT_RATE_OPTIONS[1]}
                theme="dark"
                value={filters.discount_rate}
                defaultValue={filters.discount_rate}
                formatValue={value => `${value}%`}
                onChange={value => { onChangeFilter({ discount_rate: value }) }}
                onAfterChange={value => { onChangeFilter({ discount_rate: value }) }}
              />
            </Field>
            <Field
              name="operation-maintenance-cost"
              theme="dark"
              label="Operation & Maintenance Cost (%)"
              className="-bolder"
            >
              <SliderInput
                name="operation-maintenance-cost"
                min={OPERATION_MAINTENANCE_COST_OPTIONS[0]}
                max={OPERATION_MAINTENANCE_COST_OPTIONS[1]}
                theme="dark"
                value={filters.om_costs}
                defaultValue={filters.om_costs}
                formatValue={value => `${value}%`}
                onChange={value => { onChangeFilter({ om_costs: value }) }}
                onAfterChange={value => { onChangeFilter({ om_costs: value }) }}
              />
            </Field>
          </div>
        </section>
      </div>
    );
  }
}

export default AnalyzerInputs;
