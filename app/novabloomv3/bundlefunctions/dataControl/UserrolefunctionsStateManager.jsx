
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultUserrolefunctionsStateDefaults = {

  //state management for list page
  userrolefunctionsListData : [],
  userrolefunctionsListPageCount : 1,
  userrolefunctionsLoading: true,  
  parentUseEffectKey : 'loadUserrolefunctionsList',
  localEventSignature: 'loadUserrolefunctionsList',
  userrolefunctionsQuerySearchStr: '',

  
  //for profile page
  user_bundle_role_functionsNode : {},
  userrolefunctionsActionStatus : 'add_user_bundle_role_functions',
  paramuserrolefunctionsUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  userrolefunctionsUptoken:'',
  userrolefunctionsNode : {},
  activeScrollId : 'UserrolefunctionsProfileTray',
  
  //dataScript
  userrolefunctionsCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useUserrolefunctionsState(overrides = {}) {
  const combinedDefaults = { ...defaultUserrolefunctionsStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

