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
import { loadInvoicesListData, popDeleteDialog, InteprateInvoicesEvent  } from '../dataControl/InvoicesRequestHandler';

//state management
import { useInvoicesState } from '../dataControl/InvoicesStateManager';

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
// Imports from invoices-utils.jsx
import {
  newInvoice,
  viewInvoicePayments,
  sendInvoice
} from '../logicControl/invoices-utils';

// Imports from invoices-filters.jsx
import {
  filterByPaymentDate,
  filterPaymentSubs,
  filterbyAsset,
  filterByUser
} from '../logicControl/invoices-filters';

// Imports from invoice-payments.jsx
import {
  addInvoicePayments
} from '../logicControl/invoice-payments';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_INVOICES";

//live data list component

export default function InvoicesList({ dataIn = {}, dataOut = {} }) {
  
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
  
  //manage Invoices states
  const [stateItem, stateItemSetters] = useInvoicesState(settersOverrides);
  
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
    
    loadInvoicesListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute payments_total totals
  const suminvoices_payments_total = stateItem.invoicesListData?.reduce(
    (sum, row) => sum + Number(row.payments_total || 0),
    0
  );
  
  // Compute total_amount totals
  const suminvoices_total_amount = stateItem.invoicesListData?.reduce(
    (sum, row) => sum + Number(row.total_amount || 0),
    0
  );
  
  // Compute discount_amount totals
  const suminvoices_discount_amount = stateItem.invoicesListData?.reduce(
    (sum, row) => sum + Number(row.discount_amount || 0),
    0
  );
  
  // Compute balance_due totals
  const suminvoices_balance_due = stateItem.invoicesListData?.reduce(
    (sum, row) => sum + Number(row.balance_due || 0),
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"invoices", keyword:stateItem.invoicesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Invoices </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_invoices" name="txt_invoices" className="custom-search-input form-control" placeholder="Search in Invoices "
          onChange={(e) => stateItemSetters.setInvoicesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qinvoices_btn" name="qinvoices_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <MosyActionButton
            src="InvoicesList"
            action="_generate_invoice"
            label=" Generate Invoice"
            icon="bolt"
            onClick={()=>{newInvoice()}}
            />
            
            <MosyActionButton
            src="InvoicesList"
            action="_filter_by_creation_date"
            label=" Filter by creation date"
            icon="calendar"
            onClick={()=>{filterByPaymentDate('../invoices/list','Filter Payment dates','invoices','createdAt')}}
            />
            
            <MosyActionButton
            src="InvoicesList"
            action="_filter_by_subscription"
            label=" Filter by subscription"
            icon="copy"
            onClick={()=>{filterPaymentSubs({router:router, stateSetters:stateItemSetters})}}
            />
            
            <MosyActionButton
            src="InvoicesList"
            action="_filter_by_platform"
            label=" Filter by platform"
            icon="bolt"
            onClick={()=>{filterbyAsset({router:router, stateSetters:stateItemSetters})}}
            />
            
            <MosyActionButton
            src="InvoicesList"
            action="_filter_by_user"
            label=" Filter by user"
            icon="users"
            onClick={()=>{filterByUser({router:router, stateSetters:stateItemSetters})}}
            />
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="InvoicesList" link={customProfilePath} label="Create Invoice" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "invoices_print_card", defaultTitle:"Invoices"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("invoices_data_table", "Invoices.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="invoices_print_card">
      <table className="table table-hover  text-left printTarget" id="invoices_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Invoice #</b></th>
            <th scope="col"><b>Account name</b></th>
            <th scope="col"><b>Payment description</b></th>
            <th scope="col"><b>Total paid</b></th>
            <th scope="col"><b>Total amount</b></th>
            <th scope="col"><b>Invoice Balance</b></th>
            <th scope="col"><b>Issue Date</b></th>
            <th scope="col"><b>Due Date</b></th>
            <th scope="col"><b>Platform</b></th>
            <th scope="col"><b>Subscription</b></th>
            <th scope="col"><b>Status</b></th>
            <th scope="col"><b>Discount</b></th>
            <th scope="col"><b>Balance Due</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.invoicesLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="14" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Invoices ...</h5>
              </td>
            </tr>
          ) : stateItem.invoicesListData?.length > 0 ? (
            stateItem.invoicesListData.map((listinvoices_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listinvoices_result.primkey}`}>
                  <tr key={listinvoices_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listinvoices_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="invoices"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listinvoices_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                            <MosyGridRowOptions
                            src="InvoicesList"
                            action="_add_payment"
                            label=" Add Payment"
                            icon="credit-card"
                            dataIn={() => addInvoicePayments(listinvoices_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="InvoicesList"
                            action="_view_invoice_payments"
                            label=" View Invoice payments"
                            icon="refresh"
                            dataIn={() => viewInvoicePayments(listinvoices_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="InvoicesList"
                            action="_send_invoice"
                            label=" Send invoice"
                            icon="send"
                            dataIn={() => sendInvoice(listinvoices_result)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listinvoices_result.invoice_number}>{magicTrimText(listinvoices_result.invoice_number, 70)}</span></td>
                      <td scope="col"><span title={listinvoices_result.account_id}>{magicTrimText(listinvoices_result._app_users_full_name_account_id, 70)}</span></td>
                      <td scope="col"><span title={listinvoices_result.invoice_remark}>{magicTrimText(listinvoices_result.invoice_remark, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listinvoices_result.payments_total)}</span></td>
                      <td scope="col"><span>{mosyTonum(listinvoices_result.total_amount)}</span></td>
                      <td scope="col"><span title={listinvoices_result.invoice_balance}>{magicTrimText(listinvoices_result.invoice_balance, 70)}</span></td>
                      <td scope="col"><span title={listinvoices_result.issue_date}>{mosyFormatDateOnly(listinvoices_result.issue_date)}</span></td>
                      <td scope="col"><span title={listinvoices_result.due_date}>{mosyFormatDateOnly(listinvoices_result.due_date)}</span></td>
                      <td scope="col"><span title={listinvoices_result.asset_id}>{magicTrimText(listinvoices_result._assets_asset_name_asset_id, 70)}</span></td>
                      <td scope="col"><span title={listinvoices_result.subscription_id}>{magicTrimText(listinvoices_result._subscriptions_subscription_name_subscription_id, 70)}</span></td>
                      <td scope="col"><span title={listinvoices_result.status}>{magicTrimText(listinvoices_result.status, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listinvoices_result.discount_amount)}</span></td>
                      <td scope="col"><span>{mosyTonum(listinvoices_result.balance_due)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="14" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no invoices records found</h6>
                    
                    <AddNewButton src="InvoicesList"  link={customProfilePath} label="Create Invoice" icon="plus-circle" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b><span>{mosyTonum(suminvoices_payments_total)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(suminvoices_total_amount)}</span></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b><span>{mosyTonum(suminvoices_discount_amount)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(suminvoices_balance_due)}</span></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="InvoicesList"
        tblName="invoices"
        totalPages={stateItem.invoicesListPageCount}
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

