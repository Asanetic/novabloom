
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { DigitalassetlistBatchMutations } from './DigitalassetlistBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddDigitalassetlist, UpdateDigitalassetlist } from './DigitalassetlistDbGateway';

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
      table: 'assets',
      source: 'Digitalassetlist',
      action : 'select',
      role: 'view_assets',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // assets column DictionaryMap
  const DigitalassetlistColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    assetCode : "asset_code", 
    assetName : "asset_name", 
    assetType : "asset_type", 
    pricingType : "pricing_type", 
    status : "status", 
    description : "description", 
    createdAt : "created_at", 
    updatedAt : "updated_at", 
    logo : "logo", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `assets`,
      dictionary: DigitalassetlistColumnDictionary,
      searchParams,
      authData,
      batchMutations: DigitalassetlistBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Digitalassetlist data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Digitalassetlist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DigitalassetlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DigitalassetlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DigitalassetlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DigitalassetlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DigitalassetlistRequest);
     
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
      table: 'assets',
      source: 'Digitalassetlist',
      action : 'create',
      role: 'manage_assets',
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

		
  
  //--- Begin  assets inputs array ---// 
  const DigitalassetlistInputsArr = {

    "asset_code" : "?", 
    "asset_name" : "?", 
    "asset_type" : "?", 
    "pricing_type" : "?", 
    "status" : "?", 
    "description" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 
    "logo" : "?", 

  };

  //--- End assets inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('assets',DigitalassetlistInputsArr, DigitalassetlistRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Digitalassetlist
      const result = await AddDigitalassetlist(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for logo, if any
                if (body.fileassets_logo) {
                  if(body["fileassets_logo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "fileassets_logo"], "media/assets");
                    
                    DigitalassetlistInputsArr.logo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateDigitalassetlist(newId, { logo: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_assets_logo;
                      
                    //Delete file if need be

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        assets_dataNode: result.record_id
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

export async function PUT(DigitalassetlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DigitalassetlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DigitalassetlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DigitalassetlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DigitalassetlistRequest);
     
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
      table: 'assets',
      source: 'Digitalassetlist',
      action : 'update',
      role: 'manage_assets',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const DigitalassetlistFormAction = body.assets_mosy_action;
    const assets_dataNode_value = base64Decode(body.assets_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  assets inputs array ---// 
  const DigitalassetlistInputsArr = {

    "asset_code" : "?", 
    "asset_name" : "?", 
    "asset_type" : "?", 
    "pricing_type" : "?", 
    "status" : "?", 
    "description" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 
    "logo" : "?", 

  };

  //--- End assets inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('assets',DigitalassetlistInputsArr, DigitalassetlistRequest, newId, authData)
       
      // update table Digitalassetlist
      const result = await UpdateDigitalassetlist(newId, mutatedDataArray, body, authData, `primkey='${assets_dataNode_value}'`)

      
                // Now handle the file upload for logo, if any
                if (body.fileassets_logo) {
                  if(body["fileassets_logo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "fileassets_logo"], "media/assets");
                    
                    DigitalassetlistInputsArr.logo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateDigitalassetlist(newId, { logo: filePath }, body, authData,  `primkey='${assets_dataNode_value}'`)
                    
                    let fileToDelete = body.media_assets_logo;
                      
                    //Delete old file
mosyDeleteFile(fileToDelete);
// Log or store deleted file: fileToDelete

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        assets_dataNode: assets_dataNode_value
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


