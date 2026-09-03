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
import { loadSystemrolesListData, popDeleteDialog, InteprateSystemrolesEvent  } from '../dataControl/SystemrolesRequestHandler';

//state management
import { useSystemrolesState } from '../dataControl/SystemrolesStateManager';

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
export const MOSY_ACCESS_KEY = "VIEW_SYSTEM_ROLE_BUNDLES";

//live data list component

export default function SystemrolesList({ dataIn = {}, dataOut = {} }) {
  
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
  
  //manage Systemroles states
  const [stateItem, stateItemSetters] = useSystemrolesState(settersOverrides);
  
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
    
    loadSystemrolesListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"system_role_bundles", keyword:stateItem.systemrolesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> System Roles </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_system_role_bundles" name="txt_system_role_bundles" className="custom-search-input form-control" placeholder="Search in System Roles "
          onChange={(e) => stateItemSetters.setSystemrolesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qsystem_role_bundles_btn" name="qsystem_role_bundles_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="SystemrolesList" link={customProfilePath} label="New Role" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "system_role_bundles_print_card", defaultTitle:"System Roles"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("system_role_bundles_data_table", "System Roles.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="system_role_bundles_print_card">
      <table className="table table-hover  text-left printTarget" id="system_role_bundles_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Role Name</b></th>
            <th scope="col"><b>Remark</b></th>
            <th scope="col"><b>Permissions</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.systemrolesLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="5" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading System Roles ...</h5>
              </td>
            </tr>
          ) : stateItem.systemrolesListData?.length > 0 ? (
            stateItem.systemrolesListData.map((listsystem_role_bundles_result, index) => {
              
              
              //init user_bundle_role_functions mini list items
              const user_bundle_role_functions_permission_listMiniList = Array.isArray(listsystem_role_bundles_result.permission_list) ? listsystem_role_bundles_result.permission_list : [];
              
              
              
              return(
                <Fragment key={`_row_${listsystem_role_bundles_result.primkey}`}>
                  <tr key={listsystem_role_bundles_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listsystem_role_bundles_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="system_role_bundles"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listsystem_role_bundles_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listsystem_role_bundles_result.bundle_name}>{magicTrimText(listsystem_role_bundles_result.bundle_name, 70)}</span></td>
                      <td scope="col"><span>
                        <ReactMarkdown>
                          
                          {magicTrimText(listsystem_role_bundles_result.remark, 70)}
                          
                        </ReactMarkdown>
                      </span></td>
                      <td scope="col"><span title={listsystem_role_bundles_result.permissions}>{magicTrimText(listsystem_role_bundles_result.permissions, 70)}</span></td>
                      
                    </tr>
                    
                    
                    <tr className="bg-light">
                      <td>-</td>
                      <td colSpan="9">
                        {/*<!-- Start  Title ribbon-->*/}
                        <div className="col-md-12 row p-2  justify-content-center p-0">
                          <div className="col text-left h6"><b>{`Permissions`}</b></div>
                          <div className="col-md-12 border-bottom border_set"></div>
                        </div>
                        {/*<!-- End Title ribbon-->*/}
                        
                        {Array.isArray(listsystem_role_bundles_result.permission_list) && listsystem_role_bundles_result.permission_list.length > 0 ? (
                          <>
                          {/*-- Start Table --*/}
                          <div className="table-responsive data-tables">
                            <table className="table table-hover text-left">
                              <thead className="text-uppercase">
                                <tr>
                                  <th>#</th>
                                  <th>role name</th>
                                  
                                </tr>
                              </thead>
                              <tbody>
                                {listsystem_role_bundles_result.permission_list.map((system_role_bundles_permission_list_record, idx) => (
                                  <tr key={`mini_list_${system_role_bundles_permission_list_record.row_count}`}>
                                    <td><b>{system_role_bundles_permission_list_record.row_count}</b></td>
                                    <td>{magicTrimText(system_role_bundles_permission_list_record.role_name,70)}</td>
                                    
                                  </tr>
                                ))}
                                
                              </tbody>
                              <tfoot>
                                <tr>
                                  <td></td>
                                  
                                  <th></th>
                                  
                                </tr>
                              </tfoot>
                              
                            </table>
                          </div>
                          {/*<!-- End Table -->*/}
                          {/*<!-- Start  Title ribbon-->*/}
                          <div className="col-md-12 row p-2  justify-content-center p-0">
                            <div className="col text-left multigrid_view_more skip_print no-export "><a href={`roles_list?user_bundle_role_functions_mosyfilter=${btoa(`bundleId=${listsystem_role_bundles_result.bundle_id}`)}&mosytitle=${btoa(`Permissions`)}`}></a></div>
                          </div>
                          {/*<!-- End Title ribbon--> */}
                        </>
                      ) : (
                        <div className="col-md-12 text-center " id="">No Permission List records found</div>
                        
                      )}
                      
                    </td>
                  </tr>
                  
                  
                  
                </Fragment>)
                
              })
              
            ) : (
              
              <tr><td colSpan="5" className="text-muted">
                
                
                <div className="col-md-12 text-center mt-4">
                  <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no system role bundles records found</h6>
                  
                  <AddNewButton src="SystemrolesList"  link={customProfilePath} label="New Role" icon="plus-circle" />
                  <div className="col-md-12 pt-5 " id=""></div>
                </div>
              </td></tr>
              
            )}
            
            <tr className="bg-light">
              <th></th>
              
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              <th scope="col"><b></b></th>
              
            </tr>
          </tbody>
          
        </table>
      </div>
      <MosyPaginationUi
      src="SystemrolesList"
      tblName="system_role_bundles"
      totalPages={stateItem.systemrolesListPageCount}
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

