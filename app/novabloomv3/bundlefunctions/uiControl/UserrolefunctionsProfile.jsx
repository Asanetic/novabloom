'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam ,mosyTonum  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateUserrolefunctionsFormAction, userrolefunctionsProfileData , popDeleteDialog, InteprateUserrolefunctionsEvent } from '../dataControl/UserrolefunctionsRequestHandler';

//state management
import { useUserrolefunctionsState } from '../dataControl/UserrolefunctionsStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import {
  loadBundleRoleFunctions
} from '../logicControl/role-utils';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_USER_BUNDLE_ROLE_FUNCTIONS";

//live data detial / profile component

export default function UserrolefunctionsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="UserrolefunctionsMainProfilePage",
    parentProfileItemId = "UserrolefunctionsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Userrolefunctions states
  const [stateItem, stateItemSetters] = useUserrolefunctionsState(settersOverrides);
  const user_bundle_role_functionsNode = stateItem.userrolefunctionsNode
  
  // -- basic states --//
  const paramUserrolefunctionsUptoken  = stateItem.userrolefunctionsUptoken
  const userrolefunctionsActionStatus = stateItem.userrolefunctionsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setUserrolefunctionsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postUserrolefunctionsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateUserrolefunctionsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postUserrolefunctionsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("UserrolefunctionsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    userrolefunctionsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="UserrolefunctionsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0   ">
        <div className={` profile_container col-md-12 shadow-sm pb-4 m-0 pl-lg-3  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postUserrolefunctionsFormData} encType="multipart/form-data" id="user_bundle_role_functions_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {user_bundle_role_functionsNode?.primkey ? (  <span>{`Permission / ${user_bundle_role_functionsNode?.role_name}`}</span> ) :(<span> Add permission</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramUserrolefunctionsUptoken && (
                  <DeleteButton
                  src="UserrolefunctionsMainProfilePage"
                  tableName="user_bundle_role_functions"
                  uptoken={paramUserrolefunctionsUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3  hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && (
                  <>
                  <Link href={backToList} className="text-info hive_profile_nav_back_to_list "><i className="fa fa-arrow-left"></i> Back to list</Link>
                </>
              )}
              
            </div>
            <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
              
              
              
              {paramUserrolefunctionsUptoken && (
                <>
                
              </>
            )}
            
            {paramUserrolefunctionsUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="UserrolefunctionsMainProfilePage"
              tableName="user_bundle_role_functions"
              uptoken={paramUserrolefunctionsUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="UserrolefunctionsMainProfilePage"
              tableName="user_bundle_role_functions"
              link="./profile"
              label="Add permission"
              icon="link" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-12 row justify-content-center p-0 m-0">
              <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
                
                <input className="form-control" id="bundle_id" name="bundle_id" value={user_bundle_role_functionsNode?.bundle_id || ""} placeholder="Bundle Code" type="hidden"/>
                
                
                <input className="form-control" id="bundle_name" name="bundle_name" value={user_bundle_role_functionsNode?.bundle_name || ""} placeholder="Role name" type="hidden"/>
                
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.systemmodulemanifest.base}
                tblName="system_module_manifest_"
                parentTable="user_bundle_role_functions"
                inputName="_system_module_manifest__access_name_role_id"
                hiddenInputName="role_id"
                valueField="capability_key"
                displayField="access_name"
                label="Permission"
                defaultValue={{ capability_key: user_bundle_role_functionsNode?.role_id || "", access_name: user_bundle_role_functionsNode?._system_module_manifest__access_name_role_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  loadBundleRoleFunctions(dataRes, handleInputChange) }
                onInputChange={handleInputChange}
                defaultColSize="col-md-7"
                context={{hostParent : hostParent}}
                />
                
                <input className="form-control" id="role_name" name="role_name" value={user_bundle_role_functionsNode?.role_name || ""} placeholder="Role Name" type="hidden"/>
                
                
                <input className="form-control" id="remark" name="remark" value={user_bundle_role_functionsNode?.remark || ""} placeholder="Remark" type="hidden"/>
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="UserrolefunctionsMainProfilePage"
                tblName="user_bundle_role_functions"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="user_bundle_role_functions_dataNode" name="user_bundle_role_functions_dataNode" value={paramUserrolefunctionsUptoken}/>
            <input type="hidden" id="user_bundle_role_functions_mosy_action" name="user_bundle_role_functions_mosy_action" value={userrolefunctionsActionStatus}/>
          </section>
          
          
        </div>
        
      </form>
      
      
      <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
        {/*<hive_mini_list/>*/}
        
        
      </div>
    </div>
  </div>
  
  
  {/* snack notifications -- */}
  {snackMessage &&(
    <MosySnackWidget
    content={snackMessage}
    duration={5000}
    type="custom"
    onDone={() => {
      stateItemSetters.setSnackMessage("");
      stateItem.snackOnDone(); // Run whats inside onDone
      deleteUrlParam("snack_alert")
    }}
    
    />)}
    {/* snack notifications -- */}
    
    
    {/* ================== End Feature Section========================== ------*/}
  </div>
  
);

}

