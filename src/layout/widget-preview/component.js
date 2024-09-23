import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { replace } from 'aqueduct-components';

// layout
import LayoutPreview from "layout/layout-preview";

// components
import RiskWidget from 'components/risk/widget';
import AnalyzerWidget from 'components/analyzer/widget';

// components
import Chart from 'components/widgets';
import RiskTableChart from 'components/widgets/table/risk';
import CbaTableChart from 'components/widgets/table/cba';
import MapChart from 'components/widgets/map';

// specs
// specs – risk
import AnnualFloodSpec from 'components/widgets/specs/risk/annual_flood';
import BenchmarkSpec from 'components/widgets/specs/risk/benchmark';
// specs – risk advanced
import FloodDriversSpec from 'components/widgets/specs/risk/advanced/flood_drivers';
import LPCurveSpec from 'components/widgets/specs/risk/advanced/lp_curve';

// specs – cba
import BarChartSpec from 'components/widgets/specs/cba/bar-chart';
import LineSpec from 'components/widgets/specs/cba/line';
import MultiLineSpec from 'components/widgets/specs/cba/multi-line';

// styles
import './styles.scss';

class EmbedWidget extends PureComponent {
  static propTypes = {
    tab: PropTypes.string.isRequired,
    widget: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired
  }

  render() {
    const { tab, widget, filters, layout } = this.props;
    const Widget = ['risk', 'advanced_risk'].includes(tab) ? RiskWidget : AnalyzerWidget;
    const widgetTitle = replace(widget.params.title, {
      ...filters,
      end: filters.implementation_start + filters.infrastructure_life
    });

    return (
      <LayoutPreview
        title={widgetTitle}
        description={`${widgetTitle} | Aqueduct Flood`}
        layout={layout}
      >
        <section className="l-preview-widget">
          <Widget
            params={{ id: widget.id, filters }}
            hideWidgetOptions
          >
            {({ data, params = {} }) => {

              // cba types
              if (params.type === 'bar') return (<Chart spec={BarChartSpec} params={params} data={{ table: data }} />)

              if (params.type === 'line') return (<Chart spec={LineSpec} params={params} data={{ table: data }} />)

              if (params.type === 'multi-line') return (<Chart spec={MultiLineSpec} params={params} data={{ table: data }} />)

              if (params.type === 'table' && tab === 'cba') return (<CbaTableChart data={data} filters={filters} />)

              // risk types
              if (params.type === 'annual_flood') return (<Chart spec={AnnualFloodSpec} params={params} data={{ table: data }} />)

              if (params.type === 'flood_drivers') return (<Chart spec={FloodDriversSpec} params={params} data={{ table: data }} />)

              if (params.type === 'benchmark') return (<Chart spec={BenchmarkSpec} params={params} data={{ table: data }} />)

              if (params.type === 'lp_curve') return (<Chart spec={LPCurveSpec} params={params} data={{ table: data }} />)

              // common types
              if (params.type === 'map') return (<MapChart />)

              if (params.type === 'table' && tab !== 'cba') return (<RiskTableChart data={data} filters={filters} />)

              return null;
            }}
          </Widget>
        </section>
      </LayoutPreview>
    );
  }
}

export default EmbedWidget;
