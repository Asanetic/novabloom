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
import { inteprateInvoicesFormAction, invoicesProfileData , popDeleteDialog, InteprateInvoicesEvent } from '../dataControl/InvoicesRequestHandler';

//state management
import { useInvoicesState } from '../dataControl/InvoicesStateManager';

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
import {
  loadSubscriptionData
} from '../logicControl/invoice-payments';

// Use default base root (/)
const apiRoutes = getApiRoutes();


// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from invoice-payments.jsx
import {
  addInvoicePayments
} from '../logicControl/invoice-payments';

// Imports from invoices-utils.jsx
import {
  viewInvoicePayments,
  sendInvoice
} from '../logicControl/invoices-utils';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_INVOICES";

//live data detial / profile component

export default function InvoicesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="InvoicesMainProfilePage",
    parentProfileItemId = "InvoicesProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Invoices states
  const [stateItem, stateItemSetters] = useInvoicesState(settersOverrides);
  const invoicesNode = stateItem.invoicesNode
  
  // -- basic states --//
  const paramInvoicesUptoken  = stateItem.invoicesUptoken
  const invoicesActionStatus = stateItem.invoicesActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setInvoicesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postInvoicesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateInvoicesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postInvoicesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("InvoicesProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    invoicesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="InvoicesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postInvoicesFormData} encType="multipart/form-data" id="invoices_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {invoicesNode?.primkey ? (  <span>{`Invoice / ${invoicesNode?.invoice_number}`}</span> ) :(<span> Create Invoice</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramInvoicesUptoken && (
                  <DeleteButton
                  src="InvoicesMainProfilePage"
                  tableName="invoices"
                  uptoken={paramInvoicesUptoken}
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
              
              
              
              {paramInvoicesUptoken && (
                <>
                
                <MosyActionButton
                label=" Add Payment"
                icon="credit-card"
                onClick={()=>{addInvoicePayments(invoicesNode?.record_id)}}
                />
                
                <MosyActionButton
                label=" View Invoice payments"
                icon="refresh"
                onClick={()=>{viewInvoicePayments(invoicesNode?.record_id)}}
                />
                
                <MosyActionButton
                label=" Send invoice"
                icon="send"
                onClick={()=>{sendInvoice(invoicesNode)}}
                />
                
              </>
            )}
            
            {paramInvoicesUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="InvoicesMainProfilePage"
              tableName="invoices"
              uptoken={paramInvoicesUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="InvoicesMainProfilePage"
              tableName="invoices"
              link="./profile"
              label="Create Invoice"
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
                <div className="col-md-5 text-center">Invoice Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.subscriptions.base}
                tblName="subscriptions"
                parentTable="invoices"
                inputName="_subscriptions_subscription_name_subscription_id"
                hiddenInputName="subscription_id"
                valueField="record_id"
                displayField="subscription_name"
                label="Subscription"
                defaultValue={{ record_id: invoicesNode?.subscription_id || "", subscription_name: invoicesNode?._subscriptions_subscription_name_subscription_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) => loadSubscriptionData(dataRes,handleInputChange)}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4"
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.platformuserlist.base}
                tblName="app_users"
                parentTable="invoices"
                inputName="_app_users_full_name_account_id"
                hiddenInputName="account_id"
                valueField="record_id"
                displayField="full_name"
                label="Account name"
                defaultValue={{ record_id: invoicesNode?.account_id || "", full_name: invoicesNode?._app_users_full_name_account_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4"
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="invoices"
                field="invoice_number"
                label="Invoice #"
                value={invoicesNode?.invoice_number || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4"}}
                />
                
                
                <div className="form-group col-md-4">
                  <label className="d-none">Currency</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.invoices.base}
                  idField="primkey"
                  labelField="currency"
                  inputName="currency"
                  label="Currency"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={invoicesNode?.currency || ""}
                  />
                </div>
                
                
                <MosySmartField
                module="invoices"
                field="issue_date"
                label="Issue Date"
                value={invoicesNode?.issue_date || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="date"
                cellOverrides={{additionalClass: "col-md-4"}}
                />
                
                
                <MosySmartField
                module="invoices"
                field="due_date"
                label="Due Date"
                value={invoicesNode?.due_date || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="date"
                cellOverrides={{additionalClass: "col-md-4"}}
                />
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Subscription Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="invoices"
                field="invoice_remark"
                label="Payment description"
                value={invoicesNode?.invoice_remark || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4"}}
                />
                
                
                <MosySmartField
                module="invoices"
                field="total_amount"
                label="Total amount"
                value={invoicesNode?.total_amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4"}}
                />
                
                
                {invoicesNode?.primkey && (
                  <div className="form-group col-md-4 ">
                    <label >Total paid</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_payments_total" name="div_payments_total" placeholder="Total paid">{invoicesNode?.payments_total || ""}</div>
                  </div>)}
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
                  
                  {invoicesNode?.primkey && (
                    <div className="form-group col-md-6 hive_data_cell  ">
                      <label >Invoice Balance</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_invoice_balance" name="div_invoice_balance" placeholder="Invoice Balance">{invoicesNode?.invoice_balance || ""}</div>
                    </div>)}
                    
                    <input className="form-control" id="client_id" name="client_id" value={invoicesNode?.client_id || ""} placeholder="Client Id" type="hidden"/>
                    
                    
                    <input className="form-control" id="order_id" name="order_id" value={invoicesNode?.order_id || ""} placeholder="Order Id" type="hidden"/>
                    
                    
                    <input className="form-control" id="asset_id" name="asset_id" value={invoicesNode?.asset_id || ""} placeholder="Platform" type="hidden"/>
                    
                    
                    <input className="form-control" id="tax_amount" name="tax_amount" value={invoicesNode?.tax_amount || ""} placeholder="Tax Amount" type="hidden"/>
                    
                    
                    <input className="form-control" id="discount_amount" name="discount_amount" value={invoicesNode?.discount_amount || ""} placeholder="Discount" type="hidden"/>
                    
                    
                    <MosySmartField
                    module="invoices"
                    field="notes"
                    label="Notes"
                    value={invoicesNode?.notes || ""}
                    onChange={handleInputChange}
                    context={{ hostParent: hostParent  }}
                    inputOverrides={{}}
                    type="textarea"
                    cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                    />
                    
                    
                    <input className="form-control" id="created_at" name="created_at" value={invoicesNode?.created_at || ""} placeholder="Created At" type="hidden"/>
                    
                    
                    <input className="form-control" id="updated_at" name="updated_at" value={invoicesNode?.updated_at || ""} placeholder="Updated At" type="hidden"/>
                    
                  </div>
                  
                  <div className="col-md-12 text-center">
                    <SubmitButtons
                    src="InvoicesMainProfilePage"
                    tblName="invoices"
                    extraClass="optional-custom-class"
                    
                    />
                  </div>
                </div></div>
                {/*    Input cells section isle      */}
              </div>
              
              <section className="hive_control">
                <input type="hidden" id="invoices_dataNode" name="invoices_dataNode" value={paramInvoicesUptoken}/>
                <input type="hidden" id="invoices_mosy_action" name="invoices_mosy_action" value={invoicesActionStatus}/>
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
  
