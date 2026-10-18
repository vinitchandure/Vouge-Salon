$port = 8080
$path = $PSScriptRoot
if (-not $path) { $path = (Get-Location).Path }

$listener = New-Object System.Net.HttpListener

for ($p = 8080; $p -le 8090; $p++) {
    try {
        $prefix = "http://localhost:$p/"
        $testListener = New-Object System.Net.HttpListener
        $testListener.Prefixes.Add($prefix)
        $testListener.Start()
        $listener = $testListener
        $port = $p
        break
    } catch {
        # port busy, try next
    }
}

if (-not $listener.IsListening) {
    Write-Error "Could not start HttpListener on any port between 8080 and 8090"
    exit 1
}

Write-Output "====================================================="
Write-Output " VOGUE SALON Luxury Editorial Website Live Server"
Write-Output " Serving from: $path"
Write-Output " Access URL:   http://localhost:$port/"
Write-Output "====================================================="

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        $fullPath = [System.IO.Path]::GetFullPath((Join-Path $path $relPath))

        if ($fullPath.StartsWith($path) -and (Test-Path $fullPath -PathType Leaf)) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".json" { "application/json" }
                Default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1>")
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Ignore per-request aborts
    }
}
