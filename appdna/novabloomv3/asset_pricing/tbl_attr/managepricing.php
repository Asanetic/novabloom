<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, asset_id, pricing_type, price_model, amount, billing_cycle, status    
//important columns on profile : record_id, asset_id, pricing_type, price_model, amount, unit_price, currency, billing_cycle, effective_from, effective_to, status, created_at, updated_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages pricing configurations for assets. Each asset can have multiple pricing models
to support different billing strategies (one-time purchases, recurring subscriptions, usage-based,
tiered pricing, etc.). Pricing configurations control how much customers pay and when.

Key relationships:
- Links to assets via asset_id
- Referenced by subscriptions via pricing_id for recurring billing
- Referenced by order_items via pricing_id for one-time purchases
- Controls billing cycles and amounts
- Supports time-based pricing with effective_from and effective_to dates
- Enables flexible pricing strategies per asset

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of farmers please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="asset_pricing";
  $__page_title ="Manage Asset Pricing";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"managepricing",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"managepricing",
    "multigrid_col_span"=>"9"      

  ];
  
  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"asset_pricing" => ["asset_name", "asset_type", "total_subscriptions", "total_orders", "total_revenue", "is_active_now"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"status" => "checkblank(getarr_val_(\$asset_pricing_node,'status'),'active')"
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
            "asset_name" => [
                "function" => "await mosyQddata('assets', 'record_id', row?.asset_id)",
                "args" => [],
                "return" => "data_res?.asset_name"
            ],
            "asset_type" => [
                "function" => "await mosyQddata('assets', 'record_id', row?.asset_id)",
                "args" => [],
                "return" => "data_res?.asset_type"
            ],
            "total_subscriptions" => [
                "function" => "await mosyCountRows('subscriptions', `where pricing_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res?.total"
            ],
            "total_orders" => [
                "function" => "await mosyCountRows('order_items', `where pricing_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res?.total"
            ],
            "total_revenue" => [
                "function" => "await mosySumRows('order_items', 'total_price', `where pricing_id ='\${row?.record_id}'`)",
                "args" => [],
                "return" => "data_res?.total"
            ],
            "is_active_now" => [
                "function" => "new Date() >= new Date(row?.effective_from) && (!row?.effective_to || new Date() <= new Date(row?.effective_to)) ? 'Yes' : 'No'",
                "args" => [],
                "return" => "data_res"
            ]
        ]
    ],

//Table name : asset_pricing

// columns : "primkey" , "record_id" , "asset_id" , "pricing_type" , "price_model" , "amount" , "unit_price" , "currency" , "billing_cycle" , "effective_from" , "effective_to" , "status" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "model_name" , "model_features" , 


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "asset_pricing" => ["primkey","record_id","asset_id","model_name","model_features","pricing_type","price_model","amount","unit_price","currency","billing_cycle","effective_from","effective_to","status","created_at","updated_at"]
        ],
//Table name : asset_pricing

