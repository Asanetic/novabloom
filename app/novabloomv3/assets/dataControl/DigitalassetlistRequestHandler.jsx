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
export async function insertDigitalassetlist() {
 //console.log(`Form assets insert sent `)

  return await mosyPostFormData({
    formId: 'assets_profile_form',
    url: apiRoutes.digitalassetlist.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateDigitalassetlist() {

  //console.log(`Form assets update sent `)

  return await mosyPostFormData({
    formId: 'assets_profile_form',
    url: apiRoutes.digitalassetlist.base,
    method: 'PUT',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateDigitalassetlistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('assets_mosy_action');
 
 //console.log(`Form assets submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_assets') {

      actionMessage ='Record added succesfully!';

      result = await insertDigitalassetlist();
    }

    if (actionType === 'update_assets') {

      actionMessage ='Record updated succesfully!';

      result = await updateDigitalassetlist();
    }

    if (result?.status === 'success') {
      
      const assetsUptoken = btoa(result.assets_dataNode || '');

      //set id key
      setters.setDigitalassetlistUptoken(assetsUptoken);
      
      //update url with new assetsUptoken
      mosyUpdateUrlParam('assets_dataNode', assetsUptoken)

      setters.setDigitalassetlistActionStatus('update_assets')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: assetsUptoken,
        actionName : actionType,
        actionType : 'assets_form_submission'
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


export async function initDigitalassetlistProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Digital Asset List' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.digitalassetlist.base,
      params: { 
      ...rawQstr,
      src : btoa(`initDigitalassetlistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('assets Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching assets data:', response.message);  // Handle error
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


export async function DeleteDigitalassetlist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.digitalassetlist.delete,
        params: { 
          _assets_delete_record: (token), 
          },
      });

      console.log('Token DeleteDigitalassetlist '+token)
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


export async function getDigitalassetlistListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qassets_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.digitalassetlist.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getDigitalassetlistListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('assets Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching assets data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDigitalassetlistListData(customQueryStr, setters) {

    const gftDigitalassetlist = MosySecureFilterEngine('assets');
    let finalFilterStr = (gftDigitalassetlist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDigitalassetlistLoading(true);
    
    const digitalassetlistListData = await getDigitalassetlistListData(finalFilterStr);
    
    setters.setDigitalassetlistLoading(false)
    setters.setDigitalassetlistListData(digitalassetlistListData?.data)

    setters.setDigitalassetlistListPageCount(digitalassetlistListData?.pagination?.page_count)


    return digitalassetlistListData

}
  
  
export async function digitalassetlistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const digitalassetlistTokenId = mosyUrlParam('assets_dataNode');
    
    const deleteParam = mosyUrlParam('assets_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDigitalassetlistToken = '0';
    if (digitalassetlistTokenId) {
      
      decodedDigitalassetlistToken = atob(digitalassetlistTokenId); // Decode the record_id
      setters.setDigitalassetlistUptoken(digitalassetlistTokenId);
      setters.setDigitalassetlistActionStatus('update_assets');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDigitalassetlistQueryStr ={Node:btoa(decodedDigitalassetlistToken)}
    if(customQueryStr!='')
    {
      // if no assets_dataNode set , use customQueryStr
      if (!digitalassetlistTokenId) {
       rawDigitalassetlistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initDigitalassetlistProfileData(rawDigitalassetlistQueryStr)

    if(deleteParam){
      popDeleteDialog(digitalassetlistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDigitalassetlistNode(finalProfileData)
    
    
}
  
  

export function InteprateDigitalassetlistEvent(data) {
     
  //console.log(' Digitalassetlist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_assets){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DigitalassetlistProfileTray')

    
    mosyUpdateUrlParam('assets_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setDigitalassetlistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DigitalassetlistProfileTray')

    
    mosyUpdateUrlParam('assets_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_assets){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add assets `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DigitalassetlistProfileTray')
      }
    }
     
  }

  if(childActionName.update_assets){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update assets `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DigitalassetlistProfileTray')
        
      }
    }
  }

  if(childActionName.delete_assets){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../assets/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDigitalassetlist(deleteToken).then(response=>{
  
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
       deleteUrlParam('assets_delete');
        
    }
  
  });

}