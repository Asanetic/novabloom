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
import { loadDigitalassetlistListData, popDeleteDialog, InteprateDigitalassetlistEvent  } from '../dataControl/DigitalassetlistRequestHandler';

//state management
import { useDigitalassetlistState } from '../dataControl/DigitalassetlistStateManager';

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
// Imports from asset-details.jsx
import {
  viewPricingModels,
  viewAssetSubscriptions,
  viewAssetPayments
} from '../logicControl/asset-details';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_ASSETS";

//live data list component

export default function DigitalassetlistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../assets/profile",
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
  
  //manage Digitalassetlist states
  const [stateItem, stateItemSetters] = useDigitalassetlistState(settersOverrides);
  
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
    
    loadDigitalassetlistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute active_subscriptions totals
  const sumassets_active_subscriptions = stateItem.digitalassetlistListData?.reduce(
    (sum, row) => sum + Number(row.active_subscriptions || 0),
    0
  );
  
  // Compute total_orders totals
  const sumassets_total_orders = stateItem.digitalassetlistListData?.reduce(
    (sum, row) => sum + Number(row.total_orders || 0),
    0
  );
  
  // Compute total_revenue totals
  const sumassets_total_revenue = stateItem.digitalassetlistListData?.reduce(
    (sum, row) => sum + Number(row.total_revenue || 0),
    0
  );
  
  // Compute active_entitlements totals
  const sumassets_active_entitlements = stateItem.digitalassetlistListData?.reduce(
    (sum, row) => sum + Number(row.active_entitlements || 0),
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"assets", keyword:stateItem.digitalassetlistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Digital Asset List </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_assets" name="txt_assets" className="custom-search-input form-control" placeholder="Search in Digital Asset List "
          onChange={(e) => stateItemSetters.setDigitalassetlistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qassets_btn" name="qassets_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="DigitalassetlistList" link={customProfilePath} label="New Asset" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "assets_print_card", defaultTitle:"Digital Asset List"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("assets_data_table", "Digital Asset List.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="assets_print_card">
      <table className="table table-hover  text-left printTarget" id="assets_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            <th>Logo</th>
            <th scope="col"><b>Asset Code</b></th>
            <th scope="col"><b>Asset Name</b></th>
            <th scope="col"><b>Asset Type</b></th>
            <th scope="col"><b>Pricing Type</b></th>
            <th scope="col"><b>Active Subscriptions</b></th>
            <th scope="col"><b>Total Orders</b></th>
            <th scope="col"><b>Total payments</b></th>
            <th scope="col"><b>Active Entitlements</b></th>
            <th scope="col"><b>Status</b></th>
            <th scope="col"><b>Created Date</b></th>
            <th scope="col"><b>Pricing Models</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.digitalassetlistLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="12" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Digital Asset List ...</h5>
              </td>
            </tr>
          ) : stateItem.digitalassetlistListData?.length > 0 ? (
            stateItem.digitalassetlistListData.map((listassets_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listassets_result.primkey}`}>
                  <tr key={listassets_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listassets_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="assets"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listassets_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                            <MosyGridRowOptions
                            src="DigitalassetlistList"
                            action="_view_pricing"
                            label=" View Pricing"
                            icon="tag"
                            dataIn={() => viewPricingModels(listassets_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="DigitalassetlistList"
                            action="_view_subscriptions"
                            label=" View Subscriptions"
                            icon="users"
                            dataIn={() => viewAssetSubscriptions(listassets_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                            <MosyGridRowOptions
                            src="DigitalassetlistList"
                            action="_view_payments"
                            label=" View payments"
                            icon="credit-card"
                            dataIn={() => viewAssetPayments(listassets_result.record_id)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <MosyImageViewer
                        media={`/api/mediaroom?media=${btoa((listassets_result.logo || ""))}`}
                        mediaRoot={""}
                        defaultLogo={logo.src}
                        imageClass="small_thumbnail"
                        />
                      </td>
                      <td scope="col"><span title={listassets_result.asset_code}>{magicTrimText(listassets_result.asset_code, 70)}</span></td>
                      <td scope="col"><span title={listassets_result.asset_name}>{magicTrimText(listassets_result.asset_name, 70)}</span></td>
                      <td scope="col"><span title={listassets_result.asset_type}>{magicTrimText(listassets_result.asset_type, 70)}</span></td>
                      <td scope="col"><span title={listassets_result.pricing_type}>{magicTrimText(listassets_result.pricing_type, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listassets_result.active_subscriptions)}</span></td>
                      <td scope="col"><span>{mosyTonum(listassets_result.total_orders)}</span></td>
                      <td scope="col"><span>{mosyTonum(listassets_result.total_revenue)}</span></td>
                      <td scope="col"><span>{mosyTonum(listassets_result.active_entitlements)}</span></td>
                      <td scope="col"><span title={listassets_result.status}>{magicTrimText(listassets_result.status, 70)}</span></td>
                      <td scope="col"><span title={listassets_result.created_at}>{mosyFormatDateOnly(listassets_result.created_at)}</span></td>
                      <td scope="col"><span title={listassets_result.total_pricing_models}>{magicTrimText(listassets_result.total_pricing_models, 70)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="13" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no assets records found</h6>
                    
                    <AddNewButton src="DigitalassetlistList"  link={customProfilePath} label="New Asset" icon="plus-circle" />
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
                <th scope="col"><b><span>{mosyTonum(sumassets_active_subscriptions)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(sumassets_total_orders)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(sumassets_total_revenue)}</span></b></th>
                <th scope="col"><b><span>{mosyTonum(sumassets_active_entitlements)}</span></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="DigitalassetlistList"
        tblName="assets"
        totalPages={stateItem.digitalassetlistListPageCount}
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

