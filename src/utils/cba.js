import { EXISTING_PROTECTION_LEVEL_OPTIONS } from 'constants/analyzer';
import { SCENARIO_OPTIONS } from 'constants/app';

export const getUniqueVocabulary = (filters = {}, right = false) => {
  const { year, scenario } = filters;

  const scenarioIndex = SCENARIO_OPTIONS.findIndex(_scenario => _scenario.value === scenario);
  const scenarioToSend = !right ? 'historical' : SCENARIO_OPTIONS[scenarioIndex].value;
  const model = right ? '0000GFDL-ESM2M' : '000000000WATCH';

  return `cba_inunriver_${year}_${scenarioToSend}_${model}_None_None`;
}

export const calculateClosestPeriodRange = (returnPeriod) =>
  EXISTING_PROTECTION_LEVEL_OPTIONS.reduce((prev, curr) =>
    (returnPeriod >= prev && returnPeriod < curr) ? prev: curr);

export const calculateNextPeriodRange = (returnPeriod) =>
  EXISTING_PROTECTION_LEVEL_OPTIONS.reduce((prev, curr) =>
    returnPeriod > prev ? curr : prev)


export default {
  getUniqueVocabulary,
  calculateClosestPeriodRange,
  calculateNextPeriodRange
};
