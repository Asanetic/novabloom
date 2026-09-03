
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert asset_pricing 
export async function AddManageassetpricing(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("asset_pricing", mutatedDataArray, body);
   
  return result;
}


//update asset_pricing 
export async function UpdateManageassetpricing(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("asset_pricing", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete asset_pricing 
export async function DeleteManageassetpricing(tokenId, whereStr)
{  
  const result = await mosySqlDelete("asset_pricing", whereStr);

  return result;
}

