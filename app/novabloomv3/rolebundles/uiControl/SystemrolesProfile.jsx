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
import { inteprateSystemrolesFormAction, systemrolesProfileData , popDeleteDialog, InteprateSystemrolesEvent } from '../dataControl/SystemrolesRequestHandler';

//state management
import { useSystemrolesState } from '../dataControl/SystemrolesStateManager';

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

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

import {InteprateUserrolefunctionsEvent} from '../../bundlefunctions/dataControl/UserrolefunctionsRequestHandler';
import UserrolefunctionsList from '../../bundlefunctions/uiControl/UserrolefunctionsList';
import UserrolefunctionsProfile from '../../bundlefunctions/uiControl/UserrolefunctionsProfile';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_SYSTEM_ROLE_BUNDLES";

//live data detial / profile component

export default function SystemrolesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SystemrolesMainProfilePage",
    parentProfileItemId = "SystemrolesProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Systemroles states
  const [stateItem, stateItemSetters] = useSystemrolesState(settersOverrides);
  const system_role_bundlesNode = stateItem.systemrolesNode
  
  // -- basic states --//
  const paramSystemrolesUptoken  = stateItem.systemrolesUptoken
  const systemrolesActionStatus = stateItem.systemrolesActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSystemrolesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSystemrolesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSystemrolesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSystemrolesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("SystemrolesProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    systemrolesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setUserrolefunctionsCustomProfileQuery Script
  const setUserrolefunctionsCustomProfileQuery = stateItemSetters.setUserrolefunctionsCustomProfileQuery;
  const userrolefunctionsCustomProfileQuery =  stateItem.userrolefunctionsCustomProfileQuery;
  
  useEffect(() => {
    if (system_role_bundlesNode?.primkey && setUserrolefunctionsCustomProfileQuery) {
      
      const query = {bundleId:btoa(system_role_bundlesNode?.record_id)};
      
      const tokenUrl = mosyUrlParam("user_bundle_role_functions_dataNode")
      
      if(!tokenUrl)
      {
        setUserrolefunctionsCustomProfileQuery(query);
      }
      
    }
  }, [system_role_bundlesNode, setUserrolefunctionsCustomProfileQuery]);
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SystemrolesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSystemrolesFormData} encType="multipart/form-data" id="system_role_bundles_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {system_role_bundlesNode?.primkey ? (  <span>{`Role / ${system_role_bundlesNode?.bundle_name}`}</span> ) :(<span> New Role</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSystemrolesUptoken && (
                  <DeleteButton
                  src="SystemrolesMainProfilePage"
                  tableName="system_role_bundles"
                  uptoken={paramSystemrolesUptoken}
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
              
              
              
              {paramSystemrolesUptoken && (
                <>
                
              </>
            )}
            
            {paramSystemrolesUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="SystemrolesMainProfilePage"
              tableName="system_role_bundles"
              uptoken={paramSystemrolesUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="SystemrolesMainProfilePage"
              tableName="system_role_bundles"
              link="./profile"
              label="New Role"
              icon="plus-circle" />
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
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Role Detail</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="system_role_bundles"
                field="bundle_name"
                label="Role Name"
                value={system_role_bundlesNode?.bundle_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-8"}}
                />
                
                
                {system_role_bundlesNode?.primkey && (
                  <div className="form-group col-md-4 hive_data_cell  ">
                    <label >Permissions</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_permissions" name="div_permissions" placeholder="Permissions">{system_role_bundlesNode?.permissions || ""}</div>
                  </div>)}
                  
                  <MosySmartField
                  module="system_role_bundles"
                  field="remark"
                  label="Remark"
                  value={system_role_bundlesNode?.remark || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="textarea"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
              </div>
              
              <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center"></div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                </div>
                
                <div className="col-md-12 text-center">
                  <SubmitButtons
                  src="SystemrolesMainProfilePage"
                  tblName="system_role_bundles"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="system_role_bundles_dataNode" name="system_role_bundles_dataNode" value={paramSystemrolesUptoken}/>
              <input type="hidden" id="system_role_bundles_mosy_action" name="system_role_bundles_mosy_action" value={systemrolesActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          {system_role_bundlesNode?.primkey && (
            <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage permissions`} </h5>
              <UserrolefunctionsProfile
              key={`${ userrolefunctionsCustomProfileQuery}-${localEventSignature}`}
              dataIn={{
                
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                customQueryStr : userrolefunctionsCustomProfileQuery,
                hostParent : "SystemrolesProfile",
                parentProfileItemId : activeScrollId,
                customProfileData : {
                  bundle_id:(system_role_bundlesNode?.record_id),
                  bundle_name:(system_role_bundlesNode?.bundle_name),
                  _system_role_bundles_bundle_name_bundle_id:(system_role_bundlesNode?.bundle_name)
                }
                
              }}
              
              dataOut={{
                
                setChildDataOut: InteprateUserrolefunctionsEvent,
                setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                
              }}
              />
              
            </section>
          )}
          
          
          <style jsx global>{`
          .data_list_section {
            display: none;
          }
          .bottom_tbl_handler{
            padding-bottom:70px!important;
          }
          `}
        </style>
        {system_role_bundlesNode?.primkey && (
          <section className="col-md-12 m-0  pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Roles permissions`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`../bundlefunctions/list?system_role_bundles_mosyfilter=${btoa(`{bundleId:btoa(system_role_bundlesNode?.record_id)}`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <UserrolefunctionsList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              showDataControlSections:false,
              customQueryStr : {bundleId:btoa(system_role_bundlesNode?.record_id)},
              customProfilePath:"../bundlefunctions/profile"
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateUserrolefunctionsEvent,
              setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
            }}
            />
          </section>
        )}
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

