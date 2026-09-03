<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, account_id, amount, currency, payment_method, payment_status, paid_at    
//important columns on profile : record_id, account_id, payment_context, context_id, amount, currency, payment_method, payment_status, external_reference, paid_at, created_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages all payment transactions across the application. It handles payment processing,
tracking, reconciliation, and verification for orders, subscriptions, and other billing contexts.
Payments are linked to their source context (order, subscription, wallet topup) and track external
payment gateway references.

Key relationships:
- Links to app_users via account_id
- Links to orders via context_id when payment_context='order'
- Links to subscriptions via context_id when payment_context='subscription'
- Tracks external payment gateway references (M-Pesa, Stripe, etc.)
- Updates order and subscription status upon successful payment

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="payments";
  $__page_title ="Payments";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"payments",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"payments",
    "multigrid_col_span"=>"9"      

  ];
  

  $modules_and_links_=[
    "profile_module_name"=>"profile",
    "profile_module_link"=>"./profile",
    "addnew_page_link"=>"./profile",
    "list_module_name"=>"list",
    "list_page_link"=>"./list",
    "write_profile"=>true,
    "write_list"=>false
  ];
  $profile_file_name   = $modules_and_links_["profile_module_name"];
  $list_file_name      = $modules_and_links_["list_module_name"];
  $back_to_list_       = $modules_and_links_["list_page_link"];
  $add_new_page_link   = $modules_and_links_["addnew_page_link"];


//$list_template= file_get_contents('../novatemplates/dna_grid3.tdna');
//$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');

$csgrid_dictionary = [
  "data9" => "asset_code",          // image src
  "data1" => "logo",       // alt text
  "data2" => "logo",       // alt text
  "data3" => "asset_name",      // display name
  "data4" => "nodata",          // subtitle
  "data5" => "description",     // progress %
  "data7" => "nodata",           // badge text
  "data6" => "role"            // badge text
];

$profile_dictionary = [
  "data9" => "asset_code",          // image src
  "data1" => "logo",       // alt text
  "data2" => "logo",       // alt text
  "data14" => "asset_name",      // display name
  "data4" => "nodata",          // subtitle
  "data5" => "description",     // progress %
  "data7" => "nodata",           // badge text
  "data6" => "role"            // badge text
];

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           "payments" => []
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"payment_status" => "checkblank(getarr_val_(\$payments_node,'payment_status'),'pending')"
        ],
        
      "dataRowMutations"=>[

         /* "loans_issued" => [
              "type" => "sum",
              "table" => "loans",
              "link"  => "account_id:record_id",
              "column" => "amount",
              "where" => [
                  "status" => "disbursed"
              ]
          ],
          "total_payments" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "account_id:record_id",
              "column" => "amount"
          ],
          "latest_payments" => [
              "type" => "mini",
              "table" => "payments",
              "link"  => "account_id:record_id",
              "columns" => "date,amount,refno,clientid",
              "where" => [
                  "status" => "paid",
                  "amount<" => 100
              ],
              "limit" => 10,
              "order" => "primkey:desc"
          ],

          "loan_balance" => [
              "type" => "compute",
              "expr" => "loans_issued-total_payments"
          ],*/ 
                 
          
        ],
        // Custom query hooks for Next.js
        "custom_next_js_query_line_cols" => [
            "customer_name" => [
                "function" => "await mosyQddata('app_users', 'record_id', row?.account_id)",
                "args" => [],
                "return" => "data_res?.full_name"
            ],
            "order_details" => [
                "function" => "row?.payment_context === 'order' ? await mosyQddata('orders', 'record_id', row?.context_id) : null",
                "args" => [],
                "return" => "data_res"
            ]
        ]
    ],

//Table name : payments

