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
import { inteprateDigitalassetlistFormAction, digitalassetlistProfileData , popDeleteDialog, InteprateDigitalassetlistEvent } from '../dataControl/DigitalassetlistRequestHandler';

//state management
import { useDigitalassetlistState } from '../dataControl/DigitalassetlistStateManager';

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

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

import {InteprateManageassetpricingEvent} from '../../managepricing/dataControl/ManageassetpricingRequestHandler';
import ManageassetpricingList from '../../managepricing/uiControl/ManageassetpricingList';
import {IntepratePaymentsEvent} from '../../payments/dataControl/PaymentsRequestHandler';
import PaymentsList from '../../payments/uiControl/PaymentsList';
import {InteprateSubscriptionsEvent} from '../../subscriptions/dataControl/SubscriptionsRequestHandler';
import SubscriptionsList from '../../subscriptions/uiControl/SubscriptionsList';
import ManageassetpricingProfile from '../../managepricing/uiControl/ManageassetpricingProfile';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from asset-pricing.jsx
import {
  addPricingModel
} from '../logicControl/asset-pricing';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_ASSETS";

//live data detial / profile component

export default function DigitalassetlistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="DigitalassetlistMainProfilePage",
    parentProfileItemId = "DigitalassetlistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Digitalassetlist states
  const [stateItem, stateItemSetters] = useDigitalassetlistState(settersOverrides);
  const assetsNode = stateItem.digitalassetlistNode
  
  // -- basic states --//
  const paramDigitalassetlistUptoken  = stateItem.digitalassetlistUptoken
  const digitalassetlistActionStatus = stateItem.digitalassetlistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setDigitalassetlistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postDigitalassetlistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateDigitalassetlistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postDigitalassetlistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("DigitalassetlistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    digitalassetlistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setManageassetpricingCustomProfileQuery Script
  const setManageassetpricingCustomProfileQuery = stateItemSetters.setManageassetpricingCustomProfileQuery;
  const manageassetpricingCustomProfileQuery =  stateItem.manageassetpricingCustomProfileQuery;
  
  useEffect(() => {
    if (assetsNode?.primkey && setManageassetpricingCustomProfileQuery) {
      
      const query =  {NodeId:btoa(assetsNode?.asset_id)};
      
      const tokenUrl = mosyUrlParam("asset_pricing_dataNode")
      
      if(!tokenUrl)
      {
        setManageassetpricingCustomProfileQuery(query);
      }
      
    }
  }, [assetsNode, setManageassetpricingCustomProfileQuery]);
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="DigitalassetlistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postDigitalassetlistFormData} encType="multipart/form-data" id="assets_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {assetsNode?.primkey ? (  <span>{`Asset / ${assetsNode?.asset_name} / Asset ID -  ${assetsNode?.record_id}`} </span> ) :(<span> New Asset</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramDigitalassetlistUptoken && (
                  <DeleteButton
                  src="DigitalassetlistMainProfilePage"
                  tableName="assets"
                  uptoken={paramDigitalassetlistUptoken}
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
              
              
              
              {paramDigitalassetlistUptoken && (
                <>
                
                <MosyActionButton
                label=" Manage Pricing"
                icon="tag"
                onClick={()=>{addPricingModel()}}
                />
                
              </>
            )}
            
            {paramDigitalassetlistUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="DigitalassetlistMainProfilePage"
              tableName="assets"
              uptoken={paramDigitalassetlistUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="DigitalassetlistMainProfilePage"
              tableName="assets"
              link="./profile"
              label="New Asset"
              icon="plus-circle" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        <div className="col-md-6 mr-lg-5">
          
          <div className="col-md-12 p-0 text-center mb-3">
            <div className="col-md-12 m-2"><b>Logo</b></div>
            <MosyImageViewer
            media={`/api/mediaroom?media=${btoa((assetsNode?.logo || ""))}`}
            mediaRoot={""}
            defaultLogo={logo.src}
            imageClass="rounded_avatar"
            />
            
            <MosyFileUploadButton
            tblName="assets"
            attribute="logo"
            />
            <input type="hidden" name="media_assets_logo" value={assetsNode?.logo || ""}/>
          </div>
          
          
        </div>
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Asset Information</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="assets"
                field="asset_code"
                label="Asset Code"
                value={assetsNode?.asset_code || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="assets"
                field="asset_name"
                label="Asset Name"
                value={assetsNode?.asset_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-6 hive_data_cell ">
                  <label className="d-none">Asset Type</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.digitalassetlist.base}
                  idField="primkey"
                  labelField="asset_type"
                  inputName="asset_type"
                  label="Asset Type"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={assetsNode?.asset_type || ""}
                  />
                </div>
                
                
                <div className="form-group col-md-6 hive_data_cell ">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={assetsNode?.status || ""}>{assetsNode?.status || "Select Status"}</option>
                    <option>active</option>
                    <option>inactive</option>
                    <option>archived</option>
                    <option>draft</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Pricing & Billing</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-6 hive_data_cell ">
                  <label >Pricing Type</label>
                  
                  <select name="pricing_type" id="pricing_type" className="form-control">
                    <option  value={assetsNode?.pricing_type || ""}>{assetsNode?.pricing_type || "Select Pricing Type"}</option>
                    <option>one_time</option>
                    <option>recurring</option>
                    <option>usage_based</option>
                    
                  </select>
                </div>
                
                
                {assetsNode?.primkey && (
                  <div className="form-group col-md-6 hive_data_cell  ">
                    <label >Pricing Models</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_pricing_models" name="div_total_pricing_models" placeholder="Pricing Models">{assetsNode?.total_pricing_models || ""}</div>
                  </div>)}
                  
                  {assetsNode?.primkey && (
                    <div className="form-group col-md-6 hive_data_cell  ">
                      <label >Total payments</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_revenue" name="div_total_revenue" placeholder="Total payments">{assetsNode?.total_revenue || ""}</div>
                    </div>)}
                    
                    {assetsNode?.primkey && (
                      <div className="form-group col-md-6 hive_data_cell  ">
                        <label >Total Orders</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_orders" name="div_total_orders" placeholder="Total Orders">{assetsNode?.total_orders || ""}</div>
                      </div>)}
                      
                      {assetsNode?.primkey && (
                        <div className="form-group col-md-6 hive_data_cell  ">
                          <label >Active Entitlements</label>
                          <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_active_entitlements" name="div_active_entitlements" placeholder="Active Entitlements">{assetsNode?.active_entitlements || ""}</div>
                        </div>)}
                        
                        {assetsNode?.primkey && (
                          <div className="form-group col-md-6 hive_data_cell  ">
                            <label >Active Subscriptions</label>
                            <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_active_subscriptions" name="div_active_subscriptions" placeholder="Active Subscriptions">{assetsNode?.active_subscriptions || ""}</div>
                          </div>)}
                        </div>
                        
                      </div>
                      
                      <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                        <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                          <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                          <div className="col-md-5 text-center">Description</div>
                          <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                        </h5>
                        
                        <div className="col-md-12 pt-3 p-0" id=""></div>
                        
                        <div className="row justify-content-start col-md-12 p-0 m-0 ">
                          
                          <MosySmartField
                          module="assets"
                          field="description"
                          label="Description"
                          value={assetsNode?.description || ""}
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
                          <div className="col-md-5 text-center"></div>
                          <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                        </h5>
                        
                        <div className="col-md-12 pt-3 p-0" id=""></div>
                        
                        <div className="row justify-content-start col-md-12 p-0 m-0 ">
                          
                          <input className="form-control" id="created_at" name="created_at" value={assetsNode?.created_at || ""} placeholder="Created Date" type="hidden"/>
                          
                          
                          <input className="form-control" id="updated_at" name="updated_at" value={assetsNode?.updated_at || ""} placeholder="Last Updated" type="hidden"/>
                          
                        </div>
                        
                        <div className="col-md-12 text-center">
                          <SubmitButtons
                          src="DigitalassetlistMainProfilePage"
                          tblName="assets"
                          extraClass="optional-custom-class"
                          
                          />
                        </div>
                      </div></div>
                      {/*    Input cells section isle      */}
                    </div>
                    
                    <section className="hive_control">
                      <input type="hidden" id="assets_dataNode" name="assets_dataNode" value={paramDigitalassetlistUptoken}/>
                      <input type="hidden" id="assets_mosy_action" name="assets_mosy_action" value={digitalassetlistActionStatus}/>
                    </section>
                    
                    
                  </div>
                  
                </form>
                
                
                <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
                  {/*<hive_mini_list/>*/}
                  
                  {assetsNode?.primkey && (
                    <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                      <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage Pricing`} </h5>
                      <ManageassetpricingProfile
                      key={`${ manageassetpricingCustomProfileQuery}-${localEventSignature}`}
                      dataIn={{
                        
                        parentStateSetters : stateItemSetters,
                        parentUseEffectKey : localEventSignature,
                        showNavigationIsle:false,
                        customQueryStr : manageassetpricingCustomProfileQuery,
                        hostParent : "DigitalassetlistProfile",
                        parentProfileItemId : activeScrollId,
                        customProfileData : {
                          _assets_asset_name_asset_id : assetsNode?.asset_name,
                          asset_id : assetsNode?.record_id,
                          asset_name:assetsNode?.asset_name
                        }
                        
                      }}
                      
                      dataOut={{
                        
                        setChildDataOut: InteprateManageassetpricingEvent,
                        setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                        
                      }}
                      />
                      
                    </section>
                  )}
                  
                  
                  <style jsx global>{`
                  .data_list_section {
                    display: none;
                  }
                  .bottom_tbl_handler{
                    padding-bottom:70px!important;
                  }
                  `}
                </style>
                {assetsNode?.primkey && (
                  <section className="col-md-12 m-0  pt-5 p-0 ">
                    <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Asset Pricing Models`} </h5>
                    
                    <div className="col-md-12 p-2 text-right ">
                      <a href={`../managepricing/list?assets_mosyfilter=${btoa(` {assetId:btoa(assetsNode?.record_id)}  `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
                    </div>
                    
                    <ManageassetpricingList
                    key={`${customQueryStr}-${localEventSignature}`}
                    dataIn={{
                      parentStateSetters : stateItemSetters,
                      parentUseEffectKey : localEventSignature,
                      showNavigationIsle:false,
                      showDataControlSections:false,
                      customQueryStr :  {assetId:btoa(assetsNode?.record_id)}  ,
                      customProfilePath:""
                      
                    }}
                    
                    dataOut={{
                      setChildDataOut: InteprateManageassetpricingEvent,
                      setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                    }}
                    />
                  </section>
                )}
                
                <style jsx global>{`
                .data_list_section {
                  display: none;
                }
                .bottom_tbl_handler{
                  padding-bottom:70px!important;
                }
                `}
              </style>
              {assetsNode?.primkey && (
                <section className="col-md-12 m-0  pt-5 p-0 ">
                  <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Asset payments`} </h5>
                  
                  <div className="col-md-12 p-2 text-right ">
                    <a href={`../payments/list?assets_mosyfilter=${btoa(` {appId:btoa(assetsNode?.record_id)}  `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
                  </div>
                  
                  <PaymentsList
                  key={`${customQueryStr}-${localEventSignature}`}
                  dataIn={{
                    parentStateSetters : stateItemSetters,
                    parentUseEffectKey : localEventSignature,
                    showNavigationIsle:false,
                    showDataControlSections:false,
                    customQueryStr :  {appId:btoa(assetsNode?.record_id)}  ,
                    customProfilePath:"../payments/profile"
                    
                  }}
                  
                  dataOut={{
                    setChildDataOut: IntepratePaymentsEvent,
                    setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                  }}
                  />
                </section>
              )}
              
              <style jsx global>{`
              .data_list_section {
                display: none;
              }
              .bottom_tbl_handler{
                padding-bottom:70px!important;
              }
              `}
            </style>
            {assetsNode?.primkey && (
              <section className="col-md-12 m-0  pt-5 p-0 ">
                <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Active Subscriptions`} </h5>
                
                <div className="col-md-12 p-2 text-right ">
                  <a href={`../subscriptions/list?assets_mosyfilter=${btoa(`   {assetId:btoa(assetsNode?.record_id)} `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
                </div>
                
                <SubscriptionsList
                key={`${customQueryStr}-${localEventSignature}`}
                dataIn={{
                  parentStateSetters : stateItemSetters,
                  parentUseEffectKey : localEventSignature,
                  showNavigationIsle:false,
                  showDataControlSections:false,
                  customQueryStr :    {assetId:btoa(assetsNode?.record_id)} ,
                  customProfilePath:"../subscriptions/profile"
                  
                }}
                
                dataOut={{
                  setChildDataOut: InteprateSubscriptionsEvent,
                  setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                }}
                />
              </section>
            )}
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
  
