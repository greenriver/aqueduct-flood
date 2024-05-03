const renderProjectionModelTable =
  `<div class="projection-model-table">
    <table>
      <thead>
        <tr>
          <td>
            Code
          </td>
          <td>
            Organization
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            GFDL-ESM2M
          </td>
          <td>
            Geophysical Fluid Dynamics Laboratory (NOAA)
          </td>
        </tr>
        <tr>
          <td>
            HadGEM2-es
          </td>
          <td>
            Met Office Hadley Centre
          </td>
        </tr>
        <tr>
          <td>
            IPSL-CM5A-LR
          </td>
          <td>
            Institut Pierre Simon Laplace
          </td>
        </tr>
        <tr>
          <td>
            MIROC-ESM-CHEM
          </td>
          <td>
            Atmosphere and Ocean Research Institute (The University of Tokyo), National
            Institute for Environmental Studies, and Japan Agency for Marine-Earth Science and Technology
          </td>
        </tr>
        <tr>
          <td>
            NorESM1-M
          </td>
          <td>
            Bjerknes Centre for Climate Research, Norwegian Meteorological Institute
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;

export const MODAL_INFO_DEFINITIONS = {
  // hazard
  'year': {
    title: 'Year',
    instructions: '<p>Select a timeframe for the flood maps.</p>',
    description: `<p>"Baseline" represents current (2010) expected annual flood extent and depth.
      Future years of “2030”, “2050”, and “2080” represent projected expected annual flood extent and depth.
      For future years, also specify the Future Scenario and Project Model of interest.</p>`
  },
  'flood-type': {
    title: 'Flood Type',
    instructions: '<p>Select the type of flood hazard.</p>',
    description: `<p>The “Coastal” hazard represents flooding from storm surges and occurs along coastlines
      around the world. The “Riverine” hazard represents flooding from river overflow and occurs
      in river basins with an area of at least 10,000 km2.</p>`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'future-scenario': {
    title: 'Future Scenario',
    instructions: '<p>Select a socioeconomic and climate scenario to project flooding in future years.</p>',
    description: `<p>The "Business as Usual" scenario (Representative Concentration Pathways (RCP) 8.5, Shared Socioeconomic Pathway (SSP) 2) represents a
      pessimistic climate scenario under Business as Usual development. In other words, the world would see steadily rising carbon emissions and stable economic development.
      The "Optimistic" scenario (RCP 4.5, SSP 2) represents a world with carbon emissions peaking and declining by 2040 and stable economic development.
      The "Pessimistic" scenario (RCP 8.5, SSP 3) represents a fragmented world with steadily rising global carbon emissions and uneven economic development.</p>`,
    source: `<p>The scenarios are based on the <a href="https://www.ipcc.ch/report/ar5/syr/" target="_blank" rel="noopener noreferrer">IPCC 5th assessment report</a>.</p>`
  },
  'projection-model': {
    title: 'Projection Model',
    instructions: '<p>Select a model to project inundation in future years. Each model is forced by the climate scenario chosen in Future Scenario.</p>',
    description: `<p>For “Coastal” floods, projection models refer to simulations of sea level change derived from the RISES-AM project.
      Three different probabilities for sea level change are available: 5%, 50% and 95%.</p>
      <p>For “Riverine” floods, projection models refer to five common general circulation models from the following organizations:</p>
      ${renderProjectionModelTable}`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`

  },
  'subsidience': {
    title: 'Subsidence',
    instructions: `<p>Available for Coastal floods only. Check the “Subsidence” box to project inundation depths in future years using both
      climate change and land subsidence scenarios. Uncheck “Subsidence” to project inundation depths in future years using only climate change scenarios.</p>`,
    description: '<p>Subsidence refers to the lowering of land levels. In this analysis, human-induced land subsidence was caused specifically by groundwater extraction.</p>',
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'flood-magnitude': {
    title: 'Flood magnitude (return period in years)',
    instructions: '<p>Select the severity of the flooding hazard, expressed in return periods.</p>',
    description: `<p>Smaller flood occur more regularly than larger floods. For example, a 5-year flood (20% probability of occurrence per year) is less severe
      than a 50-year (2% probability of occurrence per year). The reference year for the flood magnitude is the selected year, not the baseline.
      For example, the maps can display what a 100-year flood will look like in 2030, not what a current 100-year flood will look like in 2030.
      Note: the 2-year flood is bankfull, and is ignored in our risk calculation.</p>`
  },
  // risk
  'location': {
    title: 'Select a location',
    instructions: '<p>Type in or select from the drop-down menu the name of a country, state, or river basin.</p>'
  },
  'risk-indicator': {
    title: 'Risk Indicator',
    instructions: 'Select a type of exposure from the dropdown list in order to run the analysis.',
    description: `For “Affected Population” and “Affected GDP”, exposure was measured using gridded maps of population count and GDP respectively.
      For urban damage, exposure was measured using a land use map showing which cells are built-up and not built-up.`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'existing-protection-level': {
    title: 'Existing Protection Level (Return Period)',
    instructions: '<p>Select the level of flood protection to be used in the risk analysis</p>',
    description: `<p>Flood protection level represents the strongest magnitude flood that flood infrastructure can protect against (given as a return period).
      For example, a 10-year flood protection level will prevent 10-year floods (or smaller) from damaging assets. The level of flood protection
      used in the default analysis was modeled to using FLOPROS.</p>
      <p>FLOPROS provides flood protection estimates at the state value. For larger locations, like countries and river basins, the average protection
      was estimated by first summing all expected annual damage (EAD) from the state level within the location (for river basins, only the portion of the
        state within the basin was used). Next, the location’s loss-probability curve was run through several trials using a range of flood protection
        values to estimate EAD. Once a trial matched the actual EAD, the corresponding flood protection was set as that location’s default.</p>`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'advanced-settings-notification': {
    description: `<p>In the Advanced Setting, users can customize the Risk Analysis by altering the level of flood protection and selecting different future scenarios.
      Due to the complexity of the calculation, the Advanced analysis runs at a coarser scale than the default analysis. Therefore, Advanced results may look different than default results.
      </p>`
  },
  'show-advanced-settings': {
    description: `<p>The Custom Analysis feature allows users to adjust the risk analysis by changing the level of flood protection and selecting
    different future scenarios. Due to the complexity of the calculation, the Custom Analysis runs on a coarser scale than the Default analysis.
    Therefore, Custom results may look different from Standard results.</p>`
  },
  // CBA
  'design-protection-standards': {
    title: 'Design Protection Standards',
    instructions: `<p>Customize the performance expectations for the designed infrastructure.
      Set the existing (current) and design (target) levels of protection. Select the target year in
      which the infrastructure will be at peak performance. </p>`,
    description: `<p>The "Existing Protection Level" will be used to calculate the baseline flood damage (expected annual damage if no improvements to
      flood protection are made). Flood damage will then be recalculated using the "Design Protection Level". Users must define the year in which the design level
      of protection should be valid. For example, selecting a design protection level of 100 for a target year of 2050 means that the designed infrastructure would
      protect against 100-year floods in the year 2050. The analysis calculates difference between the baseline and design scenarios. Benefits represent the avoided damage
      to urban assets, population, and GDP provided by the design infrastructure. The analysis does not allow for negative benefits (i.e., existing infrastructure performs
      better than the design).</p>`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'timeframes': {
    title: 'Timeframes',
    instructions: '<p>Set the time bounds of the analysis.</p>',
    description: `<p>The "Implementation Range" represents the years in which the design infrastructure will be constructed.
      The "Infrastructure Lifetime" represents how long the infrastructure will be functional (and thus provide benefits).
      The "Benefit Start year" represents the year when benefits will start to accrue. Only a fraction of the benefits can
      be accrued during construction-- full benefits will be accumulated once the construction is complete.</p>`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'costs': {
    title: 'Costs',
    instructions: '<p>Set the financial parameters for the analysis.</p>',
    description: `<p>The "Unit Costs" represents the rate (in $US) to construct dike infrastructure per meter (depth)
      per kilometer (length). A default rate that incorporates a country's purchasing power parity (PPP) is provided.
      The "Annual Discount Rate" represents rate in which present value will change through time. The "Operation & Maintenance Cost"
      represents the fraction of the total construction cost to be used to estimate the operation and maintenance expenses annually.</p>`,
    source: `<a href="https://www.wri.org/publication/aqueduct-floods" target="_blank" rel="noopener noreferrer">WRI Aqueduct Floods</a>`
  },
  'cumulative-benefits': {
    title: 'Cumulative Benefits',
    description: `<p>This figure displays the cumulative net benefits of the designed project. The cumulative net benefit is calculated by
      summing the avoided damage to urban assets each year and subtracting out the cost to build, operate, and maintain the design infrastructure.
      When the bar plot rises above the X-axis, the project has profited.</p>`
  },
  'annual-total-costs-benefits': {
    title: 'Annual Total Costs vs. Benefits',
    description: `<p>This figure compares the annual cost  of the design infrastructure to the annual benefits (Y-axis) for every year in
      the “Infrastructure Life Time” of the project (X-axis). Costs include both construction costs and operation and maintenance.
      Benefits represent the accrual of avoided damage to urban assets.</p>`
  },
  'cba-notification': {
    description: `<p>The Cost-Benefit Analysis assesses the feasibility of improving dike infrastructure to protect against riverine floods
      in a given country, state, or river basin (coastal flooding is not assessed). The analysis is highly customizable, so please allow time
      for extra time as the calculations run in the background.</p>`
  }
}

export default { MODAL_INFO_DEFINITIONS };