// columns : "primkey" , "record_id" , "account_id" , "payment_context" , "context_id" , "amount" , "currency" , "payment_method" , "payment_status" , "external_reference" , "paid_at" , "created_at" , "hive_site_id" , "hive_site_name" , "app_id" , 


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "payments" => ["primkey","record_id","account_id","context_id","amount","currency","payment_method","payment_status","external_reference","payment_context","paid_at","created_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "payments" => [
                "Payment Information" => ["paid_at","account_id","app_id","context_id","amount","currency","payment_method","external_reference","payment_status"],
                "Remark" => ["invoice_id","payment_context"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => ["created_at"], 
        "print_tables" => ["payments"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["payment_method","hive_site_id","hive_site_name","order_details","created_at","currency","payment_status"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["amount"], 
        "textarea_array" => ["payment_context"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "payment_status" => "pending,processing,completed,failed,cancelled,refunded"
        ],

        "dynamic_drop_down_array" => ["currency","payment_method"], // if its here dont add it to connection_cols and vice versa 
        "password_columns" => [], 
        "title_columns" => ["record_id"], 
        "date_columns" => [],
        "datetime_columns" => ["paid_at","created_at"],

        "rename_cols_array" => [ 
            "account_id" => "Customer",
            "payment_context" => "Payment Remark",
            "invoice_id" => "Invoice remark",
            "app_id" => "Asset / platform",
            "payment_method" => "Payment Method",
            "payment_status" => "Payment Status",
            "external_reference" => "Reference No.",
            "paid_at" => "Payment Date",
            "context_id" => "Payment for",
            "customer_name" => "Customer Name",
            "context_display" => "Context",
            "order_details" => "Order Details",
            "subscription_details" => "Subscription Details"
        ],

        "rename_tables_array" => [
            "payments" => "Payments"
        ],

        "new_label_buttons_arr" => [ 
            "payments" => "credit-card:New Payment:{`Payment / \${paymentsNode?.external_reference} / \${paymentsNode?._subscriptions_subscription_name_context_id}`}" // node formart tablenameNode eg acc_renewalsNode
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "payments"=>["csv"=>"account_id,payment_context,context_id,amount,currency,payment_method,payment_status,external_reference,paid_at","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "payments_list"=>"loadPayments()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /*"related_orders"=>[
            "table"=>"orders",
            "link"=>"orders_list",
            "query"=>"record_id='{{context_id}}' and '{{payment_context}}'='order'",
            "title"=>"Related Order",
            "columns"=>["record_id","order_status","total_amount","currency","created_at"]
          ],
          "related_subscriptions"=>[
            "table"=>"subscriptions",
            "link"=>"subscriptions_list",
            "query"=>"record_id='{{context_id}}' and '{{payment_context}}'='subscription'",
            "title"=>"Related Subscription",
            "columns"=>["record_id","asset_id","status","amount","next_billing_date"]
          ],
          "wallet_transactions"=>[
            "table"=>"usage_wallet_ledger",
            "link"=>"usage_wallet_ledger_list",
            "query"=>"reference_id='{{record_id}}' and reference_type='payment'",
            "title"=>"Wallet Transactions",
            "columns"=>["record_id","wallet_id","direction","amount","reason","created_at"]
          ]*/
        ], 
        "custom_profile_col_data" => [], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "app_id" => "assets:record_id:asset_name:apiRoutes.digitalassetlist.base",
           "context_id" => "subscriptions:record_id:subscription_name:apiRoutes.subscriptions.base",
           "account_id" => "app_users:record_id:full_name:apiRoutes.platformuserlist.base",
           "invoice_id" => "invoices:record_id:invoice_remark:apiRoutes.invoices.base"
        ]
    ]
  
  ];

  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         "calendar: Filter by Payment Date" => [
             "fe" => "filterByPaymentDate('../payments/list','Filter Payment dates','payments','paidAt')",
             "file" => "payment-filters"
         ],
         "copy: Filter by subscription" => [
             "fe" => "filterPaymentSubs({router:router, stateSetters:stateItemSetters})",
             "file" => "payment-filters"
         ],  
                 
        "bolt: Filter by platform" => [
             "fe" => "filterbyAsset({router:router, stateSetters:stateItemSetters})",
             "file" => "payment-filters"
         ],  
         "users: Filter by user" => [
             "fe" => "filterByUser({router:router, stateSetters:stateItemSetters})",
             "file" => "payment-filters"
         ]
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         "envelope: Send receipt" => [
             "fe" => "printSubReceipt(paymentsNode)",
             "be" => "printSubReceipt()",
             "file" => "payment-print"
         ],
         "eye: View invoice" => [
             "fe" => "viewInvoice(paymentsNode?.invoice_id)",
             "file" => "payment-filters"
         ],        
         "send: Send Message" => [
             "fe" => "senduserMessage({userRecordId:paymentsNode?.account_id})",
              "file" => "user-notify",
             "basepath"=>"../../users/logicControl/"         
         ]
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         "copy: View Subscription" => [
             "fe" => "viewSubscription(listpayments_result?.context_id)",
             "file" => "payment-details"
         ],
         "envelope: Send receipt" => [
             "fe" => "printSubReceipt(listpayments_result)",
             "be" => "printSubReceipt()",
             "file" => "payment-print"
         ],
         "send: Send Message" => [
             "fe" => "senduserMessage({userRecordId:listpayments_result.account_id})",
              "file" => "user-notify",
             "basepath"=>"../../users/logicControl/" 
         ],
         "eye: View invoice" => [
             "fe" => "viewInvoice(listpayments_result.invoice_id)",
             "file" => "payment-filters"
         ],           
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
   /*"relatedOrders"=>[ 
     "filter_str"=>"record_id='\${paymentsNode?.context_id}' and '\${paymentsNode?.payment_context}'='order'",
     "module_name"=>"Orders",
     "list_title"=>"Related Order",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'orders', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ],*/
   "relatedSubscriptions"=>[ 
     "filter_str"=>"{contextId:btoa(paymentsNode?.context_id)}",
     "module_name"=>"Payments",
     "list_title"=>"Subscription payment history",
     "event_name"=>"",
     "custom"=>false,
     "external"=>false,
     "alias"=>'payments', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ]
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedCustomer"=>[ 
     "filter_str"=>"record_id='{paymentsNode?.account_id}'",
     "module_name"=>"AppUsers",
     "profile_title"=>"Customer Profile",
     "custom"=>false,
     "external"=>true,
     "alias"=>'app_users',      
     "event_name"=>"",
     "event_path"=>"",
     "list_table_name"=>"app_users",
   ]*/
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-11 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="rounded_avatar";
  ///=================================== basic template setup 

?>