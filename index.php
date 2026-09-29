<?php
declare(strict_types=1);

$builtPage = __DIR__ . '/dist/index.html';

if (!is_file($builtPage)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=UTF-8');
    echo "Portfolio build missing. Run npm install and npm run build in this folder.";
    exit;
}

$html = file_get_contents($builtPage);
if ($html === false) {
    http_response_code(500);
    exit;
}

// Vite builds relative asset URLs; Apache serves this page one directory above dist.
$html = str_replace('./assets/', 'dist/assets/', $html);

header('Content-Type: text/html; charset=UTF-8');
echo $html;
