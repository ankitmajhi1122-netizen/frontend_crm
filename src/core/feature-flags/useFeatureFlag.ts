import { useAppSelector } from '../../app/store/hooks';
import { selectTenantFeatures } from '../../multi-tenant/tenantSelectors';

export function useFeatureFlag(feature: string): boolean {
  const features = useAppSelector(selectTenantFeatures);
  return features.includes(feature);
}
