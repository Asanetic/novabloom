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
import { loadSubscriptionsListData, popDeleteDialog, InteprateSubscriptionsEvent  } from '../dataControl/SubscriptionsRequestHandler';

//state management
import { useSubscriptionsState } from '../dataControl/SubscriptionsStateManager';

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
// Imports from subscription-filters.jsx
import {
  filterByBillingDate,
  filterByStats,
  filterByUser,
  filterByAsset
} from '../logicControl/subscription-filters';

// Imports from subscription-details.jsx
import {
  viewSubscriptionPayments,
  viewSubscriptionInvoices
} from '../logicControl/subscription-details';

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



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_SUBSCRIPTIONS";

//live data list component

export default function SubscriptionsList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../subscriptions/profile",
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
  
  //manage Subscriptions states
  const [stateItem, stateItemSetters] = useSubscriptionsState(settersOverrides);
  
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
    
    loadSubscriptionsListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute amount totals
  const sumsubscriptions_amount = stateItem.subscriptionsListData?.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );
  
  // Compute total_payments totals
  const sumsubscriptions_total_payments = stateItem.subscriptionsListData?.reduce(
    (sum, row) => sum + Number(row.total_payments || 0),
    0
  );
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"subscriptions", keyword:stateItem.subscriptionsQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Subscriptions </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_subscriptions" name="txt_subscriptions" className="custom-search-input form-control" placeholder="Search in Subscriptions "
          onChange={(e) => stateItemSetters.setSubscriptionsQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qsubscriptions_btn" name="qsubscriptions_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <MosyActionButton
            src="SubscriptionsList"
            action="_filter_by_expiry_date"
            label=" Filter by expiry Date"
            icon="calendar"
            onClick={()=>{filterByBillingDate('../subscriptions/list','Expiry date','subscriptions','nextBillingDate')}}
            />
            
            <MosyActionButton
            src="SubscriptionsList"
            action="_filter_by_status"
            label=" Filter by status"
            icon="filter"
            onClick={()=>{filterByStats({router:router, stateSetters:stateItemSetters})}}
            />
            
            <MosyActionButton
            src="SubscriptionsList"
            action="_filter_by_user"
            label=" Filter by user"
            icon="users"
            onClick={()=>{filterByUser({router:router, stateSetters:stateItemSetters})}}
            />
            
            <MosyActionButton
            src="SubscriptionsList"
            action="_filter_by_platform"
            label=" Filter by platform"
            icon="bolt"
            onClick={()=>{filterByAsset({router:router, stateSetters:stateItemSetters})}}
            />
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="SubscriptionsList" link={customProfilePath} label="New Subscription" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "subscriptions_print_card", defaultTitle:"Subscriptions"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("subscriptions_data_table", "Subscriptions.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="subscriptions_print_card">
      <table className="table table-hover  text-left printTarget" id="subscriptions_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Account name</b></th>
            <th scope="col"><b>Subscription Name</b></th>
            <th scope="col"><b>Asset</b></th>
            <th scope="col"><b>Start Date</b></th>
            <th scope="col"><b>Next Billing Date</b></th>
            <th scope="col"><b>Status</b></th>
            <th scope="col"><b>Amount</b></th>
            <th scope="col"><b>Total Payments Made</b></th>
            <th scope="col"><b>Days Until Billing</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.subscriptionsLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="10" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Subscriptions ...</h5>
              </td>
            </tr>
          ) : stateItem.subscriptionsListData?.length > 0 ? (
            stateItem.subscriptionsListData.map((listsubscriptions_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listsubscriptions_result.primkey}`}>
                  <tr key={listsubscriptions_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listsubscriptions_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="subscriptions"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listsubscriptions_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                            <MosyGridRowOptions
                            src="SubscriptionsList"
                            action="_view_payments"
                            label=" View Payments"
                            icon="credit-card"
                            dataIn={() => viewSubscriptionPayments(listsubscriptions_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="SubscriptionsList"
                            action="_send_message"
                            label=" Send Message"
                            icon="send"
                            dataIn={() => notifyUser(listsubscriptions_result.account_id, listsubscriptions_result._app_users_full_name_account_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="SubscriptionsList"
                            action="_generate_invoice"
                            label=" Generate invoice"
                            icon="file-text"
                            dataIn={() => generateSubInvoice(listsubscriptions_result)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="SubscriptionsList"
                            action="_renew_subscription"
                            label=" Renew Subscription"
                            icon="refresh"
                            dataIn={() => renewSubscription(listsubscriptions_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="SubscriptionsList"
                            action="_view_invoices"
                            label=" View invoices"
                            icon="copy"
                            dataIn={() => viewSubscriptionInvoices(listsubscriptions_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listsubscriptions_result.account_id}>{magicTrimText(listsubscriptions_result._app_users_full_name_account_id, 70)}</span></td>
                      <td scope="col"><span title={listsubscriptions_result.subscription_name}>{magicTrimText(listsubscriptions_result.subscription_name, 70)}</span></td>
                      <td scope="col"><span title={listsubscriptions_result.asset_id}>{magicTrimText(listsubscriptions_result._assets_asset_name_asset_id, 70)}</span></td>
                      <td scope="col"><span title={listsubscriptions_result.start_date}>{mosyFormatDateOnly(listsubscriptions_result.start_date)}</span></td>
                      <td scope="col"><span title={listsubscriptions_result.next_billing_date}>{mosyFormatDateOnly(listsubscriptions_result.next_billing_date)}</span></td>
                      <td scope="col"><span title={listsubscriptions_result.status}>{magicTrimText(listsubscriptions_result.status, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listsubscriptions_result.amount)}</span></td>
                      <td scope="col"><span>{mosyTonum(listsubscriptions_result.total_payments)}</span></td>
                      <td scope="col"><span title={listsubscriptions_result.days_to_next_billing}>{magicTrimText(listsubscriptions_result.days_to_next_billing, 70)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="10" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no subscriptions records found</h6>
                    
                    <AddNewButton src="SubscriptionsList"  link={customProfilePath} label="New Subscription" icon="plus-circle" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b><span>{mosyTonum(sumsubscriptions_amount)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(sumsubscriptions_total_payments)}</span></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="SubscriptionsList"
        tblName="subscriptions"
        totalPages={stateItem.subscriptionsListPageCount}
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

