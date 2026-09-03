
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultActiveappusersStateDefaults = {

  //state management for list page
  activeappusersListData : [],
  activeappusersListPageCount : 1,
  activeappusersLoading: true,  
  parentUseEffectKey : 'loadActiveappusersList',
  localEventSignature: 'loadActiveappusersList',
  activeappusersQuerySearchStr: '',

  
  //for profile page
  app_usersNode : {},
  activeappusersActionStatus : 'add_app_users',
  paramactiveappusersUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  activeappusersUptoken:'',
  activeappusersNode : {},
  activeScrollId : 'ActiveappusersProfileTray',
  
  //dataScript
  activeappusersCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useActiveappusersState(overrides = {}) {
  const combinedDefaults = { ...defaultActiveappusersStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

