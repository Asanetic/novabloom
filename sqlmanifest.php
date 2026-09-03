$module_manifest_sql = "
`primkey` int(255) PRIMARY KEY AUTO_INCREMENT,
`component_name` varchar(255) NOT NULL,
`module_key` varchar(255) NOT NULL,
`permission_type` varchar(100) NOT NULL,
`capability_key` varchar(255) NOT NULL,
`relative_path` varchar(500) NOT NULL
";

create_table($mysqliconn, $dbname, 'system_module_manifest_', $module_manifest_sql);


function buildModuleManifest($groupedModules)
{
    $manifest = [];

    foreach ($groupedModules as $moduleName => $files) {

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

            $manifest[] = [
                'module_key'     => strtoupper($moduleName),
                'component_name' => $componentName,
                'permission_type'=> $permissionType,
                'capability_key' => strtoupper($moduleName . '_' . $permissionType),
                'relative_path'  => $file['relative_path']
            ];
        }
    }

    return $manifest;
}


function saveModuleManifest($conn, $db, $manifest)
{
    foreach ($manifest as $row) {

        $module_key      = mysqli_real_escape_string($conn, $row['module_key']);
        $component_name  = mysqli_real_escape_string($conn, $row['component_name']);
        $permission_type = mysqli_real_escape_string($conn, $row['permission_type']);
        $capability_key  = mysqli_real_escape_string($conn, $row['capability_key']);
        $relative_path   = mysqli_real_escape_string($conn, $row['relative_path']);

        // prevent duplicates
        $check = mysqli_query($conn, "
            SELECT primkey FROM `$db`.`system_module_manifest_`
            WHERE component_name = '$component_name'
            LIMIT 1
        ");

        if (mysqli_num_rows($check) == 0) {

            mysqli_query($conn, "
                INSERT INTO `$db`.`system_module_manifest_`
                (module_key, component_name, permission_type, capability_key, relative_path)
                VALUES
                ('$module_key', '$component_name', '$permission_type', '$capability_key', '$relative_path')
            ");
        }
    }
}

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


$grouped  = getUiControlJsxFilesGrouped("../app/novabloomv3");
$manifest = buildModuleManifest($grouped);

saveModuleManifest($mysqliconn, $db, $manifest);

echo "Module manifest generated successfully.";


 