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
import { intepratePaymentsFormAction, paymentsProfileData , popDeleteDialog, IntepratePaymentsEvent } from '../dataControl/PaymentsRequestHandler';

//state management
import { usePaymentsState } from '../dataControl/PaymentsStateManager';

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

import PaymentsList from './PaymentsList';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from payment-print.jsx
import {
  printSubReceipt
} from '../logicControl/payment-print';

// Imports from payment-filters.jsx
import {
  viewInvoice
} from '../logicControl/payment-filters';

// Imports from user-notify.jsx
import {
  senduserMessage
} from '../../users/logicControl/user-notify';



// export profile

//import minilist component manager
import { MosyProfileSection} from '../../UiControl/dataMapUiControl';


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_PAYMENTS";

//live data detial / profile component

export default function PaymentsProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="PaymentsMainProfilePage",
    parentProfileItemId = "PaymentsProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Payments states
  const [stateItem, stateItemSetters] = usePaymentsState(settersOverrides);
  const paymentsNode = stateItem.paymentsNode
  
  // -- basic states --//
  const paramPaymentsUptoken  = stateItem.paymentsUptoken
  const paymentsActionStatus = stateItem.paymentsActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setPaymentsNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postPaymentsFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    intepratePaymentsFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postPaymentsFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("PaymentsProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    paymentsProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="PaymentsProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-11 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postPaymentsFormData} encType="multipart/form-data" id="payments_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {paymentsNode?.primkey ? (  <span>{`Payment / ${paymentsNode?.external_reference} / ${paymentsNode?._subscriptions_subscription_name_context_id}`}</span> ) :(<span> New Payment</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramPaymentsUptoken && (
                  <DeleteButton
                  src="PaymentsMainProfilePage"
                  tableName="payments"
                  uptoken={paramPaymentsUptoken}
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
              
              
              
              {paramPaymentsUptoken && (
                <>
                
                <MosyActionButton
                label=" Send receipt"
                icon="envelope"
                onClick={()=>{printSubReceipt(paymentsNode)}}
                />
                
                <MosyActionButton
                label=" View invoice"
                icon="eye"
                onClick={()=>{viewInvoice(paymentsNode?.invoice_id)}}
                />
                
                <MosyActionButton
                label=" Send Message"
                icon="send"
                onClick={()=>{senduserMessage({userRecordId:paymentsNode?.account_id})}}
                />
                
              </>
            )}
            
            {paramPaymentsUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="PaymentsMainProfilePage"
              tableName="payments"
              uptoken={paramPaymentsUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="PaymentsMainProfilePage"
              tableName="payments"
              link="./profile"
              label="New Payment"
              icon="credit-card" />
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
                <div className="col-md-5 text-center">Payment Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="payments"
                field="paid_at"
                label="Payment Date"
                value={paymentsNode?.paid_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.platformuserlist.base}
                tblName="app_users"
                parentTable="payments"
                inputName="_app_users_full_name_account_id"
                hiddenInputName="account_id"
                valueField="record_id"
                displayField="full_name"
                label="Customer"
                defaultValue={{ record_id: paymentsNode?.account_id || "", full_name: paymentsNode?._app_users_full_name_account_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.digitalassetlist.base}
                tblName="assets"
                parentTable="payments"
                inputName="_assets_asset_name_app_id"
                hiddenInputName="app_id"
                valueField="record_id"
                displayField="asset_name"
                label="Asset / platform"
                defaultValue={{ record_id: paymentsNode?.app_id || "", asset_name: paymentsNode?._assets_asset_name_app_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.subscriptions.base}
                tblName="subscriptions"
                parentTable="payments"
                inputName="_subscriptions_subscription_name_context_id"
                hiddenInputName="context_id"
                valueField="record_id"
                displayField="subscription_name"
                label="Payment for"
                defaultValue={{ record_id: paymentsNode?.context_id || "", subscription_name: paymentsNode?._subscriptions_subscription_name_context_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="payments"
                field="amount"
                label="Amount"
                value={paymentsNode?.amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Currency</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.payments.base}
                  idField="primkey"
                  labelField="currency"
                  inputName="currency"
                  label="Currency"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={paymentsNode?.currency || ""}
                  />
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Payment Method</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.payments.base}
                  idField="primkey"
                  labelField="payment_method"
                  inputName="payment_method"
                  label="Payment Method"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={paymentsNode?.payment_method || ""}
                  />
                </div>
                
                
                <MosySmartField
                module="payments"
                field="external_reference"
                label="Reference No."
                value={paymentsNode?.external_reference || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Payment Status</label>
                  
                  <select name="payment_status" id="payment_status" className="form-control">
                    <option  value={paymentsNode?.payment_status || ""}>{paymentsNode?.payment_status || "Select Payment Status"}</option>
                    <option>pending</option>
                    <option>processing</option>
                    <option>completed</option>
                    <option>failed</option>
                    <option>cancelled</option>
                    <option>refunded</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Remark</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.invoices.base}
                tblName="invoices"
                parentTable="payments"
                inputName="_invoices_invoice_remark_invoice_id"
                hiddenInputName="invoice_id"
                valueField="record_id"
                displayField="invoice_remark"
                label="Invoice remark"
                defaultValue={{ record_id: paymentsNode?.invoice_id || "", invoice_remark: paymentsNode?._invoices_invoice_remark_invoice_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="payments"
                field="payment_context"
                label="Payment Remark"
                value={paymentsNode?.payment_context || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="textarea"
                cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                />
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center"></div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <input className="form-control" id="created_at" name="created_at" value={paymentsNode?.created_at || ""} placeholder="Created At" type="hidden"/>
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="PaymentsMainProfilePage"
                tblName="payments"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="payments_dataNode" name="payments_dataNode" value={paramPaymentsUptoken}/>
            <input type="hidden" id="payments_mosy_action" name="payments_mosy_action" value={paymentsActionStatus}/>
          </section>
          
          
        </div>
        
      </form>
      
      
      <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
        {/*<hive_mini_list/>*/}
        
        
        
        {paymentsNode?.primkey && (
          <MosyProfileSection
          title={`Subscription payment history`}
          source="payments_PaymentsList"
          component={PaymentsList}
          table="payments"
          key={`PaymentsList-${localEventSignature}`}
          dataIn={{
            parentStateSetters : stateItemSetters,
            parentUseEffectKey : localEventSignature,
            showNavigationIsle:false,
            showDataControlSections:false,
            customQueryStr : {contextId:btoa(paymentsNode?.context_id)},
            customProfilePath:"./profile"
            
          }}
          
          dataOut={{
            setChildDataOut: IntepratePaymentsEvent,
            setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
          }}
          />
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

