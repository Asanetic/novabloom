
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { AssetpricingBatchMutations } from './AssetpricingBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddAssetpricing, UpdateAssetpricing } from './AssetpricingDbGateway';

export async function GET(request) {

  try {
    const { searchParams } = new URL(request.url);

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canSelect = validateRoleAccess({
      table: 'asset_pricing',
      source: 'Assetpricing',
      action : 'select',
      role: 'view_asset_pricing',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // asset_pricing column DictionaryMap
  const AssetpricingColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    assetId : "asset_id", 
    modelName : "model_name", 
    modelFeatures : "model_features", 
    pricingType : "pricing_type", 
    priceModel : "price_model", 
    amount : "amount", 
    unitPrice : "unit_price", 
    currency : "currency", 
    billingCycle : "billing_cycle", 
    effectiveFrom : "effective_from", 
    effectiveTo : "effective_to", 
    status : "status", 
    createdAt : "created_at", 
    updatedAt : "updated_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `asset_pricing`,
      dictionary: AssetpricingColumnDictionary,
      searchParams,
      authData,
      batchMutations: AssetpricingBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Assetpricing data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Assetpricing failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(AssetpricingRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = AssetpricingRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await AssetpricingRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await AssetpricingRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AssetpricingRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canPost = validateRoleAccess({
      table: 'asset_pricing',
      source: 'Assetpricing',
      action : 'create',
      role: 'manage_asset_pricing',
      authData
    });

    if (!canPost.valid) {
      return Response.json({
        status: 'error',
        message: canPost.message,
        data: []
      });
    }
    
    //generate Record id 
    const newId = magicRandomStr(7);

		
  
  //--- Begin  asset_pricing inputs array ---// 
  const AssetpricingInputsArr = {

    "asset_id" : "?", 
    "model_name" : "?", 
    "model_features" : "?", 
    "pricing_type" : "?", 
    "price_model" : "?", 
    "amount" : "?", 
    "unit_price" : "?", 
    "currency" : "?", 
    "billing_cycle" : "?", 
    "effective_from" : "?", 
    "effective_to" : "?", 
    "status" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End asset_pricing inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('asset_pricing',AssetpricingInputsArr, AssetpricingRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Assetpricing
      const result = await AddAssetpricing(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        asset_pricing_dataNode: result.record_id
      });
      
    
 
  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(AssetpricingRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = AssetpricingRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await AssetpricingRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await AssetpricingRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(AssetpricingRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canUpdate = validateRoleAccess({
      table: 'asset_pricing',
      source: 'Assetpricing',
      action : 'update',
      role: 'manage_asset_pricing',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const AssetpricingFormAction = body.asset_pricing_mosy_action;
    const asset_pricing_dataNode_value = base64Decode(body.asset_pricing_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  asset_pricing inputs array ---// 
  const AssetpricingInputsArr = {

    "asset_id" : "?", 
    "model_name" : "?", 
    "model_features" : "?", 
    "pricing_type" : "?", 
    "price_model" : "?", 
    "amount" : "?", 
    "unit_price" : "?", 
    "currency" : "?", 
    "billing_cycle" : "?", 
    "effective_from" : "?", 
    "effective_to" : "?", 
    "status" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 

  };

  //--- End asset_pricing inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('asset_pricing',AssetpricingInputsArr, AssetpricingRequest, newId, authData)
       
      // update table Assetpricing
      const result = await UpdateAssetpricing(newId, mutatedDataArray, body, authData, `primkey='${asset_pricing_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        asset_pricing_dataNode: asset_pricing_dataNode_value
      });
 

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}


