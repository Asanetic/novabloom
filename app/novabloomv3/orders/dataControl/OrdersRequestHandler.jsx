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
export async function insertOrders() {
 //console.log(`Form orders insert sent `)

  return await mosyPostFormData({
    formId: 'orders_profile_form',
    url: apiRoutes.orders.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateOrders() {

  //console.log(`Form orders update sent `)

  return await mosyPostFormData({
    formId: 'orders_profile_form',
    url: apiRoutes.orders.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateOrdersFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('orders_mosy_action');
 
 //console.log(`Form orders submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_orders') {

      actionMessage ='Record added succesfully!';

      result = await insertOrders();
    }

    if (actionType === 'update_orders') {

      actionMessage ='Record updated succesfully!';

      result = await updateOrders();
    }

    if (result?.status === 'success') {
      
      const ordersUptoken = btoa(result.orders_dataNode || '');

      //set id key
      setters.setOrdersUptoken(ordersUptoken);
      
      //update url with new ordersUptoken
      mosyUpdateUrlParam('orders_dataNode', ordersUptoken)

      setters.setOrdersActionStatus('update_orders')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: ordersUptoken,
        actionName : actionType,
        actionType : 'orders_form_submission'
      };
            
      
    } else {
      MosyNotify({message:"A small error occured. Kindly try again", iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
    MosyNotify({message:`A small error occured.  ${error}`, iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initOrdersProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Orders' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.orders.base,
      params: { 
      ...rawQstr,
      src : btoa(`initOrdersProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('orders Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching orders data:', response.message);  // Handle error

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteOrders(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.orders.delete,
        params: { 
          _orders_delete_record: (token), 
          },
      });

      console.log('Token DeleteOrders '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response.data; // Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        closeMosyModal();
        
        return []; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getOrdersListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qorders_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.orders.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getOrdersListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('orders Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching orders data:', response);
      return []; // Safe fallback
    }
  } catch (err) {
    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadOrdersListData(customQueryStr, setters) {

    const gftOrders = MosySecureFilterEngine('orders');
    let finalFilterStr = (gftOrders);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setOrdersLoading(true);
    
    const ordersListData = await getOrdersListData(finalFilterStr);
    
    setters.setOrdersLoading(false)
    setters.setOrdersListData(ordersListData?.data)

    setters.setOrdersListPageCount(ordersListData?.pagination?.page_count)


    return ordersListData

}
  
  
export async function ordersProfileData(customQueryStr, setters, router, customProfileData={}) {

    const ordersTokenId = mosyUrlParam('orders_dataNode');
    
    const deleteParam = mosyUrlParam('orders_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedOrdersToken = '0';
    if (ordersTokenId) {
      
      decodedOrdersToken = atob(ordersTokenId); // Decode the record_id
      setters.setOrdersUptoken(ordersTokenId);
      setters.setOrdersActionStatus('update_orders');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawOrdersQueryStr ={Node:btoa(decodedOrdersToken)}
    if(customQueryStr!='')
    {
      // if no orders_dataNode set , use customQueryStr
      if (!ordersTokenId) {
       rawOrdersQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initOrdersProfileData(rawOrdersQueryStr)

    if(deleteParam){
      popDeleteDialog(ordersTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setOrdersNode(finalProfileData)
    
    
}
  
  

export function InteprateOrdersEvent(data) {
     
  //console.log(' Orders Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_orders){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('OrdersProfileTray')

    
    mosyUpdateUrlParam('orders_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setOrdersCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('OrdersProfileTray')

    
    mosyUpdateUrlParam('orders_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_orders){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add orders `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('OrdersProfileTray')
      }
    }
     
  }

  if(childActionName.update_orders){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update orders `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('OrdersProfileTray')
        
      }
    }
  }

  if(childActionName.delete_orders){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../orders/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteOrders(deleteToken).then(data=>{
  
        childSetters?.setSnackMessage("Record deleted succesfully!")
        childSetters?.setParentUseEffectKey(magicRandomStr());
        childSetters?.setLocalEventSignature(magicRandomStr());

        if(router){
          router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
        }
                  
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('orders_delete');
        
    }
  
  });

}