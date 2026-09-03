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
export async function insertSelectsubscriptiontoinvoice() {
 //console.log(`Form subscriptions insert sent `)

  return await mosyPostFormData({
    formId: 'subscriptions_profile_form',
    url: apiRoutes.selectsubscriptiontoinvoice.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateSelectsubscriptiontoinvoice() {

  //console.log(`Form subscriptions update sent `)

  return await mosyPostFormData({
    formId: 'subscriptions_profile_form',
    url: apiRoutes.selectsubscriptiontoinvoice.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateSelectsubscriptiontoinvoiceFormAction(e, setters) {
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

      result = await insertSelectsubscriptiontoinvoice();
    }

    if (actionType === 'update_subscriptions') {

      actionMessage ='Record updated succesfully!';

      result = await updateSelectsubscriptiontoinvoice();
    }

    if (result?.status === 'success') {
      
      const subscriptionsUptoken = btoa(result.subscriptions_dataNode || '');

      //set id key
      setters.setSelectsubscriptiontoinvoiceUptoken(subscriptionsUptoken);
      
      //update url with new subscriptionsUptoken
      mosyUpdateUrlParam('subscriptions_dataNode', subscriptionsUptoken)

      setters.setSelectsubscriptiontoinvoiceActionStatus('update_subscriptions')
    
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


export async function initSelectsubscriptiontoinvoiceProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Select subscription to invoice' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.selectsubscriptiontoinvoice.base,
      params: { 
      ...rawQstr,
      src : btoa(`initSelectsubscriptiontoinvoiceProfileData`)
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


export async function DeleteSelectsubscriptiontoinvoice(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.selectsubscriptiontoinvoice.delete,
        params: { 
          _subscriptions_delete_record: (token), 
          },
      });

      console.log('Token DeleteSelectsubscriptiontoinvoice '+token)
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


export async function getSelectsubscriptiontoinvoiceListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qsubscriptions_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.selectsubscriptiontoinvoice.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getSelectsubscriptiontoinvoiceListData`)
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


export async function loadSelectsubscriptiontoinvoiceListData(customQueryStr, setters) {

    const gftSelectsubscriptiontoinvoice = MosySecureFilterEngine('subscriptions');
    let finalFilterStr = (gftSelectsubscriptiontoinvoice);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setSelectsubscriptiontoinvoiceLoading(true);
    
    const selectsubscriptiontoinvoiceListData = await getSelectsubscriptiontoinvoiceListData(finalFilterStr);
    
    setters.setSelectsubscriptiontoinvoiceLoading(false)
    setters.setSelectsubscriptiontoinvoiceListData(selectsubscriptiontoinvoiceListData?.data)

    setters.setSelectsubscriptiontoinvoiceListPageCount(selectsubscriptiontoinvoiceListData?.pagination?.page_count)


    return selectsubscriptiontoinvoiceListData

}
  
  
export async function selectsubscriptiontoinvoiceProfileData(customQueryStr, setters, router, customProfileData={}) {

    const selectsubscriptiontoinvoiceTokenId = mosyUrlParam('subscriptions_dataNode');
    
    const deleteParam = mosyUrlParam('subscriptions_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedSelectsubscriptiontoinvoiceToken = '0';
    if (selectsubscriptiontoinvoiceTokenId) {
      
      decodedSelectsubscriptiontoinvoiceToken = atob(selectsubscriptiontoinvoiceTokenId); // Decode the record_id
      setters.setSelectsubscriptiontoinvoiceUptoken(selectsubscriptiontoinvoiceTokenId);
      setters.setSelectsubscriptiontoinvoiceActionStatus('update_subscriptions');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawSelectsubscriptiontoinvoiceQueryStr ={Node:btoa(decodedSelectsubscriptiontoinvoiceToken)}
    if(customQueryStr!='')
    {
      // if no subscriptions_dataNode set , use customQueryStr
      if (!selectsubscriptiontoinvoiceTokenId) {
       rawSelectsubscriptiontoinvoiceQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initSelectsubscriptiontoinvoiceProfileData(rawSelectsubscriptiontoinvoiceQueryStr)

    if(deleteParam){
      popDeleteDialog(selectsubscriptiontoinvoiceTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setSelectsubscriptiontoinvoiceNode(finalProfileData)
    
    
}
  
  

export function InteprateSelectsubscriptiontoinvoiceEvent(data) {
     
  //console.log(' Selectsubscriptiontoinvoice Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_subscriptions){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SelectsubscriptiontoinvoiceProfileTray')

    
    mosyUpdateUrlParam('subscriptions_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setSelectsubscriptiontoinvoiceCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('SelectsubscriptiontoinvoiceProfileTray')

    
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
        parentStateSetter?.setActiveScrollId('SelectsubscriptiontoinvoiceProfileTray')
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
        parentStateSetter?.setActiveScrollId('SelectsubscriptiontoinvoiceProfileTray')
        
      }
    }
  }

  if(childActionName.delete_subscriptions){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../subscriptions/generateinvoice')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteSelectsubscriptiontoinvoice(deleteToken).then(response=>{
  
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