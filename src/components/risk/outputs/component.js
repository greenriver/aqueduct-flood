import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { replace } from 'aqueduct-components';
import isEqual from 'lodash/isEqual';

// components
import Widget from 'components/risk/widget';
import Chart from 'components/widgets';
import TableChart from 'components/widgets/table/risk';

// specs
import AnnualFloodSpec from 'components/widgets/specs/risk/annual_flood';
import BenchmarkSpec from 'components/widgets/specs/risk/benchmark';
// specs – advanced
import FloodDriversSpec from 'components/widgets/specs/risk/advanced/flood_drivers';
import LPCurveSpec from 'components/widgets/specs/risk/advanced/lp_curve';

// utils
import { getRiskEmbedURL, getRiskPreviewURL, generateRiskDownloadURL } from 'utils/share';
import { logEvent } from 'utils/analytics';

// constants
import {
  getWidgetTitle,
  WIDGET_TITLE_GENERATOR
} from 'constants/risk';

// styles
import './styles.scss';

class AnalyzerOutputs extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    originalFormatFilters: PropTypes.object.isRequired,
    widgets: PropTypes.array.isRequired,
    setModal: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { filters } = this.props;
    const { filters: nextFilters } = nextProps;
    const filtersChanged = !isEqual(filters, nextFilters);

    return filtersChanged;
  }

  onMoreInfo = (widget) => {
    const {
      setModal,
      originalFormatFilters,
      filters
    } = this.props;

    setModal(({
      visible: true,
      options: {
        type: 'widget-info',
        widget: {
          ...widget,
          params: {
            ...widget.params,
            title: replace(widget.params.title, { ...filters, widget_title: getWidgetTitle(filters) })
          }
        },
        embedURL: getRiskPreviewURL(widget, originalFormatFilters),
      }
    }));
  }

  onDownloadWidget = (option, widget) => {
    const {
      setModal,
      originalFormatFilters,
      filters
    } = this.props;


    if (option === 'embed') {
      setModal(({
        visible: true,
        options: {
          type: 'widget-share',
          widget: {
            ...widget,
            params: {
              ...widget.params,
              title: replace(widget.params.title, { ...filters, widget_title: getWidgetTitle(filters) })
            }
          },
          embedURL: getRiskEmbedURL(widget, originalFormatFilters),
          previewURL: getRiskPreviewURL(widget, originalFormatFilters),
        }
      }));
    }

    if (['json', 'csv'].includes(option)) generateRiskDownloadURL(widget, originalFormatFilters, option);

    logEvent('[AQ-Flood]', `risk tab: user downloads widget "${widget.id}" in format:`, option);
  }

  render() {
    const { filters, widgets } = this.props;
    const { flood, geogunit_unique_name } = filters;

    return (<div></div>); // TODO: remove this early return once we fix the Risk tab
    return (
      <div className="c-risk-outputs">
        <div className="wrapper">
          <div className="container">
            {widgets.map(widget => (
              <div key={widget.id} className="widget-row">
                <Widget
                  title={replace(widget.params.title, { ...filters, widget_title: getWidgetTitle(filters) })}
                  params={{ id: widget.id, filters }}
                  onMoreInfo={() => {
                    this.onMoreInfo(widget);
                    logEvent('[AQ-Flood]', `risk tab: user clicks on more info of widget "${widget.id}"`);
                  }}
                  onDownloadWidget={(option, _widget) => this.onDownloadWidget(option, _widget)}
                >
                  {({ data, params = {} }) => {

                    if (params.type === 'table') return (<TableChart data={data} filters={filters} />)

                    if (params.type === 'annual_flood') return (
                      <Chart
                        spec={AnnualFloodSpec}
                        params={{
                          ...params,
                          ...WIDGET_TITLE_GENERATOR(params.type, filters)
                        }}
                        data={{ table: data }}
                        filters={filters}
                      />)

                    if (params.type === 'flood_drivers') return (
                      <Chart
                        spec={FloodDriversSpec}
                        params={{
                          ...params,
                          ...WIDGET_TITLE_GENERATOR(params.type, filters),
                          chartTitleBottom: `Projected Change in ${flood} Flood Annual Expected ${getWidgetTitle(filters)} and Drivers in ${geogunit_unique_name}`
                        }}
                        data={{ table: data }}
                        filters={filters}
                      />)

                    if (params.type === 'benchmark') return (
                      <Chart
                        spec={BenchmarkSpec}
                        params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filters)}}
                        data={{ table: data }}
                        filters={filters}
                      />)

                    if (params.type === 'lp_curve') return (
                      <Chart
                        spec={LPCurveSpec}
                        params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filters)}}
                        data={{ table: data }}
                        filters={filters}
                      />)

                    return null;
                  }}
                </Widget>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyzerOutputs;
