import { NOT_FOUND } from 'redux-first-router'
import queryString from 'query-string'
import { createHashHistory } from 'history';

export const ROUTES_CONFIG = { 
  location: state => state.router,
  querySerializer: queryString,
  createHistory: createHashHistory
};

export const ROUTES = {
  home: `/:tab?`,
  compare: `/compare/:tab?`,
  'widget-preview': `/preview/:tab/widget/:id`,
  'widget-print': `/report/:tab/widget/:id`,
  'cba-embed': `/embed/cba`,
  'cba-embed-compare': `/embed/cba/compare`,
  'widget-embed': `/embed/:tab/widget/:id`,
  [NOT_FOUND]: 'NotFound'
};

export default {
  ROUTES_CONFIG,
  ROUTES
};
