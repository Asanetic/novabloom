
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultInactiveusersStateDefaults = {

  //state management for list page
  inactiveusersListData : [],
  inactiveusersListPageCount : 1,
  inactiveusersLoading: true,  
  parentUseEffectKey : 'loadInactiveusersList',
  localEventSignature: 'loadInactiveusersList',
  inactiveusersQuerySearchStr: '',

  
  //for profile page
  app_usersNode : {},
  inactiveusersActionStatus : 'add_app_users',
  paraminactiveusersUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  inactiveusersUptoken:'',
  inactiveusersNode : {},
  activeScrollId : 'InactiveusersProfileTray',
  
  //dataScript
  inactiveusersCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useInactiveusersState(overrides = {}) {
  const combinedDefaults = { ...defaultInactiveusersStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

