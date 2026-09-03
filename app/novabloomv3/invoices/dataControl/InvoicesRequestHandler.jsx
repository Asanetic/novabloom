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
export async function insertInvoices() {
 //console.log(`Form invoices insert sent `)

  return await mosyPostFormData({
    formId: 'invoices_profile_form',
    url: apiRoutes.invoices.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateInvoices() {

  //console.log(`Form invoices update sent `)

  return await mosyPostFormData({
    formId: 'invoices_profile_form',
    url: apiRoutes.invoices.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateInvoicesFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('invoices_mosy_action');
 
 //console.log(`Form invoices submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_invoices') {

      actionMessage ='Record added succesfully!';

      result = await insertInvoices();
    }

    if (actionType === 'update_invoices') {

      actionMessage ='Record updated succesfully!';

      result = await updateInvoices();
    }

    if (result?.status === 'success') {
      
      const invoicesUptoken = btoa(result.invoices_dataNode || '');

      //set id key
      setters.setInvoicesUptoken(invoicesUptoken);
      
      //update url with new invoicesUptoken
      mosyUpdateUrlParam('invoices_dataNode', invoicesUptoken)

      setters.setInvoicesActionStatus('update_invoices')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: invoicesUptoken,
        actionName : actionType,
        actionType : 'invoices_form_submission'
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


export async function initInvoicesProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Invoices' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.invoices.base,
      params: { 
      ...rawQstr,
      src : btoa(`initInvoicesProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('invoices Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching invoices data:', response.message);  // Handle error
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


export async function DeleteInvoices(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.invoices.delete,
        params: { 
          _invoices_delete_record: (token), 
          },
      });

      console.log('Token DeleteInvoices '+token)
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


export async function getInvoicesListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qinvoices_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.invoices.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getInvoicesListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('invoices Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching invoices data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadInvoicesListData(customQueryStr, setters) {

    const gftInvoices = MosySecureFilterEngine('invoices');
    let finalFilterStr = (gftInvoices);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setInvoicesLoading(true);
    
    const invoicesListData = await getInvoicesListData(finalFilterStr);
    
    setters.setInvoicesLoading(false)
    setters.setInvoicesListData(invoicesListData?.data)

    setters.setInvoicesListPageCount(invoicesListData?.pagination?.page_count)


    return invoicesListData

}
  
  
export async function invoicesProfileData(customQueryStr, setters, router, customProfileData={}) {

    const invoicesTokenId = mosyUrlParam('invoices_dataNode');
    
    const deleteParam = mosyUrlParam('invoices_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedInvoicesToken = '0';
    if (invoicesTokenId) {
      
      decodedInvoicesToken = atob(invoicesTokenId); // Decode the record_id
      setters.setInvoicesUptoken(invoicesTokenId);
      setters.setInvoicesActionStatus('update_invoices');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawInvoicesQueryStr ={Node:btoa(decodedInvoicesToken)}
    if(customQueryStr!='')
    {
      // if no invoices_dataNode set , use customQueryStr
      if (!invoicesTokenId) {
       rawInvoicesQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initInvoicesProfileData(rawInvoicesQueryStr)

    if(deleteParam){
      popDeleteDialog(invoicesTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setInvoicesNode(finalProfileData)
    
    
}
  
  

export function InteprateInvoicesEvent(data) {
     
  //console.log(' Invoices Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_invoices){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('InvoicesProfileTray')

    
    mosyUpdateUrlParam('invoices_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setInvoicesCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('InvoicesProfileTray')

    
    mosyUpdateUrlParam('invoices_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_invoices){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add invoices `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('InvoicesProfileTray')
      }
    }
     
  }

  if(childActionName.update_invoices){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update invoices `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('InvoicesProfileTray')
        
      }
    }
  }

  if(childActionName.delete_invoices){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../invoices/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteInvoices(deleteToken).then(response=>{
  
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
       deleteUrlParam('invoices_delete');
        
    }
  
  });

}