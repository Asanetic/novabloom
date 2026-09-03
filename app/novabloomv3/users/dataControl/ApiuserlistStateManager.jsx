
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultApiuserlistStateDefaults = {

  //state management for list page
  apiuserlistListData : [],
  apiuserlistListPageCount : 1,
  apiuserlistLoading: true,  
  parentUseEffectKey : 'loadApiuserlistList',
  localEventSignature: 'loadApiuserlistList',
  apiuserlistQuerySearchStr: '',

  
  //for profile page
  app_usersNode : {},
  apiuserlistActionStatus : 'add_app_users',
  paramapiuserlistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  apiuserlistUptoken:'',
  apiuserlistNode : {},
  activeScrollId : 'ApiuserlistProfileTray',
  
  //dataScript
  apiuserlistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useApiuserlistState(overrides = {}) {
  const combinedDefaults = { ...defaultApiuserlistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

