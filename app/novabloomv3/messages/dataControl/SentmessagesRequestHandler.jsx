'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosySecureFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

//routes manager
///handle routes 
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

//insert data
export async function insertSentmessages() {
 //console.log(`Form sent_messages insert sent `)

  return await mosyPostFormData({
    formId: 'sent_messages_profile_form',
    url: apiRoutes.sentmessages.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateSentmessages() {

  //console.log(`Form sent_messages update sent `)

  return await mosyPostFormData({
    formId: 'sent_messages_profile_form',
    url: apiRoutes.sentmessages.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateSentmessagesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('sent_messages_mosy_action');
 
 //console.log(`Form sent_messages submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_sent_messages') {

      actionMessage ='Record added succesfully!';

      result = await insertSentmessages();
    }

    if (actionType === 'update_sent_messages') {

      actionMessage ='Record updated succesfully!';

      result = await updateSentmessages();
    }

    if (result?.status === 'success') {
      
      const sent_messagesUptoken = btoa(result.sent_messages_dataNode || '');

      //set id key
      setters.setSentmessagesUptoken(sent_messagesUptoken);
      
      //update url with new sent_messagesUptoken
      mosyUpdateUrlParam('sent_messages_dataNode', sent_messagesUptoken)

      setters.setSentmessagesActionStatus('update_sent_messages')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: sent_messagesUptoken,
        actionName : actionType,
        actionType : 'sent_messages_form_submission'
      };
            
      
    } else {
      MosyNotify({message:result.message, icon:'times-circle', iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
      MosyNotify({message:result.message, icon:'times-circle', iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initSentmessagesProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Sent Messages' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.sentmessages.base,
      params: { 
      ...rawQstr,
      src : btoa(`initSentmessagesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('messages Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching messages data:', response.message);  // Handle error
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteSentmessages(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.sentmessages.delete,
        params: { 
          _sent_messages_delete_record: (token), 
          },
      });

      console.log('Token DeleteSentmessages '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response; // Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        
        closeMosyModal();

        MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})

        return response; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getSentmessagesListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qsent_messages_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.sentmessages.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getSentmessagesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('messages Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching messages data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSentmessagesListData(customQueryStr, setters) {

    const gftSentmessages = MosySecureFilterEngine('sent_messages');
    let finalFilterStr = (gftSentmessages);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSentmessagesLoading(true);
    
    const sentmessagesListData = await getSentmessagesListData(finalFilterStr);
    
    setters.setSentmessagesLoading(false)
    setters.setSentmessagesListData(sentmessagesListData?.data)

    setters.setSentmessagesListPageCount(sentmessagesListData?.pagination?.page_count)


    return sentmessagesListData

}
  
  
export async function sentmessagesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const sentmessagesTokenId = mosyUrlParam('sent_messages_dataNode');
    
    const deleteParam = mosyUrlParam('sent_messages_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSentmessagesToken = '0';
    if (sentmessagesTokenId) {
      
      decodedSentmessagesToken = atob(sentmessagesTokenId); // Decode the record_id
      setters.setSentmessagesUptoken(sentmessagesTokenId);
      setters.setSentmessagesActionStatus('update_sent_messages');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSentmessagesQueryStr ={Node:btoa(decodedSentmessagesToken)}
    if(customQueryStr!='')
    {
      // if no sent_messages_dataNode set , use customQueryStr
      if (!sentmessagesTokenId) {
       rawSentmessagesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSentmessagesProfileData(rawSentmessagesQueryStr)

    if(deleteParam){
      popDeleteDialog(sentmessagesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSentmessagesNode(finalProfileData)
    
    
}
  
  

export function InteprateSentmessagesEvent(data) {
     
  //console.log(' Sentmessages Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_sent_messages){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SentmessagesProfileTray')

    
    mosyUpdateUrlParam('sent_messages_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSentmessagesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SentmessagesProfileTray')

    
    mosyUpdateUrlParam('sent_messages_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_sent_messages){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add sent_messages `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SentmessagesProfileTray')
      }
    }
     
  }

  if(childActionName.update_sent_messages){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update sent_messages `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SentmessagesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_sent_messages){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../messages/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSentmessages(deleteToken).then(response=>{
  
        if(response.status!='error')
        {
          childSetters?.setSnackMessage("Record deleted succesfully!")
          childSetters?.setParentUseEffectKey(magicRandomStr());
          childSetters?.setLocalEventSignature(magicRandomStr());

          if(router){
            router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
          }
       }
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('sent_messages_delete');
        
    }
  
  });

}