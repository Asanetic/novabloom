<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. invoices

//"primkey" , "record_id" , "invoice_number" , "client_id" , "account_id" , "order_id" , "asset_id" , "subscription_id" , "invoice_type" , "status" , "subtotal_amount" , "tax_amount" , "discount_amount" , "total_amount" , "currency" , "issue_date" , "due_date" , "paid_amount" , "balance_due" , "notes" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , <br><br>


//{{table_cols_head}}

  
//Important A.I notes below
  
//important columns on list :  invoice_number, client_id, invoice_type, status, total_amount, balance_due, issue_date    
//important columns on profile :  invoice_number, client_id, invoice_type, status, subtotal_amount, tax_amount, discount_amount, total_amount, paid_amount, balance_due, currency, issue_date, due_date, notes    

/*================= How the module related to the whole app / app flow ====================

This module manages all customer invoices across orders, subscriptions, assets, and accounts.
It acts as the financial source of truth for billing, balances, and payment tracking.
Invoices link to clients, orders, subscriptions, and assets, and feed reports, statements,
and accounting summaries.

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="invoices";
  $__page_title ="Invoices";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"invoices",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"invoices",
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


//$list_template= file_get_contents('../novatemplates/uigrid1.tdna');
 //$list_template= file_get_contents('../novatemplates/csgrid5.tdna');
//$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');
//$profile_template= file_get_contents('../novatemplates/profile8.tdna');

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
           "invoices" => ["payments_total","invoice_balance"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"currency" => "USD"
        ],
      
              
      "dataRowMutations"=>[
 
        "payments_total" => [
              "type" => "sum",
              "table" => "payments",
              "link"  => "invoice_id:record_id",
              "column" => "amount"
          ],
          "invoice_balance" => [
              "type" => "compute",
              "expr" => "total_amount-payments_total"
          ],        
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
            "payments_total" => [
                "function" => "await mosySumRows('payments','amount',`where invoice_id='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res"
            ]
        ]
    ],

//Table name : invoices

// columns : "primkey" , "record_id" , "invoice_number" , "client_id" , "account_id" , "order_id" , "asset_id" , "subscription_id" , "invoice_type" , "status" , "subtotal_amount" , "tax_amount" , "discount_amount" , "total_amount" , "currency" , "issue_date" , "due_date" , "paid_amount" , "balance_due" , "notes" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "invoice_remark" , 


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "invoices" => ["primkey","record_id","invoice_number","account_id","invoice_remark","payments_total","total_amount","invoice_balance","issue_date","due_date"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "invoices" => [
                "Invoice Details" => ["subscription_id","account_id","invoice_number","currency","issue_date","due_date"],
                "Subscription details" => ["invoice_remark","total_amount","payments_total"]
            ]
        ],
//Table name : invoices

// columns : "primkey" , "record_id" , "invoice_number" , "client_id" , "account_id" , "order_id" , "asset_id" , "subscription_id" , "invoice_type" , "status" , "subtotal_amount" , "tax_amount" , "discount_amount" , "total_amount" , "currency" , "issue_date" , "due_date" , "paid_amount" , "balance_due" , "notes" , "created_at" , "updated_at" , "invoice_remark" , "hive_site_id" , "hive_site_name" , 


        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => ["created_at","updated_at","order_id","client_id","asset_id","tax_amount","discount_amount"],
        "print_tables" => ["invoices"],
        "skip_cols_profile" => ["hive_site_id","hive_site_name","paid_amount","paid_amount","balance_due","subtotal_amount","invoice_type","status"],
        "skip_cols_list" => ["hive_site_id","hive_site_name","client_id","currency","tax_amount","order_id","notes","created_at","updated_at","subtotal_amount","paid_amount","invoice_type",],
        "running_bal_col_tbl" => [],
        "grid_tbl" => [],
        "view_tbl_only" => [],
        "sum_cols_list" => ["subtotal_amount","payments_total","discount_amount","total_amount","paid_amount","balance_due"],
        "textarea_array" => ["notes"],
        "content_editable" => [],

        "static_drop_down_array" => [
            "status" => "Draft,Issued,Paid,Overdue,Cancelled",
            "invoice_type" => "Order,Subscription,Asset,Manual"
        ],

        "dynamic_drop_down_array" => ["currency"],
        "password_columns" => [],
        "title_columns" => [],
        "date_columns" => ["issue_date","due_date"],
        "datetime_columns" => [],

        "rename_cols_array" => [
            "invoice_number" => "Invoice #:col-md-4",
            "account_id" => "Account name:col-md-4",
            "invoice_type" => "Invoice Type",
            "asset_id" => "Platform",
            "currency" => "Currency:col-md-4",
            "payments_total" => "Total paid:col-md-4",
            "discount_amount" => "Discount",
            "total_amount" => "Total amount:col-md-4",
            "subscription_id" => "Subscription:col-md-4",
            "invoice_remark" => "Payment description:col-md-4",
            "issue_date" => "Issue Date:col-md-4",
            "due_date" => "Due Date:col-md-4"
        ],

        "rename_tables_array" => [
            "invoices" => "Invoices"
        ],

        "new_label_buttons_arr" => [
            "invoices" => "plus-circle:Create Invoice:{`Invoice / \${invoicesNode?.invoice_number}`}"
        ],

        "profile_pic_style" => ""
    ],
    
    "import"=>[
      "invoices"=>["csv"=>"invoice_number,client_id,invoice_type,status,subtotal_amount,tax_amount,discount_amount,total_amount,currency,issue_date,due_date","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[],
      
        "custom_query_line_cols" => [],
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /* "invoice_payments"=>[
             "table"=>"payments",
             "link"=>"payments_list",
             "query"=>"invoice_id='{{record_id}}'",
             "title"=>"Payments",
             "columns"=>["payment_date","amount","payment_method","ref_no"],
          ]*/
        ],
      
      //Table name : app_users

