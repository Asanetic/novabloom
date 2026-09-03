
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSystemrolesStateDefaults = {

  //state management for list page
  systemrolesListData : [],
  systemrolesListPageCount : 1,
  systemrolesLoading: true,  
  parentUseEffectKey : 'loadSystemrolesList',
  localEventSignature: 'loadSystemrolesList',
  systemrolesQuerySearchStr: '',

  
  //for profile page
  system_role_bundlesNode : {},
  systemrolesActionStatus : 'add_system_role_bundles',
  paramsystemrolesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  systemrolesUptoken:'',
  systemrolesNode : {},
  activeScrollId : 'SystemrolesProfileTray',
  
  //dataScript
  systemrolesCustomProfileQuery : '',
  userrolefunctionsCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useSystemrolesState(overrides = {}) {
  const combinedDefaults = { ...defaultSystemrolesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

