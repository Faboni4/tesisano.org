$ErrorActionPreference = "Stop"

$path = Join-Path $PSScriptRoot "data.js"
$newPath = Join-Path $PSScriptRoot "data_new.js"
$imgDir = Join-Path $PSScriptRoot "public\images"

Write-Host "Starting extraction..."

if (!(Test-Path $imgDir)) { 
    Write-Host "Creating $imgDir"
    New-Item -Path $imgDir -ItemType Directory -Force | Out-Null 
}

if (!(Test-Path $path)) {
    Write-Error "File data.js not found at $path"
}

Write-Host "Reading data.js (this may take a moment)..."
# Read file as single string
$content = [System.IO.File]::ReadAllText($path)

$script:counter = 0

# Define the regex to find base64 images
$pattern = "data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=]+)"
$regex = [regex]::new($pattern)

# Define the callback for replacement
$evaluator = { param($match) 
    $script:counter++
    
    $ext = $match.Groups[1].Value
    $b64 = $match.Groups[2].Value
    
    $fileName = "image_$($script:counter).$ext"
    $fullPath = Join-Path $imgDir $fileName
    
    try {
        $bytes = [System.Convert]::FromBase64String($b64)
        [System.IO.File]::WriteAllBytes($fullPath, $bytes)
    } catch {
        Write-Warning "Failed to save $fileName"
    }
    
    # Return the replacement string
    return "/public/images/$fileName"
}

Write-Host "Extracting images and replacing content..."
# Perform the replacement
$newContent = $regex.Replace($content, $evaluator)

Write-Host "Writing data_new.js..."
[System.IO.File]::WriteAllText($newPath, $newContent)

Write-Host "Extraction complete!"
Write-Host "Total images extracted: $script:counter"
Write-Host "New file saved to: $newPath"
