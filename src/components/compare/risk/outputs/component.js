import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { replace } from 'aqueduct-components';
import { Base64 } from 'js-base64';
import isEqual from 'lodash/isEqual';

// componets
import Widget from 'components/risk/widget';
import WidgetCompare from 'components/compare/risk/widget';
import Chart from 'components/widgets';
import TableChart from 'components/widgets/table/risk';

// specs
import AnnualFloodSpec from 'components/widgets/specs/risk/annual_flood';
import BenchmarkSpec from 'components/widgets/specs/risk/benchmark';
// specs – advanced
import FloodDriversSpec from 'components/widgets/specs/risk/advanced/flood_drivers';
import LPCurveSpec from 'components/widgets/specs/risk/advanced/lp_curve';

// utils
import { getRiskPreviewURL, generateRiskDownloadURL } from 'utils/share';
import { logEvent } from 'utils/analytics';

// constants
import {
  getWidgetTitle,
  WIDGET_TITLE_GENERATOR
} from 'constants/risk';

// styles
import './styles.scss';

class RiskCompareOutputs extends Component {
  static propTypes = {
    widgets: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    filtersCompare: PropTypes.object.isRequired,
    originalFormatFilters: PropTypes.object.isRequired,
    originalFormatCompareFilters: PropTypes.object.isRequired,
    setModal: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps) {
    const { filters, filtersCompare } = this.props;
    const {
      filters: nextFilters,
      filtersCompare: nextFiltersCompare
    } = nextProps;
    const filtersChanged = !isEqual(filters, nextFilters);
    const filtersCompareChanged = !isEqual(filtersCompare, nextFiltersCompare);

    return filtersChanged || filtersCompareChanged;
  }

  onMoreInfo = (widget, filters) => {
    const { setModal } = this.props;

    setModal(({
      visible: true,
      options: {
        type: 'widget-info',
        widget: {
          ...widget,
          params: {
            ...widget.params,
            title: replace(widget.params.title, { ...filters.common, ...filters.risk })
          }
        },
        embedURL: `#${getRiskPreviewURL(widget, filters)}`
      }
    }));

    logEvent('[AQ-Flood]', `risk compare tab: user clicks on more info of widget "${widget.id}"`);
  }

  onDownloadWidget = (option, widget, filters) => {
    const { setModal } = this.props;

    if (option === 'embed') {
      setModal(({
        visible: true,
        options: {
          type: 'widget-share',
          widget: {
            ...widget,
            params: {
              ...widget.params,
              title: replace(widget.params.title, { 
                ...filters.common, 
                ...filters.risk,
              })
            }
          },
          embedURL: getRiskPreviewURL(widget, filters),
          previewURL: `#${getRiskPreviewURL(widget, filters)}`,
        }
      }));
    }

    if (option === 'json') generateRiskDownloadURL(widget, filters);

    logEvent('[AQ-Flood]', `risk compare tab: user downloads widget "${widget.id}" in format:`, option);
  }

  getEmbedURL = ({ id }, compare) => {
    const { originalFormatFilters, originalFormatCompareFilters } = this.props;
    const isAdvancedRisk = originalFormatFilters.risk.advanced_settings;

    return `/embed/${isAdvancedRisk ? 'advanced_risk' : 'risk'}/widget/${id}?p=${Base64.encode(JSON.stringify(compare ? originalFormatCompareFilters : originalFormatFilters))}`;
  }

  render() {
    const { widgets, filters,  filtersCompare, originalFormatFilters, originalFormatCompareFilters } = this.props;
    const { geogunit_unique_name: location } = filters;
    const { geogunit_unique_name: locationCompare, existing_prot: existingProtCompare } = filtersCompare;
    const widgetsReadyToDisplay = location;
    const widgetsCompareReadyToDisplay = !!locationCompare && !!existingProtCompare;

    return (
      <div className="c-analyzer-compare-outputs">
        <div className="wrapper">
          {widgetsReadyToDisplay && widgets.map(widget => (
            <div key={widget.id} className="row">
              <div className="col-md-6">
                <Widget
                  title={replace(widget.params.title, { ...filters, widget_title: getWidgetTitle(filters) })}
                  params={{ id: widget.id, filters }}
                  onMoreInfo={() => this.onMoreInfo(widget, originalFormatFilters)}
                  onDownloadWidget={(option, _widget) => this.onDownloadWidget(option, _widget, originalFormatFilters)}
                >
                  {({ data, params = {} }) => {

                    if (params.type === 'table') return (<TableChart data={data} filters={filters} />)

                    if (params.type === 'annual_flood') return (
                      <Chart
                        spec={AnnualFloodSpec}
                        params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filters)}}
                        data={{ table: data }}
                      />)

                    if (params.type === 'flood_drivers') return (
                      <Chart
                        spec={FloodDriversSpec}
                        params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filters)}}
                        data={{ table: data }}
                      />)

                    if (params.type === 'benchmark') return (
                      <Chart
                        spec={BenchmarkSpec}
                        params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filters)}}
                        data={{ table: data }}
                      />)

                    if (params.type === 'lp_curve') return (
                      <Chart
                        spec={LPCurveSpec}
                        params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filters)}}
                        data={{ table: data }}
                      />)

                    return null;
                  }}
                </Widget>
              </div>
              {widgetsCompareReadyToDisplay && (
                <div className="col-md-6">
                  <WidgetCompare
                    title={replace(widget.params.title, { ...filtersCompare, widget_title: getWidgetTitle(filtersCompare) })}
                    params={{ id: widget.id, filtersCompare }}
                    onShareWidget={() => this.onShareWidget(widget, true)}
                    onMoreInfo={() => this.onMoreInfo(widget, originalFormatCompareFilters)}
                    onDownloadWidget={(option, _widget) => this.onDownloadWidget(option, _widget, originalFormatCompareFilters)}
                  >
                    {({ data, params = {} }) => {

                      if (params.type === 'table') return (<TableChart data={data} filters={filtersCompare} />)

                      if (params.type === 'annual_flood') return (
                        <Chart
                          spec={AnnualFloodSpec}
                          params={{ 
                            ...params, 
                            ...WIDGET_TITLE_GENERATOR(params.type, filtersCompare),
                          }}
                          data={{ table: data }}
                        />)

                      if (params.type === 'flood_drivers') return (
                        <Chart
                          spec={FloodDriversSpec}
                          params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filtersCompare)}}
                          data={{ table: data }}
                        />)

                      if (params.type === 'benchmark') return (
                        <Chart
                          spec={BenchmarkSpec}
                          params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filtersCompare)}}
                          data={{ table: data }}
                        />)

                      if (params.type === 'lp_curve') return (
                        <Chart
                          spec={LPCurveSpec}
                          params={{ ...params, ...WIDGET_TITLE_GENERATOR(params.type, filtersCompare)}}
                          data={{ table: data }}
                        />)

                      return null;
                    }}
                  </WidgetCompare>
                </div>)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RiskCompareOutputs;
