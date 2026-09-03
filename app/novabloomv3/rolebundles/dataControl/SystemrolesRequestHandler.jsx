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
export async function insertSystemroles() {
 //console.log(`Form system_role_bundles insert sent `)

  return await mosyPostFormData({
    formId: 'system_role_bundles_profile_form',
    url: apiRoutes.systemroles.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateSystemroles() {

  //console.log(`Form system_role_bundles update sent `)

  return await mosyPostFormData({
    formId: 'system_role_bundles_profile_form',
    url: apiRoutes.systemroles.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateSystemrolesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('system_role_bundles_mosy_action');
 
 //console.log(`Form system_role_bundles submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_system_role_bundles') {

      actionMessage ='Record added succesfully!';

      result = await insertSystemroles();
    }

    if (actionType === 'update_system_role_bundles') {

      actionMessage ='Record updated succesfully!';

      result = await updateSystemroles();
    }

    if (result?.status === 'success') {
      
      const system_role_bundlesUptoken = btoa(result.system_role_bundles_dataNode || '');

      //set id key
      setters.setSystemrolesUptoken(system_role_bundlesUptoken);
      
      //update url with new system_role_bundlesUptoken
      mosyUpdateUrlParam('system_role_bundles_dataNode', system_role_bundlesUptoken)

      setters.setSystemrolesActionStatus('update_system_role_bundles')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: system_role_bundlesUptoken,
        actionName : actionType,
        actionType : 'system_role_bundles_form_submission'
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


export async function initSystemrolesProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing System Roles' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.systemroles.base,
      params: { 
      ...rawQstr,
      src : btoa(`initSystemrolesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('rolebundles Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching rolebundles data:', response.message);  // Handle error
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


export async function DeleteSystemroles(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.systemroles.delete,
        params: { 
          _system_role_bundles_delete_record: (token), 
          },
      });

      console.log('Token DeleteSystemroles '+token)
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


export async function getSystemrolesListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qsystem_role_bundles_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.systemroles.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getSystemrolesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('rolebundles Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching rolebundles data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadSystemrolesListData(customQueryStr, setters) {

    const gftSystemroles = MosySecureFilterEngine('system_role_bundles');
    let finalFilterStr = (gftSystemroles);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSystemrolesLoading(true);
    
    const systemrolesListData = await getSystemrolesListData(finalFilterStr);
    
    setters.setSystemrolesLoading(false)
    setters.setSystemrolesListData(systemrolesListData?.data)

    setters.setSystemrolesListPageCount(systemrolesListData?.pagination?.page_count)


    return systemrolesListData

}
  
  
export async function systemrolesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const systemrolesTokenId = mosyUrlParam('system_role_bundles_dataNode');
    
    const deleteParam = mosyUrlParam('system_role_bundles_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSystemrolesToken = '0';
    if (systemrolesTokenId) {
      
      decodedSystemrolesToken = atob(systemrolesTokenId); // Decode the record_id
      setters.setSystemrolesUptoken(systemrolesTokenId);
      setters.setSystemrolesActionStatus('update_system_role_bundles');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSystemrolesQueryStr ={Node:btoa(decodedSystemrolesToken)}
    if(customQueryStr!='')
    {
      // if no system_role_bundles_dataNode set , use customQueryStr
      if (!systemrolesTokenId) {
       rawSystemrolesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSystemrolesProfileData(rawSystemrolesQueryStr)

    if(deleteParam){
      popDeleteDialog(systemrolesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSystemrolesNode(finalProfileData)
    
    
}
  
  

export function InteprateSystemrolesEvent(data) {
     
  //console.log(' Systemroles Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_system_role_bundles){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SystemrolesProfileTray')

    
    mosyUpdateUrlParam('system_role_bundles_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSystemrolesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SystemrolesProfileTray')

    
    mosyUpdateUrlParam('system_role_bundles_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_system_role_bundles){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add system_role_bundles `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SystemrolesProfileTray')
      }
    }
     
  }

  if(childActionName.update_system_role_bundles){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update system_role_bundles `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('SystemrolesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_system_role_bundles){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../rolebundles/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSystemroles(deleteToken).then(response=>{
  
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
       deleteUrlParam('system_role_bundles_delete');
        
    }
  
  });

}