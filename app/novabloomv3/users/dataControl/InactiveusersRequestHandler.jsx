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
export async function insertInactiveusers() {
 //console.log(`Form app_users insert sent `)

  return await mosyPostFormData({
    formId: 'app_users_profile_form',
    url: apiRoutes.inactiveusers.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateInactiveusers() {

  //console.log(`Form app_users update sent `)

  return await mosyPostFormData({
    formId: 'app_users_profile_form',
    url: apiRoutes.inactiveusers.base,
    method: 'PUT',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateInactiveusersFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('app_users_mosy_action');
 
 //console.log(`Form app_users submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_app_users') {

      actionMessage ='Record added succesfully!';

      result = await insertInactiveusers();
    }

    if (actionType === 'update_app_users') {

      actionMessage ='Record updated succesfully!';

      result = await updateInactiveusers();
    }

    if (result?.status === 'success') {
      
      const app_usersUptoken = btoa(result.app_users_dataNode || '');

      //set id key
      setters.setInactiveusersUptoken(app_usersUptoken);
      
      //update url with new app_usersUptoken
      mosyUpdateUrlParam('app_users_dataNode', app_usersUptoken)

      setters.setInactiveusersActionStatus('update_app_users')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: app_usersUptoken,
        actionName : actionType,
        actionType : 'app_users_form_submission'
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


export async function initInactiveusersProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Inactive users' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.inactiveusers.base,
      params: { 
      ...rawQstr,
      src : btoa(`initInactiveusersProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('users Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching users data:', response.message);  // Handle error
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


export async function DeleteInactiveusers(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.inactiveusers.delete,
        params: { 
          _app_users_delete_record: (token), 
          },
      });

      console.log('Token DeleteInactiveusers '+token)
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


export async function getInactiveusersListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qapp_users_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.inactiveusers.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getInactiveusersListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('users Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching users data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadInactiveusersListData(customQueryStr, setters) {

    const gftInactiveusers = MosySecureFilterEngine('app_users');
    let finalFilterStr = (gftInactiveusers);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setInactiveusersLoading(true);
    
    const inactiveusersListData = await getInactiveusersListData(finalFilterStr);
    
    setters.setInactiveusersLoading(false)
    setters.setInactiveusersListData(inactiveusersListData?.data)

    setters.setInactiveusersListPageCount(inactiveusersListData?.pagination?.page_count)


    return inactiveusersListData

}
  
  
export async function inactiveusersProfileData(customQueryStr, setters, router, customProfileData={}) {

    const inactiveusersTokenId = mosyUrlParam('app_users_dataNode');
    
    const deleteParam = mosyUrlParam('app_users_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedInactiveusersToken = '0';
    if (inactiveusersTokenId) {
      
      decodedInactiveusersToken = atob(inactiveusersTokenId); // Decode the record_id
      setters.setInactiveusersUptoken(inactiveusersTokenId);
      setters.setInactiveusersActionStatus('update_app_users');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawInactiveusersQueryStr ={Node:btoa(decodedInactiveusersToken)}
    if(customQueryStr!='')
    {
      // if no app_users_dataNode set , use customQueryStr
      if (!inactiveusersTokenId) {
       rawInactiveusersQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initInactiveusersProfileData(rawInactiveusersQueryStr)

    if(deleteParam){
      popDeleteDialog(inactiveusersTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setInactiveusersNode(finalProfileData)
    
    
}
  
  

export function InteprateInactiveusersEvent(data) {
     
  //console.log(' Inactiveusers Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_app_users){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('InactiveusersProfileTray')

    
    mosyUpdateUrlParam('app_users_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setInactiveusersCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('InactiveusersProfileTray')

    
    mosyUpdateUrlParam('app_users_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_app_users){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add app_users `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('InactiveusersProfileTray')
      }
    }
     
  }

  if(childActionName.update_app_users){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update app_users `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('InactiveusersProfileTray')
        
      }
    }
  }

  if(childActionName.delete_app_users){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../users/dormarntusers')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteInactiveusers(deleteToken).then(response=>{
  
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
       deleteUrlParam('app_users_delete');
        
    }
  
  });

}