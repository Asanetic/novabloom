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
import { inteprateOrdersFormAction, ordersProfileData , popDeleteDialog, InteprateOrdersEvent } from '../dataControl/OrdersRequestHandler';

//state management
import { useOrdersState } from '../dataControl/OrdersStateManager';

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

import {InteprateOrderItemsEvent} from '../../order_items/dataControl/OrderItemsRequestHandler';
import OrderItemsList from '../../order_items/uiControl/OrderItemsList';
import {IntepratePaymentsEvent} from '../../payments/dataControl/PaymentsRequestHandler';
import PaymentsList from '../../payments/uiControl/PaymentsList';
import {InteprateEntitlementsEvent} from '../../entitlements/dataControl/EntitlementsRequestHandler';
import EntitlementsList from '../../entitlements/uiControl/EntitlementsList';
import AppUsersProfile from '../../app_users/uiControl/AppUsersProfile';
import {InteprateAppUsersEvent} from '../../app_users/dataControl/AppUsersRequestHandler';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from manage-orders.jsx
import {
  completeOrder,
  cancelOrder
} from '../logicControl/manage-orders';

// Imports from order-payments.jsx
import {
  addPayment
} from '../logicControl/order-payments';

// Imports from order-items.jsx
import {
  addOrderItem
} from '../logicControl/order-items';

// Imports from order-fulfillment.jsx
import {
  generateEntitlements
} from '../logicControl/order-fulfillment';

// Imports from order-refunds.jsx
import {
  refundOrder
} from '../logicControl/order-refunds';

// Imports from order-notifications.jsx
import {
  sendOrderConfirmation
} from '../logicControl/order-notifications';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_ORDERS";

//live data detial / profile component

