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
import { loadApiuserlistListData, popDeleteDialog, InteprateApiuserlistEvent  } from '../dataControl/ApiuserlistRequestHandler';

//state management
import { useApiuserlistState } from '../dataControl/ApiuserlistStateManager';

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
// Imports from app-users-filters.jsx
import {
  filterByRegDate,
  filterByAccStatus
} from '../logicControl/app-users-filters';

// Imports from user-details.jsx
import {
  viewUserSubscriptions,
  viewUserPayments
} from '../logicControl/user-details';

// Imports from user-notify.jsx
import {
  senduserMessage
} from '../logicControl/user-notify';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_APP_USERS";

//live data list component

export default function ApiuserlistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="./apiprofile",
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
  
  //manage Apiuserlist states
  const [stateItem, stateItemSetters] = useApiuserlistState(settersOverrides);
  
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
    
    loadApiuserlistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute total_payments totals
  const sumapp_users_total_payments = stateItem.apiuserlistListData?.reduce(
    (sum, row) => sum + Number(row.total_payments || 0),
    0
  );
  
  
  //access control managemant
  const denied = MosyAccessControl(MOSY_ACCESS_KEY);
  if (denied) return denied;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"app_users", keyword:stateItem.apiuserlistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> API user list </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_app_users" name="txt_app_users" className="custom-search-input form-control" placeholder="Search in API user list "
          onChange={(e) => stateItemSetters.setApiuserlistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qapp_users_btn" name="qapp_users_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <MosyActionButton
            src="ApiuserlistList"
            action="_filter_by_registration_date"
            label=" Filter by Registration Date"
            icon="calendar"
            onClick={()=>{filterByRegDate(`../users/apilist`,`Filter registration date`, `app_users`,`createdAt`)}}
            />
            
            <MosyActionButton
            src="ApiuserlistList"
            action="_filter_by_statuse"
            label=" Filter by statuse"
            icon="bolt"
            onClick={()=>{filterByAccStatus({router,stateSetters:stateItemSetters})}}
            />
            
            <a href="apilist" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="ApiuserlistList" link={customProfilePath} label="New User" icon="user-plus" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "app_users_print_card", defaultTitle:"API user list"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("app_users_data_table", "API user list.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="app_users_print_card">
      <table className="table table-hover  text-left printTarget" id="app_users_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            <th>Profile Photo</th>
            <th scope="col"><b>Full Name</b></th>
            <th scope="col"><b>Email Address</b></th>
            <th scope="col"><b>Phone Number</b></th>
            <th scope="col"><b>Account Status</b></th>
            <th scope="col"><b>Country</b></th>
            <th scope="col"><b>Registration date</b></th>
            <th scope="col"><b>Total Subscriptions</b></th>
            <th scope="col"><b>Total Payments</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.apiuserlistLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="10" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading API user list ...</h5>
              </td>
            </tr>
          ) : stateItem.apiuserlistListData?.length > 0 ? (
            stateItem.apiuserlistListData.map((listapp_users_result, index) => {
              
              
              //init payments mini list items
              const payments_payment_historyMiniList = Array.isArray(listapp_users_result.payment_history) ? listapp_users_result.payment_history : [];
              
              
              //sum payments ``amount`` mini list totals
              const sumMiniList_payments_amount = payments_payment_historyMiniList.reduce((s, i) => s + Number(i.amount || 0), 0);
              
              
              return(
                <Fragment key={`_row_${listapp_users_result.primkey}`}>
                  <tr key={listapp_users_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listapp_users_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="app_users"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listapp_users_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                            <MosyGridRowOptions
                            src="ApiuserlistList"
                            action="_view_subscriptions"
                            label=" View Subscriptions"
                            icon="eye"
                            dataIn={() => viewUserSubscriptions(listapp_users_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="ApiuserlistList"
                            action="_view_payments"
                            label=" View Payments"
                            icon="credit-card"
                            dataIn={() => viewUserPayments(listapp_users_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="ApiuserlistList"
                            action="_send_message"
                            label=" Send message"
                            icon="envelope"
                            dataIn={() => senduserMessage({userRecordId:listapp_users_result?.record_id, username:listapp_users_result?.full_name})}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <MosyImageViewer
                        media={`/api/mediaroom?media=${btoa((listapp_users_result.profile_photo || ""))}`}
                        mediaRoot={""}
                        defaultLogo={logo.src}
                        imageClass="small_thumbnail"
                        />
                      </td>
                      <td scope="col"><span title={listapp_users_result.full_name}>{magicTrimText(listapp_users_result.full_name, 70)}</span></td>
                      <td scope="col"><span title={listapp_users_result.email}>{magicTrimText(listapp_users_result.email, 70)}</span></td>
                      <td scope="col"><span title={listapp_users_result.phone_number}>{magicTrimText(listapp_users_result.phone_number, 70)}</span></td>
                      <td scope="col"><span title={listapp_users_result.account_status}>{magicTrimText(listapp_users_result.account_status, 70)}</span></td>
                      <td scope="col"><span title={listapp_users_result.country}>{magicTrimText(listapp_users_result.country, 70)}</span></td>
                      <td scope="col"><span title={listapp_users_result.created_at}>{mosyFormatDateTime(listapp_users_result.created_at)}</span></td>
                      <td scope="col"><span title={listapp_users_result.total_subscriptions}>{magicTrimText(listapp_users_result.total_subscriptions, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listapp_users_result.total_payments)}</span></td>
                      
                    </tr>
                    
                    
                    <tr className="bg-light">
                      <td>-</td>
                      <td colSpan="9">
                        {/*<!-- Start  Title ribbon-->*/}
                        <div className="col-md-12 row p-2  justify-content-center p-0">
                          <div className="col text-left h6"><b>{`Payment History`}</b></div>
                          <div className="col-md-12 border-bottom border_set"></div>
                        </div>
                        {/*<!-- End Title ribbon-->*/}
                        
                        {Array.isArray(listapp_users_result.payment_history) && listapp_users_result.payment_history.length > 0 ? (
                          <>
                          {/*-- Start Table --*/}
                          <div className="table-responsive data-tables">
                            <table className="table table-hover text-left">
                              <thead className="text-uppercase">
                                <tr>
                                  <th>#</th>
                                  <th>paid at</th>
                                  <th>amount</th>
                                  <th>external reference</th>
                                  <th>payment context</th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                                {listapp_users_result.payment_history.map((app_users_payment_history_record, idx) => (
                                  <tr key={`mini_list_${app_users_payment_history_record.row_count}`}>
                                    <td><b>{app_users_payment_history_record.row_count}</b></td>
                                    <td>{mosyFormatDateTime(app_users_payment_history_record.paid_at)}</td>
                                    <td>{mosyTonum(app_users_payment_history_record.amount)}</td>
                                    <td>{magicTrimText(app_users_payment_history_record.external_reference,70)}</td>
                                    <td>{magicTrimText(app_users_payment_history_record.payment_context,70)}</td>
                                    
                                  </tr>
                                ))}
                                
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td></td>
                                  
                                  <th></th>
                                  <th>{mosyTonum(sumMiniList_payments_amount)}</th>
                                  <th></th>
                                  <th></th>
                                  
                                </tr>
                              </tfoot>
                              
                            </table>
                          </div>
                          {/*<!-- End Table -->*/}
                          {/*<!-- Start  Title ribbon-->*/}
                          <div className="col-md-12 row p-2  justify-content-center p-0">
                            <div className="col text-left multigrid_view_more skip_print no-export "><a href={`payments_list?payments_mosyfilter=${btoa(`account_id='${listapp_users_result.record_id}'`)}&mosytitle=${btoa(`Payment History`)}`}></a></div>
                          </div>
                          {/*<!-- End Title ribbon--> */}
                        </>
                      ) : (
                        <div className="col-md-12 text-center " id="">No Payment History records found</div>
                        
                      )}
                      
                    </td>
                  </tr>
                  
                  
                  
                </Fragment>)
                
              })
              
            ) : (
              
              <tr><td colSpan="11" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no app users records found</h6>
                  
                  <AddNewButton src="ApiuserlistList"  link={customProfilePath} label="New User" icon="user-plus" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
            
            <tr className="bg-light">
              <th></th>
              <th></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b><span>{mosyTonum(sumapp_users_total_payments)}</span></b></th>
              
            </tr>
          </tbody>
          
        </table>
      </div>
      <MosyPaginationUi
      src="ApiuserlistList"
      tblName="app_users"
      totalPages={stateItem.apiuserlistListPageCount}
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

