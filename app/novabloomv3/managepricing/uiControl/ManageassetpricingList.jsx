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
import { loadManageassetpricingListData, popDeleteDialog, InteprateManageassetpricingEvent  } from '../dataControl/ManageassetpricingRequestHandler';

//state management
import { useManageassetpricingState } from '../dataControl/ManageassetpricingStateManager';

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


//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_ASSET_PRICING";

//live data list component

export default function ManageassetpricingList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../managepricing/profile",
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
  
  //manage Manageassetpricing states
  const [stateItem, stateItemSetters] = useManageassetpricingState(settersOverrides);
  
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
    
    loadManageassetpricingListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute amount totals
  const sumasset_pricing_amount = stateItem.manageassetpricingListData?.reduce(
    (sum, row) => sum + Number(row.amount || 0),
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"asset_pricing", keyword:stateItem.manageassetpricingQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Manage Asset Pricing </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_asset_pricing" name="txt_asset_pricing" className="custom-search-input form-control" placeholder="Search in Manage Asset Pricing "
          onChange={(e) => stateItemSetters.setManageassetpricingQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qasset_pricing_btn" name="qasset_pricing_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="ManageassetpricingList" link={customProfilePath} label="New asset pricing plan" icon="tag" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "asset_pricing_print_card", defaultTitle:"Manage Asset Pricing"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("asset_pricing_data_table", "Manage Asset Pricing.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="asset_pricing_print_card">
      <table className="table table-hover  text-left printTarget" id="asset_pricing_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Asset</b></th>
            <th scope="col"><b>Model Name</b></th>
            <th scope="col"><b>Model Features</b></th>
            <th scope="col"><b>Pricing Type</b></th>
            <th scope="col"><b>Amount</b></th>
            <th scope="col"><b>Billing Cycle</b></th>
            <th scope="col"><b>Status</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.manageassetpricingLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="8" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Manage Asset Pricing ...</h5>
              </td>
            </tr>
          ) : stateItem.manageassetpricingListData?.length > 0 ? (
            stateItem.manageassetpricingListData.map((listasset_pricing_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listasset_pricing_result.primkey}`}>
                  <tr key={listasset_pricing_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listasset_pricing_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="asset_pricing"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listasset_pricing_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listasset_pricing_result.asset_id}>{magicTrimText(listasset_pricing_result._assets_asset_name_asset_id, 70)}</span></td>
                      <td scope="col"><span title={listasset_pricing_result.model_name}>{magicTrimText(listasset_pricing_result.model_name, 70)}</span></td>
                      <td scope="col"><span>
                        <ReactMarkdown>
                          
                          {magicTrimText(listasset_pricing_result.model_features, 70)}
                          
                        </ReactMarkdown>
                      </span></td>
                      <td scope="col"><span title={listasset_pricing_result.pricing_type}>{magicTrimText(listasset_pricing_result.pricing_type, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listasset_pricing_result.amount)}</span></td>
                      <td scope="col"><span title={listasset_pricing_result.billing_cycle}>{magicTrimText(listasset_pricing_result.billing_cycle, 70)}</span></td>
                      <td scope="col"><span title={listasset_pricing_result.status}>{magicTrimText(listasset_pricing_result.status, 70)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="8" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no asset pricing records found</h6>
                    
                    <AddNewButton src="ManageassetpricingList"  link={customProfilePath} label="New asset pricing plan" icon="tag" />
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
                <th scope="col"><b><span>{mosyTonum(sumasset_pricing_amount)}</span></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="ManageassetpricingList"
        tblName="asset_pricing"
        totalPages={stateItem.manageassetpricingListPageCount}
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

