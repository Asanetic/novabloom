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
import { inteprateSelectsubscriptiontoinvoiceFormAction, selectsubscriptiontoinvoiceProfileData , popDeleteDialog, InteprateSelectsubscriptiontoinvoiceEvent } from '../dataControl/SelectsubscriptiontoinvoiceRequestHandler';

//state management
import { useSelectsubscriptiontoinvoiceState } from '../dataControl/SelectsubscriptiontoinvoiceStateManager';

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
import {IntepratePlatformuserlistEvent} from '../../users/dataControl/PlatformuserlistRequestHandler';
import PlatformuserlistList from '../../users/uiControl/PlatformuserlistList';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from notify-user.jsx
import {
  notifyUser
} from '../logicControl/notify-user';

// Imports from generate-sub-invoice.jsx
import {
  generateSubInvoice
} from '../logicControl/generate-sub-invoice';

// Imports from subscription-renewal.jsx
import {
  renewSubscription
} from '../logicControl/subscription-renewal';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_SUBSCRIPTIONS";

//live data detial / profile component

export default function SelectsubscriptiontoinvoiceProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./generateinvoice",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SelectsubscriptiontoinvoiceMainProfilePage",
    parentProfileItemId = "SelectsubscriptiontoinvoiceProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Selectsubscriptiontoinvoice states
  const [stateItem, stateItemSetters] = useSelectsubscriptiontoinvoiceState(settersOverrides);
  const subscriptionsNode = stateItem.selectsubscriptiontoinvoiceNode
  
  // -- basic states --//
  const paramSelectsubscriptiontoinvoiceUptoken  = stateItem.selectsubscriptiontoinvoiceUptoken
  const selectsubscriptiontoinvoiceActionStatus = stateItem.selectsubscriptiontoinvoiceActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSelectsubscriptiontoinvoiceNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSelectsubscriptiontoinvoiceFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSelectsubscriptiontoinvoiceFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSelectsubscriptiontoinvoiceFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("SelectsubscriptiontoinvoiceProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    selectsubscriptiontoinvoiceProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SelectsubscriptiontoinvoiceProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSelectsubscriptiontoinvoiceFormData} encType="multipart/form-data" id="subscriptions_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {subscriptionsNode?.primkey ? (  <span>{`Subscription / ${subscriptionsNode?._app_users_full_name_account_id} / ${subscriptionsNode?._assets_asset_name_asset_id} - ${subscriptionsNode?._asset_pricing_model_name_pricing_id}  `}</span> ) :(<span> New Subscription</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSelectsubscriptiontoinvoiceUptoken && (
                  <DeleteButton
                  src="SelectsubscriptiontoinvoiceMainProfilePage"
                  tableName="subscriptions"
                  uptoken={paramSelectsubscriptiontoinvoiceUptoken}
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
              
              
              
              {paramSelectsubscriptiontoinvoiceUptoken && (
                <>
                
                <MosyActionButton
                label=" Send Message"
                icon="send"
                onClick={()=>{notifyUser(subscriptionsNode?.account_id , subscriptionsNode?._app_users_full_name_account_id)}}
                />
                
                <MosyActionButton
                label=" Generate invoice"
                icon="file-text"
                onClick={()=>{generateSubInvoice(subscriptionsNode)}}
                />
                
                <MosyActionButton
                label=" Renew Subscription"
                icon="refresh"
                onClick={()=>{renewSubscription(subscriptionsNode?.record_id)}}
                />
                
              </>
            )}
            
            {paramSelectsubscriptiontoinvoiceUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="SelectsubscriptiontoinvoiceMainProfilePage"
              tableName="subscriptions"
              uptoken={paramSelectsubscriptiontoinvoiceUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="SelectsubscriptiontoinvoiceMainProfilePage"
              tableName="subscriptions"
              link="./profile"
              label="New Subscription"
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
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Subscription Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.platformuserlist.base}
                tblName="app_users"
                parentTable="subscriptions"
                inputName="_app_users_full_name_account_id"
                hiddenInputName="account_id"
                valueField="record_id"
                displayField="full_name"
                label="Account name"
                defaultValue={{ record_id: subscriptionsNode?.account_id || "", full_name: subscriptionsNode?._app_users_full_name_account_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.digitalassetlist.base}
                tblName="assets"
                parentTable="subscriptions"
                inputName="_assets_asset_name_asset_id"
                hiddenInputName="asset_id"
                valueField="record_id"
                displayField="asset_name"
                label="Asset"
                defaultValue={{ record_id: subscriptionsNode?.asset_id || "", asset_name: subscriptionsNode?._assets_asset_name_asset_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.assetpricing.base}
                tblName="asset_pricing"
                parentTable="subscriptions"
                inputName="_asset_pricing_model_name_pricing_id"
                hiddenInputName="pricing_id"
                valueField="record_id"
                displayField="model_name"
                label="Pricing Plan"
                defaultValue={{ record_id: subscriptionsNode?.pricing_id || "", model_name: subscriptionsNode?._asset_pricing_model_name_pricing_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) => loadPricing(dataRes,handleInputChange)}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="subscriptions"
                field="amount"
                label="Amount"
                value={subscriptionsNode?.amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={subscriptionsNode?.status || ""}>{subscriptionsNode?.status || "Select Status"}</option>
                    <option>active</option>
                    <option>paused</option>
                    <option>cancelled</option>
                    <option>expired</option>
                    <option>pending</option>
                    
                  </select>
                </div>
                
                
                {subscriptionsNode?.primkey && (
                  <div className="form-group col-md-4 hive_data_cell  ">
                    <label >Total Payments Made</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_payments" name="div_total_payments" placeholder="Total Payments Made">{subscriptionsNode?.total_payments || ""}</div>
                  </div>)}
                  
                  <MosySmartField
                  module="subscriptions"
                  field="subscription_name"
                  label="Subscription Name"
                  value={subscriptionsNode?.subscription_name || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="title"
                  cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                  />
                  
                </div>
                
              </div>
              
              <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                  <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                  <div className="col-md-5 text-center">Billing Schedule</div>
                  <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                </h5>
                
                <div className="col-md-12 pt-3 p-0" id=""></div>
                
                <div className="row justify-content-start col-md-12 p-0 m-0 ">
                  
                  <div className="form-group col-md-3">
                    <label className="d-none">Currency</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.selectsubscriptiontoinvoice.base}
                    idField="primkey"
                    labelField="currency"
                    inputName="currency"
                    label="Currency"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={subscriptionsNode?.currency || ""}
                    />
                  </div>
                  
                  
                  <MosySmartField
                  module="subscriptions"
                  field="next_billing_date"
                  label="Next Billing Date"
                  value={subscriptionsNode?.next_billing_date || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="date"
                  cellOverrides={{additionalClass: "col-md-3"}}
                  />
                  
                  
                  <div className="form-group col-md-3">
                    <label className="d-none">Billing Cycle</label>
                    
                    <SmartDropdown
                    apiEndpoint={apiRoutes.selectsubscriptiontoinvoice.base}
                    idField="primkey"
                    labelField="billing_cycle"
                    inputName="billing_cycle"
                    label="Billing Cycle"
                    onSelect={(val) => console.log('Selected:', val)}
                    defaultValue={subscriptionsNode?.billing_cycle || ""}
                    />
                  </div>
                  
                  
                  {subscriptionsNode?.primkey && (
                    <div className="form-group col-md-3 ">
                      <label >Days Until Billing</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_days_to_next_billing" name="div_days_to_next_billing" placeholder="Days Until Billing">{subscriptionsNode?.days_to_next_billing || ""}</div>
                    </div>)}
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="SelectsubscriptiontoinvoiceMainProfilePage"
                    tblName="subscriptions"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="subscriptions_dataNode" name="subscriptions_dataNode" value={paramSelectsubscriptiontoinvoiceUptoken}/>
                <input type="hidden" id="subscriptions_mosy_action" name="subscriptions_mosy_action" value={selectsubscriptiontoinvoiceActionStatus}/>
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
          {subscriptionsNode?.primkey && (
            <section className="col-md-12 m-0  pt-5 p-0 ">
              <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Payment History`} </h5>
              
              <div className="col-md-12 p-2 text-right ">
                <a href={`../payments/list?subscriptions_mosyfilter=${btoa(`context_id='${subscriptionsNode?.record_id}'`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
              </div>
              
              <PaymentsList
              key={`${customQueryStr}-${localEventSignature}`}
              dataIn={{
                parentStateSetters : stateItemSetters,
                parentUseEffectKey : localEventSignature,
                showNavigationIsle:false,
                showDataControlSections:false,
                customQueryStr : context_id='${subscriptionsNode?.record_id}',
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
        {subscriptionsNode?.primkey && (
          <section className="col-md-12 m-0  pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`User profile`} </h5>
            
            <div className="col-md-12 p-2 text-right ">
              <a href={`../users/list?subscriptions_mosyfilter=${btoa(`record_id='${subscriptionsNode?.account_id}'`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
            </div>
            
            <PlatformuserlistList
            key={`${customQueryStr}-${localEventSignature}`}
            dataIn={{
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              showDataControlSections:false,
              customQueryStr : record_id='${subscriptionsNode?.account_id}',
              customProfilePath:"../users/profile"
              
            }}
            
            dataOut={{
              setChildDataOut: IntepratePlatformuserlistEvent,
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

