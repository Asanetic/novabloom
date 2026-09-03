
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPaymentsStateDefaults = {

  //state management for list page
  paymentsListData : [],
  paymentsListPageCount : 1,
  paymentsLoading: true,  
  parentUseEffectKey : 'loadPaymentsList',
  localEventSignature: 'loadPaymentsList',
  paymentsQuerySearchStr: '',

  
  //for profile page
  paymentsNode : {},
  paymentsActionStatus : 'add_payments',
  parampaymentsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  paymentsUptoken:'',
  paymentsNode : {},
  activeScrollId : 'PaymentsProfileTray',
  
  //dataScript
  paymentsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePaymentsState(overrides = {}) {
  const combinedDefaults = { ...defaultPaymentsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

