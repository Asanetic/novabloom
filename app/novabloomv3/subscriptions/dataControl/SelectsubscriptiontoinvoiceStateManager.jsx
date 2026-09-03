
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSelectsubscriptiontoinvoiceStateDefaults = {

  //state management for list page
  selectsubscriptiontoinvoiceListData : [],
  selectsubscriptiontoinvoiceListPageCount : 1,
  selectsubscriptiontoinvoiceLoading: true,  
  parentUseEffectKey : 'loadSelectsubscriptiontoinvoiceList',
  localEventSignature: 'loadSelectsubscriptiontoinvoiceList',
  selectsubscriptiontoinvoiceQuerySearchStr: '',

  
  //for profile page
  subscriptionsNode : {},
  selectsubscriptiontoinvoiceActionStatus : 'add_subscriptions',
  paramselectsubscriptiontoinvoiceUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  selectsubscriptiontoinvoiceUptoken:'',
  selectsubscriptiontoinvoiceNode : {},
  activeScrollId : 'SelectsubscriptiontoinvoiceProfileTray',
  
  //dataScript
  selectsubscriptiontoinvoiceCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSelectsubscriptiontoinvoiceState(overrides = {}) {
  const combinedDefaults = { ...defaultSelectsubscriptiontoinvoiceStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

