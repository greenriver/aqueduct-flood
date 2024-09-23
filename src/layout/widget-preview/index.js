import { connect } from 'react-redux';

import { getCountryDefaults } from 'modules/locations/actions';
import { setCommonFilter, setCostFilter } from 'modules/filters/actions';

// component
import EmbedWidget from "./component";

export default connect(
  state => ({
    tab: state.app.tab,
    widget: state.widgets[0],
    filters: {
      ...state.filters.common,
      ...['risk', 'advanced_risk'].includes(state.app.tab) ?
        { ...state.filters.risk } : { ...state.filters.cba }
    },
    layout: state.router.type
  }),
  {
    getCountryDefaults,
    setCommonFilter,
    setCostFilter
  }
)(EmbedWidget);
