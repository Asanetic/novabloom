
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultAssetpricingStateDefaults = {

  //state management for list page
  assetpricingListData : [],
  assetpricingListPageCount : 1,
  assetpricingLoading: true,  
  parentUseEffectKey : 'loadAssetpricingList',
  localEventSignature: 'loadAssetpricingList',
  assetpricingQuerySearchStr: '',

  
  //for profile page
  asset_pricingNode : {},
  assetpricingActionStatus : 'add_asset_pricing',
  paramassetpricingUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  assetpricingUptoken:'',
  assetpricingNode : {},
  activeScrollId : 'AssetpricingProfileTray',
  
  //dataScript
  assetpricingCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useAssetpricingState(overrides = {}) {
  const combinedDefaults = { ...defaultAssetpricingStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

