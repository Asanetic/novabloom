
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert sent_messages 
export async function AddSentmessages(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("sent_messages", mutatedDataArray, body);
   
  return result;
}


//update sent_messages 
export async function UpdateSentmessages(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("sent_messages", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete sent_messages 
export async function DeleteSentmessages(tokenId, whereStr)
{  
  const result = await mosySqlDelete("sent_messages", whereStr);

  return result;
}

