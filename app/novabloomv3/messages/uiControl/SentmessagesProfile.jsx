'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam ,mosyTonum  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateSentmessagesFormAction, sentmessagesProfileData , popDeleteDialog, InteprateSentmessagesEvent } from '../dataControl/SentmessagesRequestHandler';

//state management
import { useSentmessagesState } from '../dataControl/SentmessagesStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'
import { loadUserDetails } from '../logicControl/message-utils';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from send-message.jsx
import {
  sendMessage
} from '../logicControl/send-message';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_SENT_MESSAGES";

//live data detial / profile component

export default function SentmessagesProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="SentmessagesMainProfilePage",
    parentProfileItemId = "SentmessagesProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Sentmessages states
  const [stateItem, stateItemSetters] = useSentmessagesState(settersOverrides);
  const sent_messagesNode = stateItem.sentmessagesNode
  
  // -- basic states --//
  const paramSentmessagesUptoken  = stateItem.sentmessagesUptoken
  const sentmessagesActionStatus = stateItem.sentmessagesActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setSentmessagesNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postSentmessagesFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateSentmessagesFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postSentmessagesFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("SentmessagesProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    sentmessagesProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="SentmessagesProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postSentmessagesFormData} encType="multipart/form-data" id="sent_messages_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {sent_messagesNode?.primkey ? (  <span>{`Message / ${sent_messagesNode?.send_channel || 'No subject'} / ${sent_messagesNode?._app_users_full_name_user_record_id}`}</span> ) :(<span>  Compose Message</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramSentmessagesUptoken && (
                  <DeleteButton
                  src="SentmessagesMainProfilePage"
                  tableName="sent_messages"
                  uptoken={paramSentmessagesUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3  hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && (
                  <>
                  <Link href={backToList} className="text-info hive_profile_nav_back_to_list "><i className="fa fa-arrow-left"></i> Back to list</Link>
                </>
              )}
              
            </div>
            <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
              
              
              
              {paramSentmessagesUptoken && (
                <>
                
                <MosyActionButton
                label=" Send"
                icon="send"
                onClick={()=>{sendMessage(sent_messagesNode?.user_record_id)}}
                />
                
              </>
            )}
            
            {paramSentmessagesUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="SentmessagesMainProfilePage"
              tableName="sent_messages"
              uptoken={paramSentmessagesUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="SentmessagesMainProfilePage"
              tableName="sent_messages"
              link="./profile"
              label=" Compose Message"
              icon="edit" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Recipient Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.platformuserlist.base}
                tblName="app_users"
                parentTable="sent_messages"
                inputName="_app_users_full_name_user_record_id"
                hiddenInputName="user_record_id"
                valueField="record_id"
                displayField="full_name"
                label="Sent to"
                defaultValue={{ record_id: sent_messagesNode?.user_record_id || "", full_name: sent_messagesNode?._app_users_full_name_user_record_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) => loadUserDetails(dataRes, handleInputChange)}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="sent_messages"
                field="receiver_phone"
                label="Phone Number"
                value={sent_messagesNode?.receiver_phone || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="sent_messages"
                field="receiver_email"
                label="Email Address"
                value={sent_messagesNode?.receiver_email || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Channel</label>
                  
                  <select name="send_channel" id="send_channel" className="form-control">
                    <option  value={sent_messagesNode?.send_channel || ""}>{sent_messagesNode?.send_channel || "Select Channel"}</option>
                    <option>sms</option>
                    <option>email</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Message Content</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="sent_messages"
                field="email_subject"
                label="Subject"
                value={sent_messagesNode?.email_subject || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="title"
                cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                />
                
                
                <MosySmartField
                module="sent_messages"
                field="message_body"
                label="Message Content"
                value={sent_messagesNode?.message_body || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="textarea"
                cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                />
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Status & Tracking</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                {sent_messagesNode?.primkey && (
                  <div className="form-group col-md-4 hive_data_cell  ">
                    <label >Delivery Status</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_send_status" name="div_send_status" placeholder="Delivery Status">{sent_messagesNode?.send_status || ""}</div>
                  </div>)}
                  
                  {sent_messagesNode?.primkey && (
                    <div className="form-group col-md-4 hive_data_cell  ">
                      <label >Provider Response</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_send_response" name="div_send_response" placeholder="Provider Response">{sent_messagesNode?.send_response || ""}</div>
                    </div>)}
                    
                    {sent_messagesNode?.primkey && (
                      <div className="form-group col-md-4 hive_data_cell  ">
                        <label >Sent Date & Time</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_sent_at" name="div_sent_at" placeholder="Sent Date & Time">{sent_messagesNode?.sent_at || ""}</div>
                      </div>)}
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons
                      src="SentmessagesMainProfilePage"
                      tblName="sent_messages"
                      extraClass="optional-custom-class"
                      
                      />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="sent_messages_dataNode" name="sent_messages_dataNode" value={paramSentmessagesUptoken}/>
                  <input type="hidden" id="sent_messages_mosy_action" name="sent_messages_mosy_action" value={sentmessagesActionStatus}/>
                </section>
                
                
              </div>
              
            </form>
            
            
            <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
              {/*<hive_mini_list/>*/}
              
              
            </div>
          </div>
        </div>
        
        
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
          
          
          {/* ================== End Feature Section========================== ------*/}
        </div>
        
      );
      
    }
    
