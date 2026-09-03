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
export async function insertAssetpricing() {
 //console.log(`Form asset_pricing insert sent `)

  return await mosyPostFormData({
    formId: 'asset_pricing_profile_form',
    url: apiRoutes.assetpricing.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateAssetpricing() {

  //console.log(`Form asset_pricing update sent `)

  return await mosyPostFormData({
    formId: 'asset_pricing_profile_form',
    url: apiRoutes.assetpricing.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateAssetpricingFormAction(e, setters) {
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

      result = await insertAssetpricing();
    }

    if (actionType === 'update_asset_pricing') {

      actionMessage ='Record updated succesfully!';

      result = await updateAssetpricing();
    }

    if (result?.status === 'success') {
      
      const asset_pricingUptoken = btoa(result.asset_pricing_dataNode || '');

      //set id key
      setters.setAssetpricingUptoken(asset_pricingUptoken);
      
      //update url with new asset_pricingUptoken
      mosyUpdateUrlParam('asset_pricing_dataNode', asset_pricingUptoken)

      setters.setAssetpricingActionStatus('update_asset_pricing')
    
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


export async function initAssetpricingProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Asset pricing' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.assetpricing.base,
      params: { 
      ...rawQstr,
      src : btoa(`initAssetpricingProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('asset_pricing Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching asset_pricing data:', response.message);  // Handle error
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


export async function DeleteAssetpricing(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.assetpricing.delete,
        params: { 
          _asset_pricing_delete_record: (token), 
          },
      });

      console.log('Token DeleteAssetpricing '+token)
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


export async function getAssetpricingListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qasset_pricing_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.assetpricing.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getAssetpricingListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('asset_pricing Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching asset_pricing data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadAssetpricingListData(customQueryStr, setters) {

    const gftAssetpricing = MosySecureFilterEngine('asset_pricing');
    let finalFilterStr = (gftAssetpricing);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setAssetpricingLoading(true);
    
    const assetpricingListData = await getAssetpricingListData(finalFilterStr);
    
    setters.setAssetpricingLoading(false)
    setters.setAssetpricingListData(assetpricingListData?.data)

    setters.setAssetpricingListPageCount(assetpricingListData?.pagination?.page_count)


    return assetpricingListData

}
  
  
export async function assetpricingProfileData(customQueryStr, setters, router, customProfileData={}) {

    const assetpricingTokenId = mosyUrlParam('asset_pricing_dataNode');
    
    const deleteParam = mosyUrlParam('asset_pricing_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedAssetpricingToken = '0';
    if (assetpricingTokenId) {
      
      decodedAssetpricingToken = atob(assetpricingTokenId); // Decode the record_id
      setters.setAssetpricingUptoken(assetpricingTokenId);
      setters.setAssetpricingActionStatus('update_asset_pricing');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawAssetpricingQueryStr ={Node:btoa(decodedAssetpricingToken)}
    if(customQueryStr!='')
    {
      // if no asset_pricing_dataNode set , use customQueryStr
      if (!assetpricingTokenId) {
       rawAssetpricingQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initAssetpricingProfileData(rawAssetpricingQueryStr)

    if(deleteParam){
      popDeleteDialog(assetpricingTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setAssetpricingNode(finalProfileData)
    
    
}
  
  

export function InteprateAssetpricingEvent(data) {
     
  //console.log(' Assetpricing Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_asset_pricing){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('AssetpricingProfileTray')

    
    mosyUpdateUrlParam('asset_pricing_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setAssetpricingCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('AssetpricingProfileTray')

    
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
        parentStateSetter?.setActiveScrollId('AssetpricingProfileTray')
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
        parentStateSetter?.setActiveScrollId('AssetpricingProfileTray')
        
      }
    }
  }

  if(childActionName.delete_asset_pricing){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../asset_pricing/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteAssetpricing(deleteToken).then(response=>{
  
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