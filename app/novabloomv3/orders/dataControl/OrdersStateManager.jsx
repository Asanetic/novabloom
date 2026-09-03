
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultOrdersStateDefaults = {

  //state management for list page
  ordersListData : [],
  ordersListPageCount : 1,
  ordersLoading: true,  
  parentUseEffectKey : 'loadOrdersList',
  localEventSignature: 'loadOrdersList',
  ordersQuerySearchStr: '',

  
  //for profile page
  ordersNode : {},
  ordersActionStatus : 'add_orders',
  paramordersUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  ordersUptoken:'',
  ordersNode : {},
  activeScrollId : 'OrdersProfileTray',
  
  //dataScript
  ordersCustomProfileQuery : '',
  appUsersCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useOrdersState(overrides = {}) {
  const combinedDefaults = { ...defaultOrdersStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

