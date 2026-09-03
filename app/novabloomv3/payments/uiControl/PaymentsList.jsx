'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//print utils
import { exportTableToExcel } from '../../../MosyUtils/exportToExcel';
import { mosyPrintToPdf } from '../../../MosyUtils/hiveUtils';


//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"
import { MosySecureFilterEngine  } from "../../DataControl/MosyFilterEngine";
import { mosyBtoa, mosyUpdateUrlParam } from "../../../MosyUtils/hiveUtils";



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime, mosyTonum , mosyToggleSelectAllTblRows , mosySelectTblRows } from '../../../MosyUtils/hiveUtils';
import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadPaymentsListData, popDeleteDialog, IntepratePaymentsEvent  } from '../dataControl/PaymentsRequestHandler';

//state management
import { usePaymentsState } from '../dataControl/PaymentsStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

//custom fuctions
//import {  } from '../../AppCore/coreUtils';

// Use default base root (/)
const apiRoutes = getApiRoutes();
// ════════════════════════════════════════════════════════════════
// LIST PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from payment-filters.jsx
import {
  filterByPaymentDate,
  filterPaymentSubs,
  filterbyAsset,
  filterByUser,
  viewInvoice
} from '../logicControl/payment-filters';

// Imports from payment-details.jsx
import {
  viewSubscription
} from '../logicControl/payment-details';

// Imports from payment-print.jsx
import {
  printSubReceipt
} from '../logicControl/payment-print';

// Imports from user-notify.jsx
import {
  senduserMessage
} from '../../users/logicControl/user-notify';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_PAYMENTS";

//live data list component

