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
export async function insertManageassetpricing() {
 //console.log(`Form asset_pricing insert sent `)

  return await mosyPostFormData({
    formId: 'asset_pricing_profile_form',
    url: apiRoutes.manageassetpricing.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateManageassetpricing() {

  //console.log(`Form asset_pricing update sent `)

  return await mosyPostFormData({
    formId: 'asset_pricing_profile_form',
    url: apiRoutes.manageassetpricing.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateManageassetpricingFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('asset_pricing_mosy_action');
 
 //console.log(`Form asset_pricing submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_asset_pricing') {

      actionMessage ='Record added succesfully!';

      result = await insertManageassetpricing();
    }

    if (actionType === 'update_asset_pricing') {

      actionMessage ='Record updated succesfully!';

      result = await updateManageassetpricing();
    }

    if (result?.status === 'success') {
      
      const asset_pricingUptoken = btoa(result.asset_pricing_dataNode || '');

      //set id key
      setters.setManageassetpricingUptoken(asset_pricingUptoken);
      
      //update url with new asset_pricingUptoken
      mosyUpdateUrlParam('asset_pricing_dataNode', asset_pricingUptoken)

      setters.setManageassetpricingActionStatus('update_asset_pricing')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: asset_pricingUptoken,
        actionName : actionType,
        actionType : 'asset_pricing_form_submission'
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


export async function initManageassetpricingProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Manage Asset Pricing' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.manageassetpricing.base,
      params: { 
      ...rawQstr,
      src : btoa(`initManageassetpricingProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('managepricing Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching managepricing data:', response.message);  // Handle error
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


export async function DeleteManageassetpricing(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.manageassetpricing.delete,
        params: { 
          _asset_pricing_delete_record: (token), 
          },
      });

      console.log('Token DeleteManageassetpricing '+token)
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


export async function getManageassetpricingListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qasset_pricing_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.manageassetpricing.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getManageassetpricingListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('managepricing Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching managepricing data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadManageassetpricingListData(customQueryStr, setters) {

    const gftManageassetpricing = MosySecureFilterEngine('asset_pricing');
    let finalFilterStr = (gftManageassetpricing);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setManageassetpricingLoading(true);
    
    const manageassetpricingListData = await getManageassetpricingListData(finalFilterStr);
    
    setters.setManageassetpricingLoading(false)
    setters.setManageassetpricingListData(manageassetpricingListData?.data)

    setters.setManageassetpricingListPageCount(manageassetpricingListData?.pagination?.page_count)


    return manageassetpricingListData

}
  
  
export async function manageassetpricingProfileData(customQueryStr, setters, router, customProfileData={}) {

    const manageassetpricingTokenId = mosyUrlParam('asset_pricing_dataNode');
    
    const deleteParam = mosyUrlParam('asset_pricing_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedManageassetpricingToken = '0';
    if (manageassetpricingTokenId) {
      
      decodedManageassetpricingToken = atob(manageassetpricingTokenId); // Decode the record_id
      setters.setManageassetpricingUptoken(manageassetpricingTokenId);
      setters.setManageassetpricingActionStatus('update_asset_pricing');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawManageassetpricingQueryStr ={Node:btoa(decodedManageassetpricingToken)}
    if(customQueryStr!='')
    {
      // if no asset_pricing_dataNode set , use customQueryStr
      if (!manageassetpricingTokenId) {
       rawManageassetpricingQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initManageassetpricingProfileData(rawManageassetpricingQueryStr)

    if(deleteParam){
      popDeleteDialog(manageassetpricingTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setManageassetpricingNode(finalProfileData)
    
    
}
  
  

export function InteprateManageassetpricingEvent(data) {
     
  //console.log(' Manageassetpricing Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_asset_pricing){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ManageassetpricingProfileTray')

    
    mosyUpdateUrlParam('asset_pricing_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setManageassetpricingCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ManageassetpricingProfileTray')

    
    mosyUpdateUrlParam('asset_pricing_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_asset_pricing){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add asset_pricing `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ManageassetpricingProfileTray')
      }
    }
     
  }

  if(childActionName.update_asset_pricing){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update asset_pricing `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ManageassetpricingProfileTray')
        
      }
    }
  }

  if(childActionName.delete_asset_pricing){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../managepricing/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteManageassetpricing(deleteToken).then(response=>{
  
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
       deleteUrlParam('asset_pricing_delete');
        
    }
  
  });

}