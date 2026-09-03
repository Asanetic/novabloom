
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSubscriptionsStateDefaults = {

  //state management for list page
  subscriptionsListData : [],
  subscriptionsListPageCount : 1,
  subscriptionsLoading: true,  
  parentUseEffectKey : 'loadSubscriptionsList',
  localEventSignature: 'loadSubscriptionsList',
  subscriptionsQuerySearchStr: '',

  
  //for profile page
  subscriptionsNode : {},
  subscriptionsActionStatus : 'add_subscriptions',
  paramsubscriptionsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  subscriptionsUptoken:'',
  subscriptionsNode : {},
  activeScrollId : 'SubscriptionsProfileTray',
  
  //dataScript
  subscriptionsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSubscriptionsState(overrides = {}) {
  const combinedDefaults = { ...defaultSubscriptionsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

