
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { SystemmodulemanifestBatchMutations } from './SystemmodulemanifestBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddSystemmodulemanifest, UpdateSystemmodulemanifest } from './SystemmodulemanifestDbGateway';

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
      table: 'system_module_manifest_',
      source: 'Systemmodulemanifest',
      action : 'select',
      role: 'view_system_module_manifest_',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // system_module_manifest_ column DictionaryMap
  const SystemmodulemanifestColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    componentName : "component_name", 
    moduleName : "module_name", 
    accessName : "access_name", 
    permissionType : "permission_type", 
    capabilityKey : "capability_key", 
    moduleKey : "module_key", 
    relativePath : "relative_path", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `system_module_manifest_`,
      dictionary: SystemmodulemanifestColumnDictionary,
      searchParams,
      authData,
      batchMutations: SystemmodulemanifestBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Systemmodulemanifest data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Systemmodulemanifest failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(SystemmodulemanifestRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SystemmodulemanifestRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SystemmodulemanifestRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SystemmodulemanifestRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SystemmodulemanifestRequest);
     
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
      table: 'system_module_manifest_',
      source: 'Systemmodulemanifest',
      action : 'create',
      role: 'manage_system_module_manifest_',
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

		
  
  //--- Begin  system_module_manifest_ inputs array ---// 
  const SystemmodulemanifestInputsArr = {

    "component_name" : "?", 
    "module_name" : "?", 
    "access_name" : "?", 
    "permission_type" : "?", 
    "capability_key" : "?", 
    "module_key" : "?", 
    "relative_path" : "?", 

  };

  //--- End system_module_manifest_ inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('system_module_manifest_',SystemmodulemanifestInputsArr, SystemmodulemanifestRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Systemmodulemanifest
      const result = await AddSystemmodulemanifest(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        system_module_manifest__dataNode: result.record_id
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

export async function PUT(SystemmodulemanifestRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = SystemmodulemanifestRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await SystemmodulemanifestRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await SystemmodulemanifestRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(SystemmodulemanifestRequest);
     
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
      table: 'system_module_manifest_',
      source: 'Systemmodulemanifest',
      action : 'update',
      role: 'manage_system_module_manifest_',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const SystemmodulemanifestFormAction = body.system_module_manifest__mosy_action;
    const system_module_manifest__dataNode_value = base64Decode(body.system_module_manifest__dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  system_module_manifest_ inputs array ---// 
  const SystemmodulemanifestInputsArr = {

    "component_name" : "?", 
    "module_name" : "?", 
    "access_name" : "?", 
    "permission_type" : "?", 
    "capability_key" : "?", 
    "module_key" : "?", 
    "relative_path" : "?", 

  };

  //--- End system_module_manifest_ inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('system_module_manifest_',SystemmodulemanifestInputsArr, SystemmodulemanifestRequest, newId, authData)
       
      // update table Systemmodulemanifest
      const result = await UpdateSystemmodulemanifest(newId, mutatedDataArray, body, authData, `primkey='${system_module_manifest__dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        system_module_manifest__dataNode: system_module_manifest__dataNode_value
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


