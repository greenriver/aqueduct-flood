import React from 'react';
import PropTypes from 'prop-types';

import { Slider } from 'aqueduct-components';

// styles
import './styles.scss';

const SliderInput = (props) => {
  const {
    name,
    min,
    max,
    value,
    theme,
    disabled,
    onChange,
    onAfterChange
  } = props;

  const handleChange = (evt) => {
    onChange(+evt.currentTarget.value);
    onAfterChange(+evt.currentTarget.value);
  };

  const handleKeyPress = (evt) => {
    if (evt.key === 'Enter') { onAfterChange(+evt.currentTarget.value) }
  };

  return (
    <div className="c-slider-input">
      <input
        type="number"
        name={`${name}-input`}
        className="c-slider-input__input"
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <Slider
        name={`${name}-slider`}
        min={min}
        max={max}
        customClass="c-slider-input__slider"
        theme={theme}
        value={value}
        onChange={onChange}
        defaultValue={value}
        onAfterChange={onAfterChange}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}

SliderInput.defaultProps = {
  theme: 'dark',
  disabled: false
}

SliderInput.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  theme: PropTypes.oneOf([
    'dark',
    'light'
  ]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onAfterChange: PropTypes.func.isRequired,
}

export default SliderInput;
