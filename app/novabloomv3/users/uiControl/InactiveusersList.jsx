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
import { loadInactiveusersListData, popDeleteDialog, InteprateInactiveusersEvent  } from '../dataControl/InactiveusersRequestHandler';

//state management
import { useInactiveusersState } from '../dataControl/InactiveusersStateManager';

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
  filterByRegDate
} from '../../users/logicControl/app-users-filters';

// Imports from user-details.jsx
import {
  viewUserSubscriptions
} from '../../users/logicControl/user-details';

// Imports from user-details.jsx
import {
  viewUserPayments
} from '../logicControl/user-details';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_APP_USERS";

//live data list component

export default function InactiveusersList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../users/profile",
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
  
  //manage Inactiveusers states
  const [stateItem, stateItemSetters] = useInactiveusersState(settersOverrides);
  
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
    
    loadInactiveusersListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute total_orders totals
  const sumapp_users_total_orders = stateItem.inactiveusersListData?.reduce(
    (sum, row) => sum + Number(row.total_orders || 0),
    0
  );
  
  // Compute total_payments totals
  const sumapp_users_total_payments = stateItem.inactiveusersListData?.reduce(
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"app_users", keyword:stateItem.inactiveusersQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Inactive users </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_app_users" name="txt_app_users" className="custom-search-input form-control" placeholder="Search in Inactive users "
          onChange={(e) => stateItemSetters.setInactiveusersQuerySearchStr(e.target.value)}
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
            src="InactiveusersList"
            action="_filter_by_registration_date"
            label=" Filter by Registration Date"
            icon="calendar"
            onClick={()=>{filterByRegDate(`../users/dormarntusers`,`Filter registration date`, `app_users`,`createdAt`)}}
            />
            
            <a href="dormarntusers" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="InactiveusersList" link={customProfilePath} label="New User" icon="user-plus" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "app_users_print_card", defaultTitle:"Inactive users"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("app_users_data_table", "Inactive users.xlsx")}
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
            <th scope="col"><b>Total Orders</b></th>
            <th scope="col"><b>Total Payments</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.inactiveusersLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="10" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Inactive users ...</h5>
              </td>
            </tr>
          ) : stateItem.inactiveusersListData?.length > 0 ? (
            stateItem.inactiveusersListData.map((listapp_users_result, index) => {
              
              
              
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
                            src="InactiveusersList"
                            action="_view_subscriptions"
                            label=" View Subscriptions"
                            icon="eye"
                            dataIn={() => viewUserSubscriptions(listapp_users_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="InactiveusersList"
                            action="_view_payments"
                            label=" View Payments"
                            icon="credit-card"
                            dataIn={() => viewUserPayments(listapp_users_result.record_id)}   // only runs on click now
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
                      <td scope="col"><span>{mosyTonum(listapp_users_result.total_orders)}</span></td>
                      <td scope="col"><span>{mosyTonum(listapp_users_result.total_payments)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="11" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no app users records found</h6>
                    
                    <AddNewButton src="InactiveusersList"  link={customProfilePath} label="New User" icon="user-plus" />
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
                <th scope="col"><b><span>{mosyTonum(sumapp_users_total_orders)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(sumapp_users_total_payments)}</span></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="InactiveusersList"
        tblName="app_users"
        totalPages={stateItem.inactiveusersListPageCount}
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

