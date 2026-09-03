
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert app_users 
export async function AddApiuserlist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("app_users", mutatedDataArray, body);
   
  return result;
}


//update app_users 
export async function UpdateApiuserlist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("app_users", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete app_users 
export async function DeleteApiuserlist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("app_users", whereStr);

  return result;
}

