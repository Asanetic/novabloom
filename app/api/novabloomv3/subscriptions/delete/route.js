
import { mosySqlDelete , base64Decode , mosyQddata , mosyDeleteFile } from '../../../apiUtils/dataControl/dataUtils';
import { processAuthToken } from '../../../auth/authManager';

import { DeleteSubscriptions } from '../subscriptions/SubscriptionsDbGateway';

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
      table: 'subscriptions',
      source: 'Subscriptions',
      action : 'delete',
      role: 'manage_subscriptions',
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

  const deleteToken = searchParams.get('_subscriptions_delete_record');
  const deleteTokenDecode = base64Decode(deleteToken);

  if (deleteToken) {
    // Customize table and WHERE clause here
    const table = 'subscriptions'; // Replace with your actual table
    
     
    
    const whereStr = `WHERE primkey = '${deleteTokenDecode}'`;

    const res = await DeleteSubscriptions(deleteTokenDecode, whereStr);

    if (res.status === 'success') {
      return Response.json({ status: 'success', rowsAffected: res.affectedRows });
    } else {
      return Response.json({ status: 'error', message: res.message }, { status: 500 });
    }
  }

  return Response.json({ status: 'idle', message: 'No action performed' });
  
}