// columns : "primkey" , "record_id" , "asset_id" , "pricing_type" , "price_model" , "amount" , "unit_price" , "currency" , "billing_cycle" , "effective_from" , "effective_to" , "status" , "created_at" , "updated_at" , "hive_site_id" , "hive_site_name" , "model_name" , "model_features" , 


        // Grouped inputs
        "form_input_segmentation_arr" => [
            "asset_pricing" => [
                "Model Details" => ["model_name","asset_id","pricing_type","price_model"],
                "Pricing Model" => ["amount","unit_price","currency"],
                "Billing Schedule" => ["billing_cycle","effective_from","effective_to","status"],
                "Features"=>["model_features"]
            ]
        ],

        "image_columns" => [],
        "default_col_class" => "col-md-6",
        "hidden_inputs" => ["asset_id"], 
        "print_tables" => ["asset_pricing"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name","created_at","updated_at"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","price_model","unit_price","currency","effective_from","effective_to","created_at","updated_at"], 
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["amount","unit_price"], 
        "textarea_array" => [], 
        "content_editable" => ["model_features"], 

        "static_drop_down_array" => [
            "pricing_type" => "one_time,recurring,usage_based,trial",
            "price_model" => "flat_rate,per_unit",
            "status" => "active,inactive,archived,expired"
        ],

        "dynamic_drop_down_array" => ["currency","billing_cycle"], // if its here dont add it to connection_cols and vice versa 
        "password_columns" => [], 
        "title_columns" => ["record_id"], 
        "date_columns" => ["effective_from","effective_to"],
        "datetime_columns" => ["created_at","updated_at"],

        "rename_cols_array" => [ 
            "asset_id" => "Asset",
            "pricing_type" => "Pricing Type",
            "price_model" => "Price Model",
            "amount" => "Amount",
            "unit_price" => "Unit Price",
            "currency" => "Currency",
            "billing_cycle" => "Billing Cycle:col-md-3",
            "effective_from" => "Effective From:col-md-3",
            "effective_to" => "Effective To:col-md-3",
            "status" => "Status:col-md-3",
            "created_at" => "Created Date",
            "updated_at" => "Last Updated",
            "asset_name" => "Asset Name",
            "asset_type" => "Asset Type",
            "total_subscriptions" => "Active Subscriptions",
            "total_orders" => "Total Orders",
            "total_revenue" => "Total Revenue",
            "is_active_now" => "Currently Active"
        ],

        "rename_tables_array" => [
            "asset_pricing" => "Asset Pricing"
        ],

        "new_label_buttons_arr" => [ 
            "asset_pricing" => "tag:New asset pricing plan:{`\${asset_pricingNode?._assets_asset_name_asset_id} pricing / \${asset_pricingNode?.model_name}`}" // node formart tablenameNode eg acc_renewalsNode
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "asset_pricing"=>["csv"=>"asset_id,pricing_type,price_model,amount,unit_price,currency,billing_cycle,effective_from,effective_to,status","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
          
       "add_grid_check_boxes"=>[
          "asset_pricing_list"=>"loadPricing()"
        ],
      
        "custom_query_line_cols" => [], 
      
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          "pricing_subscriptions"=>[
            "table"=>"subscriptions",
            "link"=>"subscriptions_list",
            "query"=>"pricing_id='{{record_id}}'",
            "title"=>"Subscriptions Using This Pricing",
            "columns"=>["record_id","account_id","status","start_date","next_billing_date","amount","currency"]
          ],
          "pricing_orders"=>[
            "table"=>"order_items",
            "link"=>"order_items_list",
            "query"=>"pricing_id='{{record_id}}'",
            "title"=>"Orders Using This Pricing",
            "columns"=>["record_id","order_id","quantity","unit_price","total_price"]
          ]
        ], 
        "custom_profile_col_data" => [], 
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "asset_id" => "assets:record_id:asset_name:apiRoutes.digitalassetlist.base"
        ]
    ]
  
  ];

  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
        /* "filter: Filter by Pricing Type" => [
             "fe" => "filterByPricingType()",
             "be" => "filterByPricingType()",
             "file" => "pricing-filters"
         ],*/

      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
        /* "check-circle: Activate Pricing" => [
             "fe" => "activatePricing()",
             "be" => "activatePricing()",
             "file" => "manage-pricing"
         ],*/



      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Details" => [
             "fe" => "viewPricingDetails()",
             "file" => "pricing-details"
         ]*/
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
  /* "pricingSubscriptions"=>[ 
     "filter_str"=>"pricing_id='\${assetpricingNode?.record_id}'",
     "module_name"=>"Subscriptions",
     "list_title"=>"Subscriptions Using This Pricing",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'subscriptions', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ],
   "pricingOrders"=>[ 
     "filter_str"=>"pricing_id='\${assetpricingNode?.record_id}'",
     "module_name"=>"OrderItems",
     "list_title"=>"Orders Using This Pricing",
     "event_name"=>"",
     "custom"=>false,
     "external"=>true,
     "alias"=>'order_items', 
     "event_name"=>"",
     "event_path"=>"",
     "module_path"=>"",    
     "list_url"=>"",
     "profile_url"=>"",
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedAsset"=>[ 
     "filter_str"=>"record_id='{assetpricingNode?.asset_id}'",
     "module_name"=>"Assets",
     "profile_title"=>"Asset Details",
     "custom"=>false,
     "external"=>true,
     "alias"=>'assets',      
     "event_name"=>"",
     "event_path"=>"",
     "list_table_name"=>"assets",
   ]*/
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-12 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="rounded_avatar";
  ///=================================== basic template setup 

?>