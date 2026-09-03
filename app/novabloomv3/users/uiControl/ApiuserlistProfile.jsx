'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam ,mosyTonum  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateApiuserlistFormAction, apiuserlistProfileData , popDeleteDialog, InteprateApiuserlistEvent } from '../dataControl/ApiuserlistRequestHandler';

//state management
import { useApiuserlistState } from '../dataControl/ApiuserlistStateManager';

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

import {IntepratePaymentsEvent} from '../../payments/dataControl/PaymentsRequestHandler';
import PaymentsList from '../../payments/uiControl/PaymentsList';
import {InteprateSubscriptionsEvent} from '../../subscriptions/dataControl/SubscriptionsRequestHandler';
import SubscriptionsList from '../../subscriptions/uiControl/SubscriptionsList';
import {InteprateOrdersEvent} from '../../orders/dataControl/OrdersRequestHandler';
import OrdersList from '../../orders/uiControl/OrdersList';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from user-notify.jsx
import {
  senduserMessage
} from '../logicControl/user-notify';

// Imports from user-addsubscription.jsx
import {
  addUserSubscription
} from '../logicControl/user-addsubscription';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_APP_USERS";

//live data detial / profile component

export default function ApiuserlistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./apilist",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ApiuserlistMainProfilePage",
    parentProfileItemId = "ApiuserlistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Apiuserlist states
  const [stateItem, stateItemSetters] = useApiuserlistState(settersOverrides);
  const app_usersNode = stateItem.apiuserlistNode
  
  // -- basic states --//
  const paramApiuserlistUptoken  = stateItem.apiuserlistUptoken
  const apiuserlistActionStatus = stateItem.apiuserlistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setApiuserlistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postApiuserlistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateApiuserlistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postApiuserlistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("ApiuserlistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    apiuserlistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  //access control managemant
  const denied = MosyAccessControl(MOSY_ACCESS_KEY);
  if (denied) return denied;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="ApiuserlistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postApiuserlistFormData} encType="multipart/form-data" id="app_users_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {app_usersNode?.primkey ? (  <span>{`User Profile / ${app_usersNode?.full_name}`}</span> ) :(<span> New User</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramApiuserlistUptoken && (
                  <DeleteButton
                  src="ApiuserlistMainProfilePage"
                  tableName="app_users"
                  uptoken={paramApiuserlistUptoken}
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
              
              
              
              {paramApiuserlistUptoken && (
                <>
                
                <MosyActionButton
                label=" Send message"
                icon="envelope"
                onClick={()=>{senduserMessage({userRecordId:app_usersNode?.record_id, username:app_usersNode?.full_name})}}
                />
                
                <MosyActionButton
                label=" Add user subscription"
                icon="copy"
                onClick={()=>{addUserSubscription(app_usersNode)}}
                />
                
              </>
            )}
            
            {paramApiuserlistUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="ApiuserlistMainProfilePage"
              tableName="app_users"
              uptoken={paramApiuserlistUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="ApiuserlistMainProfilePage"
              tableName="app_users"
              link="./apiprofile"
              label="New User"
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
            <div className="col-md-12 m-2"><b>Profile Photo</b></div>
            <MosyImageViewer
            media={`/api/mediaroom?media=${btoa((app_usersNode?.profile_photo || ""))}`}
            mediaRoot={""}
            defaultLogo={logo.src}
            imageClass="product_image"
            />
            
            <MosyFileUploadButton
            tblName="app_users"
            attribute="profile_photo"
            />
            <input type="hidden" name="media_app_users_profile_photo" value={app_usersNode?.profile_photo || ""}/>
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
                <div className="col-md-5 text-center">Personal Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="app_users"
                field="full_name"
                label="Full Name"
                value={app_usersNode?.full_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="app_users"
                field="email"
                label="Email Address"
                value={app_usersNode?.email || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="app_users"
                field="phone_number"
                label="Phone Number"
                value={app_usersNode?.phone_number || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Country</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.apiuserlist.base}
                  idField="primkey"
                  labelField="country"
                  inputName="country"
                  label="Country"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={app_usersNode?.country || ""}
                  />
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Currency</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.apiuserlist.base}
                  idField="primkey"
                  labelField="currency"
                  inputName="currency"
                  label="Currency"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={app_usersNode?.currency || ""}
                  />
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Account Settings</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="app_users"
                field="password_hash"
                label="Password "
                value={app_usersNode?.password_hash || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="password"
                cellOverrides={{additionalClass: "col-md-3"}}
                />
                
                
                <div className="form-group col-md-3">
                  <label >Account Status</label>
                  
                  <select name="account_status" id="account_status" className="form-control">
                    <option  value={app_usersNode?.account_status || ""}>{app_usersNode?.account_status || "Select Account Status"}</option>
                    <option>active</option>
                    <option>suspended</option>
                    <option>pending</option>
                    <option>closed</option>
                    
                  </select>
                </div>
                
                
                <div className="form-group col-md-3">
                  <label >Email Verified</label>
                  
                  <select name="email_verified" id="email_verified" className="form-control">
                    <option  value={app_usersNode?.email_verified || ""}>{app_usersNode?.email_verified || "Select Email Verified"}</option>
                    <option>yes</option>
                    <option>no</option>
                    
                  </select>
                </div>
                
                
                <div className="form-group col-md-3">
                  <label >Phone Verified</label>
                  
                  <select name="phone_verified" id="phone_verified" className="form-control">
                    <option  value={app_usersNode?.phone_verified || ""}>{app_usersNode?.phone_verified || "Select Phone Verified"}</option>
                    <option>yes</option>
                    <option>no</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">System Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="app_users"
                field="created_at"
                label="Registration date"
                value={app_usersNode?.created_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-3"}}
                />
                
                
                {app_usersNode?.primkey && (
                  <div className="form-group col-md-3 ">
                    <label >Total Payments</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_payments" name="div_total_payments" placeholder="Total Payments">{app_usersNode?.total_payments || ""}</div>
                  </div>)}
                  
                  {app_usersNode?.primkey && (
                    <div className="form-group col-md-3 ">
                      <label >Total Subscriptions</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_subscriptions" name="div_total_subscriptions" placeholder="Total Subscriptions">{app_usersNode?.total_subscriptions || ""}</div>
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
                    
                    <input className="form-control" id="updated_at" name="updated_at" value={app_usersNode?.updated_at || ""} placeholder="Last Updated" type="hidden"/>
                    
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="ApiuserlistMainProfilePage"
                    tblName="app_users"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="app_users_dataNode" name="app_users_dataNode" value={paramApiuserlistUptoken}/>
                <input type="hidden" id="app_users_mosy_action" name="app_users_mosy_action" value={apiuserlistActionStatus}/>
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
          {app_usersNode?.primkey && (
            <section className="col-md-12 m-0  pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Payment History`} </h5>
              
              <div className="col-md-12 p-2 text-right ">
                <a href={`../payments/list?app_users_mosyfilter=${btoa(` account_id='${app_usersNode?.record_id}'  `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
              </div>
              
              <PaymentsList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                showDataControlSections:false,
                customQueryStr :  account_id='${app_usersNode?.record_id}'  ,
                customProfilePath:"../payments/profile"
                
              }}
              
              dataOut={{
                setChildDataOut: IntepratePaymentsEvent,
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
        {app_usersNode?.primkey && (
          <section className="col-md-12 m-0  pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`User Subscriptions`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`../subscriptions/list?app_users_mosyfilter=${btoa(` account_id= '${app_usersNode?.record_id}' `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <SubscriptionsList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              showDataControlSections:false,
              customQueryStr :  account_id= '${app_usersNode?.record_id}' ,
              customProfilePath:"../subscriptions/profile"
              
            }}
            
            dataOut={{
              setChildDataOut: InteprateSubscriptionsEvent,
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
      {app_usersNode?.primkey && (
        <section className="col-md-12 m-0  pt-5 p-0 ">
          <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Order History`} </h5>
          
          <div className="col-md-12 p-2 text-right ">
            <a href={`../orders/list?app_users_mosyfilter=${btoa(`  account_id= '${app_usersNode?.record_id}' `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
          </div>
          
          <OrdersList
          key={`${customQueryStr}-${localEventSignature}`}
          dataIn={{
            parentStateSetters : stateItemSetters,
            parentUseEffectKey : localEventSignature,
            showNavigationIsle:false,
            showDataControlSections:false,
            customQueryStr :   account_id= '${app_usersNode?.record_id}' ,
            customProfilePath:"../orders/profile"
            
          }}
          
          dataOut={{
            setChildDataOut: InteprateOrdersEvent,
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

