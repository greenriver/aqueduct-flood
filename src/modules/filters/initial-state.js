export default {
  // common
  common:  {
    geogunit_unique_name: 'Japan',
    scenario: 'business as usual'
  },
  // hazard
  hazard: {
    year: '2010.0',
    flood: 'inunriver',
    scenario: 'rcp8p5',
    projection_model: '0000GFDL-ESM2M',
    sub_scenario: true
  },
  // risk
  risk: {
    scenario: 'business as usual',
    flood: 'riverine',
    exposure: 'urban_damage_v2',
    existing_prot: null,
    sub_scenario: false,
    advanced_settings: false,
  },
  // cost-benefit analyzer
  cba: {
    // original_existing_prot: null,
    // original_prot_fut: null,
    // original_estimated_costs: null,
    existing_prot: null,
    prot_fut: null,
    ref_year: 2050,
    implementation_start: 2020,
    implementation_end: 2040,
    infrastructure_life: 80,
    benefits_start: 2025,
    user_urb_cost: null,
    discount_rate: 5,
    // estimated_costs: null,
    om_costs: 1
  }
};