export default function OrdersProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="OrdersMainProfilePage",
    parentProfileItemId = "OrdersProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Orders states
  const [stateItem, stateItemSetters] = useOrdersState(settersOverrides);
  const ordersNode = stateItem.ordersNode
  
  // -- basic states --//
  const paramOrdersUptoken  = stateItem.ordersUptoken
  const ordersActionStatus = stateItem.ordersActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setOrdersNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postOrdersFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateOrdersFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postOrdersFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("OrdersProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    ordersProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setAppUsersCustomProfileQuery Script
  const setAppUsersCustomProfileQuery = stateItemSetters.setAppUsersCustomProfileQuery;
  const appUsersCustomProfileQuery =  stateItem.appUsersCustomProfileQuery;
  
  useEffect(() => {
    if (ordersNode?.primkey && setAppUsersCustomProfileQuery) {
      
      const query = record_id='{ordersNode?.account_id}';
      
      const tokenUrl = mosyUrlParam("app_users_dataNode")
      
      if(!tokenUrl)
      {
        setAppUsersCustomProfileQuery(query);
      }
      
    }
  }, [ordersNode, setAppUsersCustomProfileQuery]);
  
  
  //access control managemant
  const denied = MosyAccessControl(MOSY_ACCESS_KEY);
  if (denied) return denied;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="OrdersProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postOrdersFormData} encType="multipart/form-data" id="orders_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {ordersNode?.primkey ? (  <span>{`Order / ${ordersNode?.record_id}`}</span> ) :(<span> New Order</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramOrdersUptoken && (
                  <DeleteButton
                  src="OrdersMainProfilePage"
                  tableName="orders"
                  uptoken={paramOrdersUptoken}
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
              
              
              
              {paramOrdersUptoken && (
                <>
                
                <MosyActionButton
                label=" Mark as Completed"
                icon="check-circle"
                onClick={()=>{completeOrder()}}
                />
                
                <MosyActionButton
                label=" Cancel Order"
                icon="x-circle"
                onClick={()=>{cancelOrder()}}
                />
                
                <MosyActionButton
                label=" Add Payment"
                icon="credit-card"
                onClick={()=>{addPayment()}}
                />
                
                <MosyActionButton
                label=" Add Order Item"
                icon="package"
                onClick={()=>{addOrderItem()}}
                />
                
                <MosyActionButton
                label=" Generate Entitlements"
                icon="key"
                onClick={()=>{generateEntitlements()}}
                />
                
                <MosyActionButton
                label=" Refund Order"
                icon="rotate-cw"
                onClick={()=>{refundOrder()}}
                />
                
                <MosyActionButton
                label=" Send Order Confirmation"
                icon="send"
                onClick={()=>{sendOrderConfirmation()}}
                />
                
              </>
            )}
            
            {paramOrdersUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="OrdersMainProfilePage"
              tableName="orders"
              uptoken={paramOrdersUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="OrdersMainProfilePage"
              tableName="orders"
              link="./profile"
              label="New Order"
              icon="shopping-cart" />
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
                <div className="col-md-5 text-center">Order Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.platformuserlist.base}
                tblName="app_users"
                parentTable="orders"
                inputName="_app_users_full_name_account_id"
                hiddenInputName="account_id"
                valueField="record_id"
                displayField="full_name"
                label="Customer"
                defaultValue={{ record_id: ordersNode?.account_id || "", full_name: ordersNode?._app_users_full_name_account_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-6 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <div className="form-group col-md-6 hive_data_cell ">
                  <label >Order Status</label>
                  
                  <select name="order_status" id="order_status" className="form-control">
                    <option  value={ordersNode?.order_status || ""}>{ordersNode?.order_status || "Select Order Status"}</option>
                    <option>pending</option>
                    <option>processing</option>
                    <option>completed</option>
                    <option>cancelled</option>
                    <option>refunded</option>
                    <option>failed</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Financial Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="orders"
                field="total_amount"
                label="Total Amount"
                value={ordersNode?.total_amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-6 hive_data_cell ">
                  <label className="d-none">Currency</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.orders.base}
                  idField="primkey"
                  labelField="currency"
                  inputName="currency"
                  label="Currency"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={ordersNode?.currency || ""}
                  />
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">System Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="orders"
                field="created_at"
                label="Order Date"
                value={ordersNode?.created_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
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
                
                <MosySmartField
                module="orders"
                field="customer_name"
                label="Customer Name"
                value={ordersNode?.customer_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="orders"
                field="total_items"
                label="Total Items"
                value={ordersNode?.total_items || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="orders"
                field="total_paid"
                label="Amount Paid"
                value={ordersNode?.total_paid || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="orders"
                field="balance_due"
                label="Balance Due"
                value={ordersNode?.balance_due || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="orders"
                field="payment_status"
                label="Payment Status"
                value={ordersNode?.payment_status || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="OrdersMainProfilePage"
                tblName="orders"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="orders_dataNode" name="orders_dataNode" value={paramOrdersUptoken}/>
            <input type="hidden" id="orders_mosy_action" name="orders_mosy_action" value={ordersActionStatus}/>
          </section>
          
          
        </div>
        
      </form>
      
      
      <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
        {/*<hive_mini_list/>*/}
        
        {ordersNode?.primkey && (
          <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
            <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Customer Profile`} </h5>
            <AppUsersProfile
            key={`${ appUsersCustomProfileQuery}-${localEventSignature}`}
            dataIn={{
              
              parentStateSetters : stateItemSetters,
              parentUseEffectKey : localEventSignature,
              showNavigationIsle:false,
              customQueryStr : appUsersCustomProfileQuery,
              hostParent : "OrdersProfile",
              parentProfileItemId : activeScrollId,
              customProfileData : {}
              
            }}
            
            dataOut={{
              
              setChildDataOut: InteprateAppUsersEvent,
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
      {ordersNode?.primkey && (
        <section className="col-md-12 m-0  pt-5 p-0 ">
          <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Generated Entitlements`} </h5>
          
          <div className="col-md-12 p-2 text-right ">
            <a href={`../entitlements/list?orders_mosyfilter=${btoa(`order_id='${ordersNode?.record_id}'`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
          </div>
          
          <EntitlementsList
          key={`${customQueryStr}-${localEventSignature}`}
          dataIn={{
            parentStateSetters : stateItemSetters,
            parentUseEffectKey : localEventSignature,
            showNavigationIsle:false,
            showDataControlSections:false,
            customQueryStr : order_id='${ordersNode?.record_id}',
            customProfilePath:"../entitlements/profile"
            
          }}
          
          dataOut={{
            setChildDataOut: InteprateEntitlementsEvent,
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
    {ordersNode?.primkey && (
      <section className="col-md-12 m-0  pt-5 p-0 ">
        <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Payment Records`} </h5>
        
        <div className="col-md-12 p-2 text-right ">
          <a href={`../payments/list?orders_mosyfilter=${btoa(`context_id='${ordersNode?.record_id}' and payment_context='order'`)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
        </div>
        
        <PaymentsList
        key={`${customQueryStr}-${localEventSignature}`}
        dataIn={{
          parentStateSetters : stateItemSetters,
          parentUseEffectKey : localEventSignature,
          showNavigationIsle:false,
          showDataControlSections:false,
          customQueryStr :" context_id='${ordersNode?.record_id}' and payment_context='order'",
          customProfilePath:"../payments/profile"
          
        }}
        
        dataOut={{
          setChildDataOut: IntepratePaymentsEvent,
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

