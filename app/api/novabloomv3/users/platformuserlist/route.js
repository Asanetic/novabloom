
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { PlatformuserlistBatchMutations } from './PlatformuserlistBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddPlatformuserlist, UpdatePlatformuserlist } from './PlatformuserlistDbGateway';

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
      table: 'app_users',
      source: 'Platformuserlist',
      action : 'select',
      role: 'view_app_users',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // app_users column DictionaryMap
  const PlatformuserlistColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    firstName : "first_name", 
    lastName : "last_name", 
    fullName : "full_name", 
    email : "email", 
    phoneNumber : "phone_number", 
    accountStatus : "account_status", 
    emailVerified : "email_verified", 
    phoneVerified : "phone_verified", 
    country : "country", 
    currency : "currency", 
    createdAt : "created_at", 
    updatedAt : "updated_at", 
    passwordHash : "password_hash", 
    profilePhoto : "profile_photo", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `app_users`,
      dictionary: PlatformuserlistColumnDictionary,
      searchParams,
      authData,
      batchMutations: PlatformuserlistBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Platformuserlist data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Platformuserlist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PlatformuserlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PlatformuserlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PlatformuserlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PlatformuserlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PlatformuserlistRequest);
     
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
      table: 'app_users',
      source: 'Platformuserlist',
      action : 'create',
      role: 'manage_app_users',
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

		
  
  //--- Begin  app_users inputs array ---// 
  const PlatformuserlistInputsArr = {

    "first_name" : "?", 
    "last_name" : "?", 
    "full_name" : "?", 
    "email" : "?", 
    "phone_number" : "?", 
    "account_status" : "?", 
    "email_verified" : "?", 
    "phone_verified" : "?", 
    "country" : "?", 
    "currency" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 
    "password_hash" : "?", 
    "profile_photo" : "?", 

  };

  //--- End app_users inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('app_users',PlatformuserlistInputsArr, PlatformuserlistRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Platformuserlist
      const result = await AddPlatformuserlist(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for profile_photo, if any
                if (body.fileapp_users_profile_photo) {
                  if(body["fileapp_users_profile_photo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "fileapp_users_profile_photo"], "media/app_users");
                    
                    PlatformuserlistInputsArr.profile_photo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdatePlatformuserlist(newId, { profile_photo: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_app_users_profile_photo;
                      
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
        app_users_dataNode: result.record_id
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

export async function PUT(PlatformuserlistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PlatformuserlistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PlatformuserlistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PlatformuserlistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PlatformuserlistRequest);
     
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
      table: 'app_users',
      source: 'Platformuserlist',
      action : 'update',
      role: 'manage_app_users',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const PlatformuserlistFormAction = body.app_users_mosy_action;
    const app_users_dataNode_value = base64Decode(body.app_users_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  app_users inputs array ---// 
  const PlatformuserlistInputsArr = {

    "first_name" : "?", 
    "last_name" : "?", 
    "full_name" : "?", 
    "email" : "?", 
    "phone_number" : "?", 
    "account_status" : "?", 
    "email_verified" : "?", 
    "phone_verified" : "?", 
    "country" : "?", 
    "currency" : "?", 
    "created_at" : "?", 
    "updated_at" : "?", 
    "password_hash" : "?", 
    "profile_photo" : "?", 

  };

  //--- End app_users inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('app_users',PlatformuserlistInputsArr, PlatformuserlistRequest, newId, authData)
       
      // update table Platformuserlist
      const result = await UpdatePlatformuserlist(newId, mutatedDataArray, body, authData, `primkey='${app_users_dataNode_value}'`)

      
                // Now handle the file upload for profile_photo, if any
                if (body.fileapp_users_profile_photo) {
                  if(body["fileapp_users_profile_photo"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "fileapp_users_profile_photo"], "media/app_users");
                    
                    PlatformuserlistInputsArr.profile_photo = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdatePlatformuserlist(newId, { profile_photo: filePath }, body, authData,  `primkey='${app_users_dataNode_value}'`)
                    
                    let fileToDelete = body.media_app_users_profile_photo;
                      
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
        app_users_dataNode: app_users_dataNode_value
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


