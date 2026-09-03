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
import { inteprateManageassetpricingFormAction, manageassetpricingProfileData , popDeleteDialog, InteprateManageassetpricingEvent } from '../dataControl/ManageassetpricingRequestHandler';

//state management
import { useManageassetpricingState } from '../dataControl/ManageassetpricingStateManager';

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


// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_ASSET_PRICING";

//live data detial / profile component

export default function ManageassetpricingProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ManageassetpricingMainProfilePage",
    parentProfileItemId = "ManageassetpricingProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Manageassetpricing states
  const [stateItem, stateItemSetters] = useManageassetpricingState(settersOverrides);
  const asset_pricingNode = stateItem.manageassetpricingNode
  
  // -- basic states --//
  const paramManageassetpricingUptoken  = stateItem.manageassetpricingUptoken
  const manageassetpricingActionStatus = stateItem.manageassetpricingActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setManageassetpricingNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postManageassetpricingFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateManageassetpricingFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postManageassetpricingFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("ManageassetpricingProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    manageassetpricingProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="ManageassetpricingProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postManageassetpricingFormData} encType="multipart/form-data" id="asset_pricing_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {asset_pricingNode?.primkey ? (  <span>{`${asset_pricingNode?._assets_asset_name_asset_id} pricing / ${asset_pricingNode?.model_name}`}</span> ) :(<span> New asset pricing plan</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramManageassetpricingUptoken && (
                  <DeleteButton
                  src="ManageassetpricingMainProfilePage"
                  tableName="asset_pricing"
                  uptoken={paramManageassetpricingUptoken}
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
              
              
              
              {paramManageassetpricingUptoken && (
                <>
                
              </>
            )}
            
            {paramManageassetpricingUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="ManageassetpricingMainProfilePage"
              tableName="asset_pricing"
              uptoken={paramManageassetpricingUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="ManageassetpricingMainProfilePage"
              tableName="asset_pricing"
              link="./profile"
              label="New asset pricing plan"
              icon="tag" />
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
                <div className="col-md-5 text-center">Model Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="asset_pricing"
                field="model_name"
                label="Model Name"
                value={asset_pricingNode?.model_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <input className="form-control" id="asset_id" name="asset_id" value={asset_pricingNode?.asset_id || ""} placeholder="Asset" type="hidden"/>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Pricing Type</label>
                  
                  <select name="pricing_type" id="pricing_type" className="form-control">
                    <option  value={asset_pricingNode?.pricing_type || ""}>{asset_pricingNode?.pricing_type || "Select Pricing Type"}</option>
                    <option>one_time</option>
                    <option>recurring</option>
                    <option>usage_based</option>
                    <option>trial</option>
                    
                  </select>
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Price Model</label>
                  
                  <select name="price_model" id="price_model" className="form-control">
                    <option  value={asset_pricingNode?.price_model || ""}>{asset_pricingNode?.price_model || "Select Price Model"}</option>
                    <option>flat_rate</option>
                    <option>per_unit</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Pricing Model</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="asset_pricing"
                field="amount"
                label="Amount"
                value={asset_pricingNode?.amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="asset_pricing"
                field="unit_price"
                label="Unit Price"
                value={asset_pricingNode?.unit_price || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Currency</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.manageassetpricing.base}
                  idField="primkey"
                  labelField="currency"
                  inputName="currency"
                  label="Currency"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={asset_pricingNode?.currency || ""}
                  />
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Billing Schedule</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-3">
                  <label className="d-none">Billing Cycle</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.manageassetpricing.base}
                  idField="primkey"
                  labelField="billing_cycle"
                  inputName="billing_cycle"
                  label="Billing Cycle"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={asset_pricingNode?.billing_cycle || ""}
                  />
                </div>
                
                
                <MosySmartField
                module="asset_pricing"
                field="effective_from"
                label="Effective From"
                value={asset_pricingNode?.effective_from || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="date"
                cellOverrides={{additionalClass: "col-md-3"}}
                />
                
                
                <MosySmartField
                module="asset_pricing"
                field="effective_to"
                label="Effective To"
                value={asset_pricingNode?.effective_to || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="date"
                cellOverrides={{additionalClass: "col-md-3"}}
                />
                
                
                <div className="form-group col-md-3">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={asset_pricingNode?.status || ""}>{asset_pricingNode?.status || "Select Status"}</option>
                    <option>active</option>
                    <option>inactive</option>
                    <option>archived</option>
                    <option>expired</option>
                    
                  </select>
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Features</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-12 hive_data_cell">
                  <label >Model Features</label>
                  <MosyHtmlEditor
                  key={`reload - ${asset_pricingNode?.primkey}`}
                  module="asset_pricing"
                  field="model_features"
                  label="Model Features"
                  value={asset_pricingNode?.model_features || ""}
                  onChange={handleInputChange}
                  context={{ hostParent: hostParent  }}
                  inputOverrides={{}}
                  type="content_editable"
                  cellOverrides={{additionalClass: "d-none"}}
                  
                  />
                  <div className="col-md-12  p-0 m-0 ck_raw_content d-none"  id="model_features_toprint">{asset_pricingNode?.model_features || ""}</div>
                  
                </div>
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="ManageassetpricingMainProfilePage"
                tblName="asset_pricing"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="asset_pricing_dataNode" name="asset_pricing_dataNode" value={paramManageassetpricingUptoken}/>
            <input type="hidden" id="asset_pricing_mosy_action" name="asset_pricing_mosy_action" value={manageassetpricingActionStatus}/>
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

