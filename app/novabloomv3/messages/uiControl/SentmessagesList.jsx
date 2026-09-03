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
import { loadSentmessagesListData, popDeleteDialog, InteprateSentmessagesEvent  } from '../dataControl/SentmessagesRequestHandler';

//state management
import { useSentmessagesState } from '../dataControl/SentmessagesStateManager';

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
export const MOSY_ACCESS_KEY = "VIEW_SENT_MESSAGES";

//live data list component

export default function SentmessagesList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="../messages/profile",
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
  
  //manage Sentmessages states
  const [stateItem, stateItemSetters] = useSentmessagesState(settersOverrides);
  
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
    
    loadSentmessagesListData(customQueryStr, stateItemSetters);
    
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"sent_messages", keyword:stateItem.sentmessagesQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Sent Messages </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_sent_messages" name="txt_sent_messages" className="custom-search-input form-control" placeholder="Search in Sent Messages "
          onChange={(e) => stateItemSetters.setSentmessagesQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qsent_messages_btn" name="qsent_messages_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="SentmessagesList" link={customProfilePath} label=" Compose Message" icon="edit" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        <div className="ml-2 cpointer badge p-2 rounded badge-danger mb-3 text-white d-none mosy_msdn" id="mosy_sel_rows_isle" onClick={()=>{loadMessages()}}>
        <i className="fa fa-info-circle mr-2"></i> With (<span id="mosy_sel_rows_count"></span>) selected items | Click for actions
        <input type="hidden" id="mosy_selected_rows" name="mosy_selected_rows" value=""/>
      </div>
      
      
      <div className="text-left m-0 p-0 col-md-12">
        <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
        onClick={() => {mosyPrintToPdf({elemId : "sent_messages_print_card", defaultTitle:"Sent Messages"})}}
        >
        <i className="fa fa-print "></i> Print List
      </div>
      <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
      
      onClick={() => exportTableToExcel("sent_messages_data_table", "Sent Messages.xlsx")}
      >
      <i className="fa fa-arrow-right "></i> Export to excel
    </div>
  </div>
  <div className="col-md-12 m-0 p-0" id="sent_messages_print_card">
    <table className="table table-hover  text-left printTarget" id="sent_messages_data_table">
      <thead className="text-uppercase">
        <tr>
          <th scope="col">
            
            <input type="checkbox" className="mosy_msdn mr-3 cpointer" id="selectAllCheckboxId" onClick={()=>{mosyToggleSelectAllTblRows();mosySelectTblRows()}}/>
            #</th>
            
            <th scope="col"><b>Sent to</b></th>
            <th scope="col"><b>Channel</b></th>
            <th scope="col"><b>Phone Number</b></th>
            <th scope="col"><b>Email Address</b></th>
            <th scope="col"><b>Subject</b></th>
            <th scope="col"><b>Delivery Status</b></th>
            <th scope="col"><b>Sent Date & Time</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.sentmessagesLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="8" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Sent Messages ...</h5>
              </td>
            </tr>
          ) : stateItem.sentmessagesListData?.length > 0 ? (
            stateItem.sentmessagesListData.map((listsent_messages_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listsent_messages_result.primkey}`}>
                  <tr key={listsent_messages_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <input type="checkbox" className="select-row mosy_msdn mr-3 cpointer" onClick={()=>{mosySelectTblRows()}} value={listsent_messages_result.primkey}/>
                          <b>{listsent_messages_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="sent_messages"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listsent_messages_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listsent_messages_result.user_record_id}>{magicTrimText(listsent_messages_result._app_users_full_name_user_record_id, 70)}</span></td>
                      <td scope="col"><span title={listsent_messages_result.send_channel}>{magicTrimText(listsent_messages_result.send_channel, 70)}</span></td>
                      <td scope="col"><span title={listsent_messages_result.receiver_phone}>{magicTrimText(listsent_messages_result.receiver_phone, 70)}</span></td>
                      <td scope="col"><span title={listsent_messages_result.receiver_email}>{magicTrimText(listsent_messages_result.receiver_email, 70)}</span></td>
                      <td scope="col"><span title={listsent_messages_result.email_subject}>{magicTrimText(listsent_messages_result.email_subject, 70)}</span></td>
                      <td scope="col"><span title={listsent_messages_result.send_status}>{magicTrimText(listsent_messages_result.send_status, 70)}</span></td>
                      <td scope="col"><span title={listsent_messages_result.sent_at}>{mosyFormatDateTime(listsent_messages_result.sent_at)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="8" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no sent messages records found</h6>
                    
                    <AddNewButton src="SentmessagesList"  link={customProfilePath} label=" Compose Message" icon="edit" />
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
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="SentmessagesList"
        tblName="sent_messages"
        totalPages={stateItem.sentmessagesListPageCount}
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

