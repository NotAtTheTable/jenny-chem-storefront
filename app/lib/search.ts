import type {
  PredictiveQueryFragment,
  SearchProductFragment,
  PredictiveProductFragment,
} from 'storefrontapi.generated';

export function applyTrackingParams(
  resource:
    | PredictiveQueryFragment
    | SearchProductFragment
    | PredictiveProductFragment,
  params?: string,
) {
  if (params) {
    return resource?.trackingParameters
      ? `?${params}&${resource.trackingParameters}`
      : `?${params}`;
  } else {
    return resource?.trackingParameters
      ? `?${resource.trackingParameters}`
      : '';
  }
}
