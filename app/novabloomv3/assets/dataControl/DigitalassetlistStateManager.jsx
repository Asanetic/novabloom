
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDigitalassetlistStateDefaults = {

  //state management for list page
  digitalassetlistListData : [],
  digitalassetlistListPageCount : 1,
  digitalassetlistLoading: true,  
  parentUseEffectKey : 'loadDigitalassetlistList',
  localEventSignature: 'loadDigitalassetlistList',
  digitalassetlistQuerySearchStr: '',

  
  //for profile page
  assetsNode : {},
  digitalassetlistActionStatus : 'add_assets',
  paramdigitalassetlistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  digitalassetlistUptoken:'',
  digitalassetlistNode : {},
  activeScrollId : 'DigitalassetlistProfileTray',
  
  //dataScript
  digitalassetlistCustomProfileQuery : '',
  manageassetpricingCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useDigitalassetlistState(overrides = {}) {
  const combinedDefaults = { ...defaultDigitalassetlistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

