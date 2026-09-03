
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSystemusersStateDefaults = {

  //state management for list page
  systemusersListData : [],
  systemusersListPageCount : 1,
  systemusersLoading: true,  
  parentUseEffectKey : 'loadSystemusersList',
  localEventSignature: 'loadSystemusersList',
  systemusersQuerySearchStr: '',

  
  //for profile page
  system_usersNode : {},
  systemusersActionStatus : 'add_system_users',
  paramsystemusersUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  systemusersUptoken:'',
  systemusersNode : {},
  activeScrollId : 'SystemusersProfileTray',
  
  //dataScript
  systemusersCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSystemusersState(overrides = {}) {
  const combinedDefaults = { ...defaultSystemusersStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

