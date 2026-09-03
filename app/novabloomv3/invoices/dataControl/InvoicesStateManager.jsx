
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultInvoicesStateDefaults = {

  //state management for list page
  invoicesListData : [],
  invoicesListPageCount : 1,
  invoicesLoading: true,  
  parentUseEffectKey : 'loadInvoicesList',
  localEventSignature: 'loadInvoicesList',
  invoicesQuerySearchStr: '',

  
  //for profile page
  invoicesNode : {},
  invoicesActionStatus : 'add_invoices',
  paraminvoicesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  invoicesUptoken:'',
  invoicesNode : {},
  activeScrollId : 'InvoicesProfileTray',
  
  //dataScript
  invoicesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useInvoicesState(overrides = {}) {
  const combinedDefaults = { ...defaultInvoicesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

