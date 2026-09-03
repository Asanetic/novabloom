
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultManageassetpricingStateDefaults = {

  //state management for list page
  manageassetpricingListData : [],
  manageassetpricingListPageCount : 1,
  manageassetpricingLoading: true,  
  parentUseEffectKey : 'loadManageassetpricingList',
  localEventSignature: 'loadManageassetpricingList',
  manageassetpricingQuerySearchStr: '',

  
  //for profile page
  asset_pricingNode : {},
  manageassetpricingActionStatus : 'add_asset_pricing',
  parammanageassetpricingUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  manageassetpricingUptoken:'',
  manageassetpricingNode : {},
  activeScrollId : 'ManageassetpricingProfileTray',
  
  //dataScript
  manageassetpricingCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useManageassetpricingState(overrides = {}) {
  const combinedDefaults = { ...defaultManageassetpricingStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

