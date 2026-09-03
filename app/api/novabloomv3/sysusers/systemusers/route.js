
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { SystemusersBatchMutations } from './SystemusersBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddSystemusers, UpdateSystemusers } from './SystemusersDbGateway';

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
      table: 'system_users',
      source: 'Systemusers',
      action : 'select',
      role: 'view_system_users',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // system_users column DictionaryMap
  const SystemusersColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    name : "name", 
    email : "email", 
    tel : "tel", 
    userGender : "user_gender", 
    about : "about", 
    projectId : "project_id", 
    projectName : "project_name", 
    tokenStatus : "token_status", 
    tokenExpiringIn : "token_expiring_in", 
    regdate : "regdate", 
    lastSeen : "last_seen", 
    loginPassword : "login_password", 
    refId : "ref_id", 
    userNo : "user_no", 
    userPic : "user_pic", 
    authToken : "auth_token", 
    userRole : "user_role", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `system_users`,
      dictionary: SystemusersColumnDictionary,
      searchParams,
      authData,
      batchMutations: SystemusersBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Systemusers data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Systemusers failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SystemusersRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SystemusersRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SystemusersRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SystemusersRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SystemusersRequest);
     
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
      table: 'system_users',
      source: 'Systemusers',
      action : 'create',
      role: 'manage_system_users',
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

		
  
  //--- Begin  system_users inputs array ---// 
  const SystemusersInputsArr = {

    "name" : "?", 
    "email" : "?", 
    "tel" : "?", 
    "user_gender" : "?", 
    "about" : "?", 
    "project_id" : "?", 
    "project_name" : "?", 
    "token_status" : "?", 
    "token_expiring_in" : "?", 
    "regdate" : "?", 
    "last_seen" : "?", 
    "login_password" : "?", 
    "ref_id" : "?", 
    "user_no" : "?", 
    "user_pic" : "?", 
    "auth_token" : "?", 
    "user_role" : "?", 

  };

  //--- End system_users inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('system_users',SystemusersInputsArr, SystemusersRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Systemusers
      const result = await AddSystemusers(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for user_pic, if any
                if (body.filesystem_users_user_pic) {
                  if(body["filesystem_users_user_pic"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "filesystem_users_user_pic"], "media/system_users");
                    
                    SystemusersInputsArr.user_pic = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateSystemusers(newId, { user_pic: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_system_users_user_pic;
                      
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
        system_users_dataNode: result.record_id
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

export async function PUT(SystemusersRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SystemusersRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SystemusersRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SystemusersRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SystemusersRequest);
     
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
      table: 'system_users',
      source: 'Systemusers',
      action : 'update',
      role: 'manage_system_users',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const SystemusersFormAction = body.system_users_mosy_action;
    const system_users_dataNode_value = base64Decode(body.system_users_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  system_users inputs array ---// 
  const SystemusersInputsArr = {

    "name" : "?", 
    "email" : "?", 
    "tel" : "?", 
    "user_gender" : "?", 
    "about" : "?", 
    "project_id" : "?", 
    "project_name" : "?", 
    "token_status" : "?", 
    "token_expiring_in" : "?", 
    "regdate" : "?", 
    "last_seen" : "?", 
    "login_password" : "?", 
    "ref_id" : "?", 
    "user_no" : "?", 
    "user_pic" : "?", 
    "auth_token" : "?", 
    "user_role" : "?", 

  };

  //--- End system_users inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('system_users',SystemusersInputsArr, SystemusersRequest, newId, authData)
       
      // update table Systemusers
      const result = await UpdateSystemusers(newId, mutatedDataArray, body, authData, `primkey='${system_users_dataNode_value}'`)

      
                // Now handle the file upload for user_pic, if any
                if (body.filesystem_users_user_pic) {
                  if(body["filesystem_users_user_pic"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "filesystem_users_user_pic"], "media/system_users");
                    
                    SystemusersInputsArr.user_pic = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateSystemusers(newId, { user_pic: filePath }, body, authData,  `primkey='${system_users_dataNode_value}'`)
                    
                    let fileToDelete = body.media_system_users_user_pic;
                      
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
        system_users_dataNode: system_users_dataNode_value
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


