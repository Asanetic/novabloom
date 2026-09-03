
import { mosySqlDelete , base64Decode , mosyQddata , mosyDeleteFile } from '../../../apiUtils/dataControl/dataUtils';
import { processAuthToken } from '../../../auth/authManager';

import { DeleteSystemusers } from '../systemusers/SystemusersDbGateway';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';


export async function GET(request) {

    // --- Validate Token ---
    const { valid: isTokenValid, data: authData, reason: tokenError } = processAuthToken(request);
    if (!isTokenValid) {
      return new Response(
        JSON.stringify({ success: false, message: tokenError }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canDelete = validateRoleAccess({
      table: 'system_users',
      source: 'Systemusers',
      action : 'delete',
      role: 'manage_system_users',
      authData
    });

    if (!canDelete.valid) {
      return Response.json({
        status: 'error',
        message: canDelete.message,
        data: []
      });
    }
    
    
  const { searchParams } = new URL(request.url);

  const deleteToken = searchParams.get('_system_users_delete_record');
  const deleteTokenDecode = base64Decode(deleteToken);

  if (deleteToken) {
    // Customize table and WHERE clause here
    const table = 'system_users'; // Replace with your actual table
    
     
          
          const deleteAttachedMedia = await mosyQddata('system_users', 'primkey', deleteTokenDecode);
          
          const fileToDelete = deleteAttachedMedia?.user_pic
         
          mosyDeleteFile(fileToDelete);
    
    const whereStr = `WHERE primkey = '${deleteTokenDecode}'`;

    const res = await DeleteSystemusers(deleteTokenDecode, whereStr);

    if (res.status === 'success') {
      return Response.json({ status: 'success', rowsAffected: res.affectedRows });
    } else {
      return Response.json({ status: 'error', message: res.message }, { status: 500 });
    }
  }

  return Response.json({ status: 'idle', message: 'No action performed' });
  
}