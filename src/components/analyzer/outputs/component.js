import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { replace } from 'aqueduct-components';
import html2canvas from 'html2canvas';

// components
import Widget from 'components/analyzer/widget';
import WidgetMap from 'components/analyzer/widget-map';
import Chart from 'components/widgets';
import MapChart from 'components/widgets/map';
import TableChart from 'components/widgets/table/cba';

// specs
import BarChartSpec from 'components/widgets/specs/cba/bar-chart';
import LineSpec from 'components/widgets/specs/cba/line';
import MultiLineSpec from 'components/widgets/specs/cba/multi-line';

// utils
import {
  getCbaPreviewURL,
  getCbaReportURL,
  generateCbaDownloadURL
} from 'utils/share';
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

class AnalyzerOutputs extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    originalFormatFilters: PropTypes.object.isRequired,
    filtersStatus: PropTypes.object.isRequired,
    currentLocation: PropTypes.object,
    widgets: PropTypes.array.isRequired,
    isNullTime: PropTypes.bool.isRequired,
    applyFilters: PropTypes.func.isRequired,
    setModal: PropTypes.func.isRequired,
  }

  static defaultProps = { currentLocation: {} }

  constructor(props) {
    super();
    this.state = { allowToLoadWidgets: props.loadAtStart };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { filtersStatus: nextFiltersStatus } = nextProps;

    if (!this.state.allowToLoadWidgets && nextState.allowToLoadWidgets) return true;

    return nextFiltersStatus.applied;
  }

  componentDidUpdate(prevProps) {
    const { applyFilters } = this.props;

    applyFilters(false);

    if (this.props.filtersStatus.applied) {
      this.setState({ allowToLoadWidgets: this.props.filtersStatus.applied });
    }
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
            title: replace(widget.params.title, { ...filters,
              end: filters.implementation_start + filters.infrastructure_life
            })
          }
        },
        embedURL: `#${getCbaPreviewURL(widget, originalFormatFilters)}`
      }
    }));
  }

  handleShareLink = () => {
    const {
      setModal,
    } = this.props;

    setModal({
      visible: true,
      options: {
        type: 'share-link',
        }
      });
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
              title: replace(widget.params.title, {
                ...filters,
                end: filters.implementation_start + filters.infrastructure_life
              })
            }
          },
          embedURL: getCbaPreviewURL(widget, originalFormatFilters),
          previewURL: `#${getCbaPreviewURL(widget, originalFormatFilters)}`,
        }
      }));
    }

    if (['json', 'csv'].includes(option)) generateCbaDownloadURL(widget, originalFormatFilters, option);

    if (option === 'image') {
      const { id } = widget;

      const widgetElement = document.getElementById(id);

      html2canvas(widgetElement).then((canvas) => {
        const data = canvas.toDataURL('image/jpg'),
        link = document.createElement('a');
  
        link.href = data;
        link.download = `${id}-image.jpg`;
  
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })

    }

    if (option === 'report') {
      window.open(`#${getCbaReportURL(widget, originalFormatFilters)}`)
    }

    logEvent('[AQ-Flood]', `analyser tab: user downloads widget "${widget.id}" in format:`, option);
  }

  render() {
    const {
      filters,
      widgets,
      currentLocation,
      isNullTime,
    } = this.props;

    const { allowToLoadWidgets } = this.state;

    if (!allowToLoadWidgets) return false;

    return (
      <div className="c-analyzer-outputs">
        <div className="wrapper">
          <div className="container">
            {widgets.map(widget => (
              <div key={widget.id} className="widget-row" id={widget.id}>
                {widget.id === 'inundation_map' ? (
                  <WidgetMap
                    title={replace(widget.params.title, filters)}
                    params={{ id: widget.id, filters }}
                    onMoreInfo={() => this.onMoreInfo(widget)}
                  >
                    {({ data, params }) => (
                      <MapChart
                        data={data}
                        params={params}
                        bbox={currentLocation.bbox}
                      />)}
                  </WidgetMap>) : (
                    <Widget
                      title={replace(
                        widget.params.title,
                        { ...filters,
                          end: filters.implementation_start + filters.infrastructure_life }
                      )}
                      params={{
                        id: widget.id,
                        filters,
                        isNullTime
                      }}
                      onMoreInfo={() => {
                        this.onMoreInfo(widget)

                        logEvent('[AQ-Flood]', `analyzer tab: user clicks in more info for widget ${widget.id}`);
                      }}
                      onDownloadWidget={(option, _widget) => this.onDownloadWidget(option, _widget)}
                      onShareLink={() => this.handleShareLink()}
                    >
                      {({ data, params }) => {

                        if (params.type === 'bar') return (<Chart spec={BarChartSpec} params={params} data={{ table: data }} />)

                        if (params.type === 'line') return (<Chart spec={LineSpec} params={params} data={{ table: data }} />)

                        if (params.type === 'multi-line') return (<Chart spec={MultiLineSpec} params={params} data={{ table: data }} />)

                        if (params.type === 'table') return (<TableChart data={data} />)

                        return null;
                      }}
                    </Widget>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyzerOutputs;
