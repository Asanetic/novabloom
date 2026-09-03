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
import { inteprateSystemusersFormAction, systemusersProfileData , popDeleteDialog, InteprateSystemusersEvent } from '../dataControl/SystemusersRequestHandler';

//state management
import { useSystemusersState } from '../dataControl/SystemusersStateManager';

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
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from system-users-utils.jsx
import {
  userRoles
} from '../logicControl/system-users-utils';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_SYSTEM_USERS";

//live data detial / profile component

export default function SystemusersProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SystemusersMainProfilePage",
    parentProfileItemId = "SystemusersProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Systemusers states
  const [stateItem, stateItemSetters] = useSystemusersState(settersOverrides);
  const system_usersNode = stateItem.systemusersNode
  
  // -- basic states --//
  const paramSystemusersUptoken  = stateItem.systemusersUptoken
  const systemusersActionStatus = stateItem.systemusersActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSystemusersNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSystemusersFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSystemusersFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSystemusersFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("SystemusersProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    systemusersProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SystemusersProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSystemusersFormData} encType="multipart/form-data" id="system_users_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {system_usersNode?.primkey ? (  <span>{`System User / ${system_usersNode?.name}`}</span> ) :(<span> New System User</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSystemusersUptoken && (
                  <DeleteButton
                  src="SystemusersMainProfilePage"
                  tableName="system_users"
                  uptoken={paramSystemusersUptoken}
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
              
              
              
              {paramSystemusersUptoken && (
                <>
                
                <MosyActionButton
                label=" View roles"
                icon="shield"
                onClick={()=>{userRoles(system_usersNode?.user_role)}}
                />
                
              </>
            )}
            
            {paramSystemusersUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="SystemusersMainProfilePage"
              tableName="system_users"
              uptoken={paramSystemusersUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="SystemusersMainProfilePage"
              tableName="system_users"
              link="./profile"
              label="New System User"
              icon="user-plus" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        <div className="col-md-6 mr-lg-5">
          
          <div className="col-md-12 p-0 text-center mb-3">
            <div className="col-md-12 m-2"><b>User Pic</b></div>
            <MosyImageViewer
            media={`/api/mediaroom?media=${btoa((system_usersNode?.user_pic || ""))}`}
            mediaRoot={""}
            defaultLogo={logo.src}
            imageClass="product_image"
            />
            
            <MosyFileUploadButton
            tblName="system_users"
            attribute="user_pic"
            />
            <input type="hidden" name="media_system_users_user_pic" value={system_usersNode?.user_pic || ""}/>
          </div>
          
          
        </div>
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">User Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="system_users"
                field="name"
                label="Name"
                value={system_usersNode?.name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="system_users"
                field="email"
                label="Email"
                value={system_usersNode?.email || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="system_users"
                field="tel"
                label="Phone"
                value={system_usersNode?.tel || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >User Gender</label>
                  
                  <select name="user_gender" id="user_gender" className="form-control">
                    <option  value={system_usersNode?.user_gender || ""}>{system_usersNode?.user_gender || "Select User Gender"}</option>
                    <option>Male</option>
                    <option>Female</option>
                    
                  </select>
                </div>
                
                
                <MosySmartField
                module="system_users"
                field="login_password"
                label="Login Password"
                value={system_usersNode?.login_password || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="password"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="system_users"
                field="regdate"
                label="Registration Date"
                value={system_usersNode?.regdate || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="date"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.systemroles.base}
                tblName="system_role_bundles"
                parentTable="system_users"
                inputName="_system_role_bundles_bundle_name_user_role"
                hiddenInputName="user_role"
                valueField="record_id"
                displayField="bundle_name"
                label="User Role"
                defaultValue={{ record_id: system_usersNode?.user_role || "", bundle_name: system_usersNode?._system_role_bundles_bundle_name_user_role || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                {system_usersNode?.primkey && (
                  <div className="form-group col-md-4 hive_data_cell  ">
                    <label >Permissions</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_permissions" name="div_permissions" placeholder="Permissions">{system_usersNode?.permissions || ""}</div>
                  </div>)}
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
                  src="SystemusersMainProfilePage"
                  tblName="system_users"
                  extraClass="optional-custom-class"
                  
                  />
                </div>
              </div></div>
              {/*    Input cells section isle      */}
            </div>
            
            <section className="hive_control">
              <input type="hidden" id="system_users_dataNode" name="system_users_dataNode" value={paramSystemusersUptoken}/>
              <input type="hidden" id="system_users_mosy_action" name="system_users_mosy_action" value={systemusersActionStatus}/>
            </section>
            
            
          </div>
          
        </form>
        
        
        <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
          {/*<hive_mini_list/>*/}
          
          
          
          <style jsx global>{`
          .data_list_section {
            display: none;
          }
          .bottom_tbl_handler{
            padding-bottom:70px!important;
          }
          `}
        </style>
        {system_usersNode?.primkey && (
          <section className="col-md-12 m-0  pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Permissions`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`../bundlefunctions/list?system_users_mosyfilter=${btoa(`{bundleId:btoa(system_usersNode?.user_role)}  `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <UserrolefunctionsList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              showDataControlSections:false,
              customQueryStr : {bundleId:btoa(system_usersNode?.user_role)}  ,
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

