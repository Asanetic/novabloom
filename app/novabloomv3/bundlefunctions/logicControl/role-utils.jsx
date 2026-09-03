/**
 * ════════════════════════════════════════════════════════════════
 * FILE: role-utils.jsx
 * PURPOSE: Frontend logic functions for role-utils
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */


// ════════════════════════════════════════════════════════════════
// FUNCTION: loadBundleRoleFunctions
/* 
Function flow notes
 
how loadBundleRoleFunctions works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function loadBundleRoleFunctions(dataRes, handler) {
    // Implement loadBundleRoleFunctions logic here
    //alert("loadBundleRoleFunctions");
    console.log("loadBundleRoleFunctions dataRes", dataRes)
    handler("role_name", dataRes?.access_name);
    
}

