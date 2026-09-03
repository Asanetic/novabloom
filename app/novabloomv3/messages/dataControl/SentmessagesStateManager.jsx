
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultSentmessagesStateDefaults = {

  //state management for list page
  sentmessagesListData : [],
  sentmessagesListPageCount : 1,
  sentmessagesLoading: true,  
  parentUseEffectKey : 'loadSentmessagesList',
  localEventSignature: 'loadSentmessagesList',
  sentmessagesQuerySearchStr: '',

  
  //for profile page
  sent_messagesNode : {},
  sentmessagesActionStatus : 'add_sent_messages',
  paramsentmessagesUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  sentmessagesUptoken:'',
  sentmessagesNode : {},
  activeScrollId : 'SentmessagesProfileTray',
  
  //dataScript
  sentmessagesCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useSentmessagesState(overrides = {}) {
  const combinedDefaults = { ...defaultSentmessagesStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

