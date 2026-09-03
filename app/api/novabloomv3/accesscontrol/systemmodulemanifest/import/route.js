
import { magicRandomStr, processImport } from "../../../../apiUtils/dataControl/dataUtils";
import { processAuthToken } from "../../../../auth/authManager";
import { mutateInputArray } from "../../../beMonitor";

import { AddSystemmodulemanifest } from "../SystemmodulemanifestDbGateway";

export async function POST(req) {
  try {
    const { csvData, colsArray } = await req.json();

    // --- Validate Token ---
    const { valid: isTokenValid, data: authData, reason: tokenError } = processAuthToken(req);
    if (!isTokenValid) {
      return new Response(
        JSON.stringify({ success: false, message: tokenError }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // --- Prepare insertable records ---
    const processedInsertObj = processImport(csvData, colsArray, authData, "exp");
    let insertResults = [];

    // --- Process each record ---
    for (const node of processedInsertObj) {
      ///mutate record id       
      const newRecordId = magicRandomStr(10) ;      
      node.module_key = newRecordId;
      
      const mutatedObj = mutateInputArray("system_module_manifest_", node, req, newRecordId, authData);

     const insertResult = await AddSystemmodulemanifest(newRecordId, mutatedObj, req, authData);
     insertResults.push(insertResult);
    }

    return new Response(
      JSON.stringify({status: "success", success: true, data: insertResults }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("CSV Import Error:", err);
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}