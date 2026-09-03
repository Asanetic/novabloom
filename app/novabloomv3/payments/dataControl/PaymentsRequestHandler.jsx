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
export async function insertPayments() {
 //console.log(`Form payments insert sent `)

  return await mosyPostFormData({
    formId: 'payments_profile_form',
    url: apiRoutes.payments.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updatePayments() {

  //console.log(`Form payments update sent `)

  return await mosyPostFormData({
    formId: 'payments_profile_form',
    url: apiRoutes.payments.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function intepratePaymentsFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('payments_mosy_action');
 
 //console.log(`Form payments submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_payments') {

      actionMessage ='Record added succesfully!';

      result = await insertPayments();
    }

    if (actionType === 'update_payments') {

      actionMessage ='Record updated succesfully!';

      result = await updatePayments();
    }

    if (result?.status === 'success') {
      
      const paymentsUptoken = btoa(result.payments_dataNode || '');

      //set id key
      setters.setPaymentsUptoken(paymentsUptoken);
      
      //update url with new paymentsUptoken
      mosyUpdateUrlParam('payments_dataNode', paymentsUptoken)

      setters.setPaymentsActionStatus('update_payments')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: paymentsUptoken,
        actionName : actionType,
        actionType : 'payments_form_submission'
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


export async function initPaymentsProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Payments' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.payments.base,
      params: { 
      ...rawQstr,
      src : btoa(`initPaymentsProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('payments Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching payments data:', response.message);  // Handle error
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


export async function DeletePayments(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.payments.delete,
        params: { 
          _payments_delete_record: (token), 
          },
      });

      console.log('Token DeletePayments '+token)
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


export async function getPaymentsListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qpayments_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.payments.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getPaymentsListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('payments Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching payments data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadPaymentsListData(customQueryStr, setters) {

    const gftPayments = MosySecureFilterEngine('payments');
    let finalFilterStr = (gftPayments);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setPaymentsLoading(true);
    
    const paymentsListData = await getPaymentsListData(finalFilterStr);
    
    setters.setPaymentsLoading(false)
    setters.setPaymentsListData(paymentsListData?.data)

    setters.setPaymentsListPageCount(paymentsListData?.pagination?.page_count)


    return paymentsListData

}
  
  
export async function paymentsProfileData(customQueryStr, setters, router, customProfileData={}) {

    const paymentsTokenId = mosyUrlParam('payments_dataNode');
    
    const deleteParam = mosyUrlParam('payments_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedPaymentsToken = '0';
    if (paymentsTokenId) {
      
      decodedPaymentsToken = atob(paymentsTokenId); // Decode the record_id
      setters.setPaymentsUptoken(paymentsTokenId);
      setters.setPaymentsActionStatus('update_payments');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawPaymentsQueryStr ={Node:btoa(decodedPaymentsToken)}
    if(customQueryStr!='')
    {
      // if no payments_dataNode set , use customQueryStr
      if (!paymentsTokenId) {
       rawPaymentsQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initPaymentsProfileData(rawPaymentsQueryStr)

    if(deleteParam){
      popDeleteDialog(paymentsTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setPaymentsNode(finalProfileData)
    
    
}
  
  

export function IntepratePaymentsEvent(data) {
     
  //console.log(' Payments Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_payments){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('PaymentsProfileTray')

    
    mosyUpdateUrlParam('payments_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setPaymentsCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('PaymentsProfileTray')

    
    mosyUpdateUrlParam('payments_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_payments){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add payments `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('PaymentsProfileTray')
      }
    }
     
  }

  if(childActionName.update_payments){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update payments `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('PaymentsProfileTray')
        
      }
    }
  }

  if(childActionName.delete_payments){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../payments/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeletePayments(deleteToken).then(response=>{
  
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
       deleteUrlParam('payments_delete');
        
    }
  
  });

}