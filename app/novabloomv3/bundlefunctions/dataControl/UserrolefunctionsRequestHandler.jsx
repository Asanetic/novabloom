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
export async function insertUserrolefunctions() {
 //console.log(`Form user_bundle_role_functions insert sent `)

  return await mosyPostFormData({
    formId: 'user_bundle_role_functions_profile_form',
    url: apiRoutes.userrolefunctions.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateUserrolefunctions() {

  //console.log(`Form user_bundle_role_functions update sent `)

  return await mosyPostFormData({
    formId: 'user_bundle_role_functions_profile_form',
    url: apiRoutes.userrolefunctions.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateUserrolefunctionsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('user_bundle_role_functions_mosy_action');
 
 //console.log(`Form user_bundle_role_functions submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_user_bundle_role_functions') {

      actionMessage ='Record added succesfully!';

      result = await insertUserrolefunctions();
    }

    if (actionType === 'update_user_bundle_role_functions') {

      actionMessage ='Record updated succesfully!';

      result = await updateUserrolefunctions();
    }

    if (result?.status === 'success') {
      
      const user_bundle_role_functionsUptoken = btoa(result.user_bundle_role_functions_dataNode || '');

      //set id key
      setters.setUserrolefunctionsUptoken(user_bundle_role_functionsUptoken);
      
      //update url with new user_bundle_role_functionsUptoken
      mosyUpdateUrlParam('user_bundle_role_functions_dataNode', user_bundle_role_functionsUptoken)

      setters.setUserrolefunctionsActionStatus('update_user_bundle_role_functions')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: user_bundle_role_functionsUptoken,
        actionName : actionType,
        actionType : 'user_bundle_role_functions_form_submission'
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


export async function initUserrolefunctionsProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing User Role Functions' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.userrolefunctions.base,
      params: { 
      ...rawQstr,
      src : btoa(`initUserrolefunctionsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('bundlefunctions Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching bundlefunctions data:', response.message);  // Handle error
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


export async function DeleteUserrolefunctions(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.userrolefunctions.delete,
        params: { 
          _user_bundle_role_functions_delete_record: (token), 
          },
      });

      console.log('Token DeleteUserrolefunctions '+token)
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


export async function getUserrolefunctionsListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('quser_bundle_role_functions_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.userrolefunctions.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getUserrolefunctionsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('bundlefunctions Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching bundlefunctions data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadUserrolefunctionsListData(customQueryStr, setters) {

    const gftUserrolefunctions = MosySecureFilterEngine('user_bundle_role_functions');
    let finalFilterStr = (gftUserrolefunctions);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setUserrolefunctionsLoading(true);
    
    const userrolefunctionsListData = await getUserrolefunctionsListData(finalFilterStr);
    
    setters.setUserrolefunctionsLoading(false)
    setters.setUserrolefunctionsListData(userrolefunctionsListData?.data)

    setters.setUserrolefunctionsListPageCount(userrolefunctionsListData?.pagination?.page_count)


    return userrolefunctionsListData

}
  
  
export async function userrolefunctionsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const userrolefunctionsTokenId = mosyUrlParam('user_bundle_role_functions_dataNode');
    
    const deleteParam = mosyUrlParam('user_bundle_role_functions_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedUserrolefunctionsToken = '0';
    if (userrolefunctionsTokenId) {
      
      decodedUserrolefunctionsToken = atob(userrolefunctionsTokenId); // Decode the record_id
      setters.setUserrolefunctionsUptoken(userrolefunctionsTokenId);
      setters.setUserrolefunctionsActionStatus('update_user_bundle_role_functions');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawUserrolefunctionsQueryStr ={Node:btoa(decodedUserrolefunctionsToken)}
    if(customQueryStr!='')
    {
      // if no user_bundle_role_functions_dataNode set , use customQueryStr
      if (!userrolefunctionsTokenId) {
       rawUserrolefunctionsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initUserrolefunctionsProfileData(rawUserrolefunctionsQueryStr)

    if(deleteParam){
      popDeleteDialog(userrolefunctionsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setUserrolefunctionsNode(finalProfileData)
    
    
}
  
  

export function InteprateUserrolefunctionsEvent(data) {
     
  //console.log(' Userrolefunctions Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_user_bundle_role_functions){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('UserrolefunctionsProfileTray')

    
    mosyUpdateUrlParam('user_bundle_role_functions_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setUserrolefunctionsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('UserrolefunctionsProfileTray')

    
    mosyUpdateUrlParam('user_bundle_role_functions_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_user_bundle_role_functions){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add user_bundle_role_functions `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('UserrolefunctionsProfileTray')
      }
    }
     
  }

  if(childActionName.update_user_bundle_role_functions){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update user_bundle_role_functions `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('UserrolefunctionsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_user_bundle_role_functions){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../bundlefunctions/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteUserrolefunctions(deleteToken).then(response=>{
  
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
       deleteUrlParam('user_bundle_role_functions_delete');
        
    }
  
  });

}