// columns : "primkey" , "record_id" , "first_name" , "last_name" , "full_name" , "email" , "phone_number" , "password_hash" , "account_status" , "email_verified" , "phone_verified" , "country" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "profile_photo" , 
//Table name : subscriptions

// columns : "primkey" , "record_id" , "account_id" , "asset_id" , "pricing_id" , "start_date" , "next_billing_date" , "end_date" , "status" , "billing_cycle" , "amount" , "currency" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "subscription_name" , 

//Table name : assets

// columns : "primkey" , "record_id" , "asset_code" , "asset_name" , "asset_type" , "pricing_type" , "status" , "description" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "logo" , 



        "custom_profile_col_data" => ["payments_total"=>"?","invoice_balance"=>"?"],
        "custom_profile_default_data" => [],
        "connection_cols" => [
           "account_id" => "app_users:record_id:full_name:apiRoutes.platformuserlist.base",
           "asset_id" => "assets:record_id:asset_name:apiRoutes.digitalassetlist.base",
           "subscription_id" => "subscriptions:record_id:subscription_name:apiRoutes.subscriptions.base:loadSubscriptionData(dataRes,handleInputChange)"
        ]
    ]
  
  ];

  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         
         "bolt: Generate Invoice" => [
             "fe" => "newInvoice()",
             "file" => "invoices-utils"
           ],
         "calendar: Filter by creation date" => [
             "fe" => "filterByPaymentDate('../invoices/list','Filter Payment dates','invoices','createdAt')",
             "file" => "invoices-filters"
         ],
                        
        "copy: Filter by subscription" => [
             "fe" => "filterPaymentSubs({router:router, stateSetters:stateItemSetters})",
             "file" => "invoices-filters"
         ],   
        "bolt: Filter by platform" => [
             "fe" => "filterbyAsset({router:router, stateSetters:stateItemSetters})",
             "file" => "invoices-filters"
         ],  
         "users: Filter by user" => [
             "fe" => "filterByUser({router:router, stateSetters:stateItemSetters})",
             "file" => "invoices-filters"
         ]         
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         "credit-card: Add Payment" => [
             "fe" => "addInvoicePayments(invoicesNode?.record_id)",
             "be" => "addInvoicePayments()",
             "file" => "invoice-payments"
         ],
         "refresh: View Invoice payments" => [
             "fe" => "viewInvoicePayments(invoicesNode?.record_id)",
             "file" => "invoices-utils"
         ],
         "send: Send invoice" => [
             "fe" => "sendInvoice(invoicesNode)",
             "file" => "invoices-utils"
         ]          
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         "credit-card: Add Payment" => [
             "fe" => "addInvoicePayments(listinvoices_result.record_id)",
             "be" => "addInvoicePayments()",
             "file" => "invoice-payments"
         ],
         "refresh: View Invoice payments" => [
             "fe" => "viewInvoicePayments(listinvoices_result.record_id)",
             "file" => "invoices-utils"
         ],
         "send: Send invoice" => [
             "fe" => "sendInvoice(listinvoices_result)",
             "file" => "invoices-utils"
         ]           
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
   /*"relatedPayments"=>[
     "filter_str"=>"invoice_id='${invoicesNode?.record_id}'",
     "module_name"=>"Payments",
     "list_title"=>"Invoice Payments",
     "custom"=>false,
     "external"=>true,
     "alias"=>'payments'
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   /*"linkedClient"=>[
     "filter_str"=>"record_id='${invoicesNode?.client_id}'",
     "module_name"=>"Clients",
     "profile_title"=>"Client Profile",
     "custom"=>false,
     "external"=>true,
     "alias"=>'clients',      
     "list_table_name"=>"clients"
   ]*/
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup

  $override_def_col_size="col-md-6 hive_data_cell ";
  $override_segmentation_section_class="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="";
  ///=================================== basic template setup

?>
