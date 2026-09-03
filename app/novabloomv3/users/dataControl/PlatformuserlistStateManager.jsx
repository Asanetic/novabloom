
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPlatformuserlistStateDefaults = {

  //state management for list page
  platformuserlistListData : [],
  platformuserlistListPageCount : 1,
  platformuserlistLoading: true,  
  parentUseEffectKey : 'loadPlatformuserlistList',
  localEventSignature: 'loadPlatformuserlistList',
  platformuserlistQuerySearchStr: '',

  
  //for profile page
  app_usersNode : {},
  platformuserlistActionStatus : 'add_app_users',
  paramplatformuserlistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  platformuserlistUptoken:'',
  platformuserlistNode : {},
  activeScrollId : 'PlatformuserlistProfileTray',
  
  //dataScript
  platformuserlistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePlatformuserlistState(overrides = {}) {
  const combinedDefaults = { ...defaultPlatformuserlistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

