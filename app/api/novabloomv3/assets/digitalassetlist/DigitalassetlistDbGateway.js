
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert assets 
export async function AddDigitalassetlist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("assets", mutatedDataArray, body);
   
  return result;
}


//update assets 
export async function UpdateDigitalassetlist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("assets", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete assets 
export async function DeleteDigitalassetlist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("assets", whereStr);

  return result;
}

