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
import { loadOrdersListData, popDeleteDialog, InteprateOrdersEvent  } from '../dataControl/OrdersRequestHandler';

//state management
import { useOrdersState } from '../dataControl/OrdersStateManager';

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
// Imports from order-filters.jsx
import {
  filterByOrderDate
} from '../logicControl/order-filters';

// Imports from manage-orders.jsx
import {
  completeOrders,
  cancelOrders,
  completeOrder,
  cancelOrder
} from '../logicControl/manage-orders';

// Imports from order-reports.jsx
import {
  exportOrders
} from '../logicControl/order-reports';

// Imports from order-details.jsx
import {
  viewOrderDetails,
  viewCustomer,
  viewOrderItems,
  viewOrderPayments
} from '../logicControl/order-details';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_ORDERS";

//live data list component

export default function OrdersList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../orders/profile",
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
  
  //manage Orders states
  const [stateItem, stateItemSetters] = useOrdersState(settersOverrides);
  
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
    
    loadOrdersListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute total_amount totals
  const sumorders_total_amount = stateItem.ordersListData?.reduce(
    (sum, row) => sum + Number(row.total_amount || 0),
    0
  );
  
  
  //access control managemant
  const denied = MosyAccessControl(MOSY_ACCESS_KEY);
  if (denied) return denied;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"orders", keyword:stateItem.ordersQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Orders </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_orders" name="txt_orders" className="custom-search-input form-control" placeholder="Search in Orders "
          onChange={(e) => stateItemSetters.setOrdersQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qorders_btn" name="qorders_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <MosyActionButton
            src="OrdersList"
            action="_filter_by_order_date"
            label=" Filter by Order Date"
            icon="calendar"
            onClick={()=>{filterByOrderDate()}}
            />
            
            <MosyActionButton
            src="OrdersList"
            action="_mark_as_completed"
            label=" Mark as Completed"
            icon="check-circle"
            onClick={()=>{completeOrders()}}
            />
            
            <MosyActionButton
            src="OrdersList"
            action="_cancel_orders"
            label=" Cancel Orders"
            icon="x-circle"
            onClick={()=>{cancelOrders()}}
            />
            
            <MosyActionButton
            src="OrdersList"
            action="_export_orders"
            label=" Export Orders"
            icon="download"
            onClick={()=>{exportOrders()}}
            />
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="OrdersList" link={customProfilePath} label="New Order" icon="shopping-cart" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "orders_print_card", defaultTitle:"Orders"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("orders_data_table", "Orders.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="orders_print_card">
      <table className="table table-hover  text-left printTarget" id="orders_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Customer</b></th>
            <th scope="col"><b>Order Status</b></th>
            <th scope="col"><b>Total Amount</b></th>
            <th scope="col"><b>Currency</b></th>
            <th scope="col"><b>Order Date</b></th>
            <th scope="col"><b>Customer Name</b></th>
            <th scope="col"><b>Total Items</b></th>
            <th scope="col"><b>Amount Paid</b></th>
            <th scope="col"><b>Balance Due</b></th>
            <th scope="col"><b>Payment Status</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.ordersLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="11" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Orders ...</h5>
              </td>
            </tr>
          ) : stateItem.ordersListData?.length > 0 ? (
            stateItem.ordersListData.map((listorders_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listorders_result.primkey}`}>
                  <tr key={listorders_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listorders_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="orders"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listorders_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                            <MosyGridRowOptions
                            src="OrdersList"
                            action="_view_details"
                            label=" View Details"
                            icon="eye"
                            dataIn={() => viewOrderDetails()}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="OrdersList"
                            action="_view_customer"
                            label=" View Customer"
                            icon="user"
                            dataIn={() => viewCustomer()}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="OrdersList"
                            action="_view_items"
                            label=" View Items"
                            icon="list"
                            dataIn={() => viewOrderItems()}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="OrdersList"
                            action="_view_payments"
                            label=" View Payments"
                            icon="credit-card"
                            dataIn={() => viewOrderPayments()}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="OrdersList"
                            action="_complete_order"
                            label=" Complete Order"
                            icon="check-circle"
                            dataIn={() => completeOrder()}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="OrdersList"
                            action="_cancel_order"
                            label=" Cancel Order"
                            icon="x-circle"
                            dataIn={() => cancelOrder()}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listorders_result.account_id}>{magicTrimText(listorders_result._app_users_full_name_account_id, 70)}</span></td>
                      <td scope="col"><span title={listorders_result.order_status}>{magicTrimText(listorders_result.order_status, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listorders_result.total_amount)}</span></td>
                      <td scope="col"><span title={listorders_result.currency}>{magicTrimText(listorders_result.currency, 70)}</span></td>
                      <td scope="col"><span title={listorders_result.created_at}>{mosyFormatDateTime(listorders_result.created_at)}</span></td>
                      <td scope="col"><span title={listorders_result.customer_name}>{magicTrimText(listorders_result.customer_name, 70)}</span></td>
                      <td scope="col"><span title={listorders_result.total_items}>{magicTrimText(listorders_result.total_items, 70)}</span></td>
                      <td scope="col"><span title={listorders_result.total_paid}>{magicTrimText(listorders_result.total_paid, 70)}</span></td>
                      <td scope="col"><span title={listorders_result.balance_due}>{magicTrimText(listorders_result.balance_due, 70)}</span></td>
                      <td scope="col"><span title={listorders_result.payment_status}>{magicTrimText(listorders_result.payment_status, 70)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="11" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no orders records found</h6>
                    
                    <AddNewButton src="OrdersList"  link={customProfilePath} label="New Order" icon="shopping-cart" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b><span>{mosyTonum(sumorders_total_amount)}</span></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
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
        src="OrdersList"
        tblName="orders"
        totalPages={stateItem.ordersListPageCount}
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

