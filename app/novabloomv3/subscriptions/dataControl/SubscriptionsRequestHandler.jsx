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
export async function insertSubscriptions() {
 //console.log(`Form subscriptions insert sent `)

  return await mosyPostFormData({
    formId: 'subscriptions_profile_form',
    url: apiRoutes.subscriptions.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateSubscriptions() {

  //console.log(`Form subscriptions update sent `)

  return await mosyPostFormData({
    formId: 'subscriptions_profile_form',
    url: apiRoutes.subscriptions.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateSubscriptionsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('subscriptions_mosy_action');
 
 //console.log(`Form subscriptions submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_subscriptions') {

      actionMessage ='Record added succesfully!';

      result = await insertSubscriptions();
    }

    if (actionType === 'update_subscriptions') {

      actionMessage ='Record updated succesfully!';

      result = await updateSubscriptions();
    }

    if (result?.status === 'success') {
      
      const subscriptionsUptoken = btoa(result.subscriptions_dataNode || '');

      //set id key
      setters.setSubscriptionsUptoken(subscriptionsUptoken);
      
      //update url with new subscriptionsUptoken
      mosyUpdateUrlParam('subscriptions_dataNode', subscriptionsUptoken)

      setters.setSubscriptionsActionStatus('update_subscriptions')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: subscriptionsUptoken,
        actionName : actionType,
        actionType : 'subscriptions_form_submission'
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


export async function initSubscriptionsProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Subscriptions' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.subscriptions.base,
      params: { 
      ...rawQstr,
      src : btoa(`initSubscriptionsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('subscriptions Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching subscriptions data:', response.message);  // Handle error
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


export async function DeleteSubscriptions(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.subscriptions.delete,
        params: { 
          _subscriptions_delete_record: (token), 
          },
      });

      console.log('Token DeleteSubscriptions '+token)
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


export async function getSubscriptionsListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qsubscriptions_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.subscriptions.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getSubscriptionsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('subscriptions Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching subscriptions data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSubscriptionsListData(customQueryStr, setters) {

    const gftSubscriptions = MosySecureFilterEngine('subscriptions');
    let finalFilterStr = (gftSubscriptions);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSubscriptionsLoading(true);
    
    const subscriptionsListData = await getSubscriptionsListData(finalFilterStr);
    
    setters.setSubscriptionsLoading(false)
    setters.setSubscriptionsListData(subscriptionsListData?.data)

    setters.setSubscriptionsListPageCount(subscriptionsListData?.pagination?.page_count)


    return subscriptionsListData

}
  
  
export async function subscriptionsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const subscriptionsTokenId = mosyUrlParam('subscriptions_dataNode');
    
    const deleteParam = mosyUrlParam('subscriptions_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSubscriptionsToken = '0';
    if (subscriptionsTokenId) {
      
      decodedSubscriptionsToken = atob(subscriptionsTokenId); // Decode the record_id
      setters.setSubscriptionsUptoken(subscriptionsTokenId);
      setters.setSubscriptionsActionStatus('update_subscriptions');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSubscriptionsQueryStr ={Node:btoa(decodedSubscriptionsToken)}
    if(customQueryStr!='')
    {
      // if no subscriptions_dataNode set , use customQueryStr
      if (!subscriptionsTokenId) {
       rawSubscriptionsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSubscriptionsProfileData(rawSubscriptionsQueryStr)

    if(deleteParam){
      popDeleteDialog(subscriptionsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSubscriptionsNode(finalProfileData)
    
    
}
  
  

export function InteprateSubscriptionsEvent(data) {
     
  //console.log(' Subscriptions Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_subscriptions){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SubscriptionsProfileTray')

    
    mosyUpdateUrlParam('subscriptions_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSubscriptionsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SubscriptionsProfileTray')

    
    mosyUpdateUrlParam('subscriptions_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_subscriptions){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add subscriptions `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SubscriptionsProfileTray')
      }
    }
     
  }

  if(childActionName.update_subscriptions){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update subscriptions `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SubscriptionsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_subscriptions){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../subscriptions/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSubscriptions(deleteToken).then(response=>{
  
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
       deleteUrlParam('subscriptions_delete');
        
    }
  
  });

}