export default function PaymentsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="./profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Payments states
  const [stateItem, stateItemSetters] = usePaymentsState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    const customFilter = {
      
      ...customQueryStr,
      ...MosySecureFilterEngine("payments"),
      
    }
    
    
    loadPaymentsListData(customFilter, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute amount totals
  const sumpayments_amount = stateItem.paymentsListData?.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );
  
  
  function moduleFilterManager(action = "")
  {
    
    
    if(action === "search"){
      
      //reset pagination
      mosyUpdateUrlParam(
        "qpayments_page",
        "1"
      );
      
      //set url params
      mosyFilterUrl({tableName:"payments", keyword:stateItem.paymentsQuerySearchStr, reload:false})
      
      // clear input
      document.getElementById(
        "txt_payments"
      ).value = "";
      
    }
    
    if(action === "refresh")
    {
      //empty Search String
      stateItemSetters.setPaymentsQuerySearchStr("");
      
      //reset pagination
      mosyUpdateUrlParam(
        "qpayments_page",
        "1"
      );
      
      
      //delete search param var
      deleteUrlParam("qpayments")
      deleteUrlParam("payments_mosyfilter")
      
      // clear input
      document.getElementById(
        "txt_payments"
      ).value = "";
      
      //refresh list
      loadPaymentsListData(customQueryStr, stateItemSetters);
      
    }
    
    //refresh sign
    stateItemSetters.setLocalEventSignature(Date.now())
    
  }
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"payments", keyword:stateItem.paymentsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Payments </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_payments" name="txt_payments" className="custom-search-input form-control" placeholder="Search in Payments "
          onChange={(e) => stateItemSetters.setPaymentsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qpayments_btn" name="qpayments_btn" type="button" onClick={() => moduleFilterManager("search")}><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <MosyActionButton
            src="PaymentsList"
            action="_filter_by_payment_date"
            label=" Filter by Payment Date"
            icon="calendar"
            onClick={()=>{filterByPaymentDate('../payments/list','Filter Payment dates','payments','paidAt')}}
            />
            
            <MosyActionButton
            src="PaymentsList"
            action="_filter_by_subscription"
            label=" Filter by subscription"
            icon="copy"
            onClick={()=>{filterPaymentSubs({router:router, stateSetters:stateItemSetters})}}
            />
            
            <MosyActionButton
            src="PaymentsList"
            action="_filter_by_platform"
            label=" Filter by platform"
            icon="bolt"
            onClick={()=>{filterbyAsset({router:router, stateSetters:stateItemSetters})}}
            />
            
            <MosyActionButton
            src="PaymentsList"
            action="_filter_by_user"
            label=" Filter by user"
            icon="users"
            onClick={()=>{filterByUser({router:router, stateSetters:stateItemSetters})}}
            />
            
            
            
            <AddNewButton src="PaymentsList" link={customProfilePath} label="New Payment" icon="credit-card" />
            <div
            className="cpointer medium_btn border border_set btn-white hive_list_nav_refresh ml-3"
            
            onClick={() => moduleFilterManager("refresh")}
            >
            <i className="fa fa-refresh mr-1"></i> Refresh
          </div>
        </div>
      </div>
    </div> )}
    
    
    <div className="table-responsive  data-tables bottom_tbl_handler">
      
      
      <div className="text-left m-0 p-0 col-md-12">
        <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
        onClick={() => {mosyPrintToPdf({elemId : "payments_print_card", defaultTitle:"Payments"})}}
        >
        <i className="fa fa-print "></i> Print List
      </div>
      <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
      
      onClick={() => exportTableToExcel("payments_data_table", "Payments.xlsx")}
      >
      <i className="fa fa-arrow-right "></i> Export to excel
    </div>
  </div>
  <div className="col-md-12 m-0 p-0" id="payments_print_card">
    <table className="table table-hover  text-left printTarget" id="payments_data_table">
      <thead className="text-uppercase">
        <tr>
          <th scope="col">#</th>
          
          <th scope="col"><b>Customer</b></th>
          <th scope="col"><b>Payment for</b></th>
          <th scope="col"><b>Amount</b></th>
          <th scope="col"><b>Reference No.</b></th>
          <th scope="col"><b>Payment Remark</b></th>
          <th scope="col"><b>Payment Date</b></th>
          <th scope="col"><b>Asset / platform</b></th>
          <th scope="col"><b>Invoice remark</b></th>
          
        </tr>
        
      </thead>
      <tbody>
        {stateItem.paymentsLoading ? (
          <tr>
            <th scope="col">#</th>
            <td colSpan="9" className="text-muted">
              <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Payments ...</h5>
            </td>
          </tr>
        ) : stateItem.paymentsListData?.length > 0 ? (
          stateItem.paymentsListData.map((listpayments_result, index) => {
            
            
            
            return(
              <Fragment key={`_row_${listpayments_result.primkey}`}>
                <tr key={listpayments_result.primkey}>
                  <td>
                    <div className="table_cell_dropdown">
                      <div className="table_cell_dropbtn">
                        
                        <b>{listpayments_result.row_count}</b></div>
                        <div className="table_cell_dropdown-content">
                          <MosySmartDropdownActions
                          tblName="payments"
                          setters={{
                            
                            childStateSetters: stateItemSetters,
                            parentStateSetters: parentStateSetters
                            
                          }}
                          
                          attributes={`${listpayments_result.primkey}:${customProfilePath}:false`}
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          
                          />
                          
                          <MosyGridRowOptions
                          src="PaymentsList"
                          action="_view_subscription"
                          label=" View Subscription"
                          icon="copy"
                          dataIn={() => viewSubscription(listpayments_result?.context_id)}   // only runs on click now
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          />
                          <MosyGridRowOptions
                          src="PaymentsList"
                          action="_send_receipt"
                          label=" Send receipt"
                          icon="envelope"
                          dataIn={() => printSubReceipt(listpayments_result)}   // only runs on click now
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          />
                          <MosyGridRowOptions
                          src="PaymentsList"
                          action="_send_message"
                          label=" Send Message"
                          icon="send"
                          dataIn={() => senduserMessage({userRecordId:listpayments_result.account_id})}   // only runs on click now
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          />
                          <MosyGridRowOptions
                          src="PaymentsList"
                          action="_view_invoice"
                          label=" View invoice"
                          icon="eye"
                          dataIn={() => viewInvoice(listpayments_result.invoice_id)}   // only runs on click now
                          callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                          />
                        </div>
                      </div>
                    </td>
                    
                    <td scope="col"><span title={listpayments_result.account_id}>{magicTrimText(listpayments_result._app_users_full_name_account_id, 70)}</span></td>
                    <td scope="col"><span title={listpayments_result.context_id}>{magicTrimText(listpayments_result._subscriptions_subscription_name_context_id, 70)}</span></td>
                    <td scope="col"><span>{mosyTonum(listpayments_result.amount)}</span></td>
                    <td scope="col"><span title={listpayments_result.external_reference}>{magicTrimText(listpayments_result.external_reference, 70)}</span></td>
                    <td scope="col"><span>
                      <ReactMarkdown>
                        
                        {magicTrimText(listpayments_result.payment_context, 70)}
                        
                      </ReactMarkdown>
                    </span></td>
                    <td scope="col"><span title={listpayments_result.paid_at}>{mosyFormatDateTime(listpayments_result.paid_at)}</span></td>
                    <td scope="col"><span title={listpayments_result.app_id}>{magicTrimText(listpayments_result._assets_asset_name_app_id, 70)}</span></td>
                    <td scope="col"><span title={listpayments_result.invoice_id}>{magicTrimText(listpayments_result._invoices_invoice_remark_invoice_id, 70)}</span></td>
                    
                  </tr>
                  
                  
                </Fragment>)
                
              })
              
            ) : (
              
              <tr><td colSpan="9" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no payments records found</h6>
                  
                  <AddNewButton src="PaymentsList"  link={customProfilePath} label="New Payment" icon="credit-card" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
            
            <tr className="bg-light">
              <th></th>
              
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b><span>{mosyTonum(sumpayments_amount)}</span></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              
            </tr>
          </tbody>
          
        </table>
      </div>
      <MosyPaginationUi
      src="PaymentsList"
      tblName="payments"
      totalPages={stateItem.paymentsListPageCount}
      stateItemSetters={stateItemSetters}
      />
    </div>
    
    
  </form>
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
  </div>
);

}

