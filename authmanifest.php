function getUiControlJsxFilesGrouped($basePath)
{
    $results = [];

    if (!is_dir($basePath)) {
        return $results;
    }

    $basePath = rtrim(str_replace('\\', '/', $basePath), '/');

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($basePath, RecursiveDirectoryIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {

        if (!$file->isFile()) {
            continue;
        }

        $filePath = str_replace('\\', '/', $file->getPathname());

        // Must contain /uiControl/
        if (!preg_match('/\/uicontrol\//i', $filePath)) {
            continue;
        }

        // Must be .jsx
        if (strtolower($file->getExtension()) !== 'jsx') {
            continue;
        }

        // Remove base path
        $relativePart = substr($filePath, strlen($basePath));
        $relativePart = ltrim($relativePart, '/');

        // Skip root-level UiControl
        if (preg_match('/^uicontrol\//i', $relativePart)) {
            continue;
        }

        // Extract module name (first folder)
        $parts = explode('/', $relativePart);
        $moduleName = $parts[0];

        $cleanPath = $basePath . '/' . $relativePart;

        $results[$moduleName][] = [
            'file_name'     => $file->getFilename(),
            'absolute_path' => $cleanPath,
            'relative_path' => $relativePart
        ];
    }

    return $results;
}


function buildModuleManifest($groupedModules)
{
    $manifest = [];

    foreach ($groupedModules as $moduleName => $files) {

        $manifest[$moduleName] = [
            'module_key' => strtoupper($moduleName),
            'description' => ucfirst(str_replace('_', ' ', $moduleName)) . ' module',
            'pages' => []
        ];

        foreach ($files as $file) {

            $fileName = $file['file_name'];
            $componentName = str_replace('.jsx', '', $fileName);

            $permissionType = 'UNKNOWN';

            if (stripos($componentName, 'List') !== false) {
                $permissionType = 'VIEW';
            }

            if (stripos($componentName, 'Profile') !== false) {
                $permissionType = 'MANAGE';
            }

            $manifest[$moduleName]['pages'][] = [
                'component' => $componentName,
                'permission_type' => $permissionType,
                'capability_key' => strtoupper($moduleName . '_' . $permissionType)
            ];
        }
    }

    return $manifest;
}



$grouped = getUiControlJsxFilesGrouped("../app/novabloomv3");
$manifest = buildModuleManifest($grouped);

print_r($manifest);


Array
(
    [assets] => Array
        (
            [module_key] => ASSETS
            [description] => Assets module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => DigitalassetlistList
                            [permission_type] => VIEW
                            [capability_key] => ASSETS_VIEW
                        )

                    [1] => Array
                        (
                            [component] => DigitalassetlistProfile
                            [permission_type] => MANAGE
                            [capability_key] => ASSETS_MANAGE
                        )

                )

        )

    [asset_pricing] => Array
        (
            [module_key] => ASSET_PRICING
            [description] => Asset pricing module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => AssetpricingList
                            [permission_type] => VIEW
                            [capability_key] => ASSET_PRICING_VIEW
                        )

                    [1] => Array
                        (
                            [component] => AssetpricingProfile
                            [permission_type] => MANAGE
                            [capability_key] => ASSET_PRICING_MANAGE
                        )

                )

        )

    [invoices] => Array
        (
            [module_key] => INVOICES
            [description] => Invoices module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => InvoicesList
                            [permission_type] => VIEW
                            [capability_key] => INVOICES_VIEW
                        )

                    [1] => Array
                        (
                            [component] => InvoicesProfile
                            [permission_type] => MANAGE
                            [capability_key] => INVOICES_MANAGE
                        )

                )

        )

    [managepricing] => Array
        (
            [module_key] => MANAGEPRICING
            [description] => Managepricing module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => ManageassetpricingList
                            [permission_type] => VIEW
                            [capability_key] => MANAGEPRICING_VIEW
                        )

                    [1] => Array
                        (
                            [component] => ManageassetpricingProfile
                            [permission_type] => MANAGE
                            [capability_key] => MANAGEPRICING_MANAGE
                        )

                )

        )

    [messages] => Array
        (
            [module_key] => MESSAGES
            [description] => Messages module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => SentmessagesList
                            [permission_type] => VIEW
                            [capability_key] => MESSAGES_VIEW
                        )

                    [1] => Array
                        (
                            [component] => SentmessagesProfile
                            [permission_type] => MANAGE
                            [capability_key] => MESSAGES_MANAGE
                        )

                )

        )

    [orders] => Array
        (
            [module_key] => ORDERS
            [description] => Orders module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => OrdersList
                            [permission_type] => VIEW
                            [capability_key] => ORDERS_VIEW
                        )

                )

        )

    [payments] => Array
        (
            [module_key] => PAYMENTS
            [description] => Payments module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => PaymentsList
                            [permission_type] => VIEW
                            [capability_key] => PAYMENTS_VIEW
                        )

                    [1] => Array
                        (
                            [component] => PaymentsProfile
                            [permission_type] => MANAGE
                            [capability_key] => PAYMENTS_MANAGE
                        )

                )

        )

    [subscriptions] => Array
        (
            [module_key] => SUBSCRIPTIONS
            [description] => Subscriptions module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => SelectsubscriptiontoinvoiceList
                            [permission_type] => VIEW
                            [capability_key] => SUBSCRIPTIONS_VIEW
                        )

                    [1] => Array
                        (
                            [component] => SelectsubscriptiontoinvoiceProfile
                            [permission_type] => MANAGE
                            [capability_key] => SUBSCRIPTIONS_MANAGE
                        )

                    [2] => Array
                        (
                            [component] => SubscriptionsList
                            [permission_type] => VIEW
                            [capability_key] => SUBSCRIPTIONS_VIEW
                        )

                    [3] => Array
                        (
                            [component] => SubscriptionsProfile
                            [permission_type] => MANAGE
                            [capability_key] => SUBSCRIPTIONS_MANAGE
                        )

                )

        )

    [users] => Array
        (
            [module_key] => USERS
            [description] => Users module
            [pages] => Array
                (
                    [0] => Array
                        (
                            [component] => ActiveappusersList
                            [permission_type] => VIEW
                            [capability_key] => USERS_VIEW
                        )

                    [1] => Array
                        (
                            [component] => ActiveappusersProfile
                            [permission_type] => MANAGE
                            [capability_key] => USERS_MANAGE
                        )

                    [2] => Array
                        (
                            [component] => InactiveusersList
                            [permission_type] => VIEW
                            [capability_key] => USERS_VIEW
                        )

                    [3] => Array
                        (
                            [component] => InactiveusersProfile
                            [permission_type] => MANAGE
                            [capability_key] => USERS_MANAGE
                        )

                    [4] => Array
                        (
                            [component] => PlatformuserlistList
                            [permission_type] => VIEW
                            [capability_key] => USERS_VIEW
                        )

                    [5] => Array
                        (
                            [component] => PlatformuserlistProfile
                            [permission_type] => MANAGE
                            [capability_key] => USERS_MANAGE
                        )

                )

        )

)

 