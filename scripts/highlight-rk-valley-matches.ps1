param(
    [string]$InputPath = "C:\Users\priya\OneDrive\Desktop\RK Valley Ranch LLC.xls",
    [string]$OutputDir = "D:\AI_Integration\AI_Resume_Generator\resume_generator\outputs\rk-valley-ranch",
    [string]$OutputFileName = "RK Valley Ranch LLC - matched highlighted.xlsx",
    [string]$Sheet2StoreFilter = "",
    [switch]$DeleteNonMatchingSheet2StoreRows
)

$ErrorActionPreference = "Stop"

$inputPath = $InputPath
$outputDir = $OutputDir
$outputPath = Join-Path $outputDir $OutputFileName

New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

function Get-NormalizedAmount($value) {
    if ($null -eq $value -or $value -eq "") {
        return "0.00"
    }

    $text = ([string]$value).Replace("$", "").Replace(",", "").Trim()
    if ($text -eq "") {
        return "0.00"
    }

    return ([math]::Round([double]$text, 2)).ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture)
}

function Get-NormalizedCheck($value) {
    if ($null -eq $value) {
        return ""
    }

    return ([string]$value).Trim()
}

function Get-NormalizedDate($value) {
    if ($null -eq $value -or $value -eq "") {
        return ""
    }

    if ($value -is [double] -or $value -is [int]) {
        return ([datetime]::FromOADate([double]$value)).ToString("yyyy-MM-dd")
    }

    try {
        return ([datetime]$value).ToString("yyyy-MM-dd")
    }
    catch {
        return ([string]$value).Trim()
    }
}

function Get-MatchKey($postDate, $checkNo, $debit, $credit) {
    $normalizedDate = Get-NormalizedDate $postDate
    $normalizedDebit = Get-NormalizedAmount $debit
    $normalizedCredit = Get-NormalizedAmount $credit
    $normalizedCheck = Get-NormalizedCheck $checkNo
    return "$normalizedDate|$normalizedCheck|$normalizedDebit|$normalizedCredit"
}

$excel = $null
$workbook = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false

    $workbook = $excel.Workbooks.Open($inputPath)
    $sheet1 = $workbook.Worksheets.Item("Sheet1")
    $sheet2 = $workbook.Worksheets.Item("Sheet2")

    if ($Sheet2StoreFilter -ne "" -and $DeleteNonMatchingSheet2StoreRows) {
        $initialSheet2Rows = $sheet2.UsedRange.Rows.Count
        for ($row = $initialSheet2Rows; $row -ge 2; $row--) {
            $store = ([string]$sheet2.Cells.Item($row, 2).Text).Trim()
            if ($store -ine $Sheet2StoreFilter) {
                $sheet2.Rows.Item($row).Delete() | Out-Null
            }
        }
    }

    $sheet1Rows = $sheet1.UsedRange.Rows.Count
    $sheet2Rows = $sheet2.UsedRange.Rows.Count
    $sheet1Cols = $sheet1.UsedRange.Columns.Count
    $sheet2Cols = $sheet2.UsedRange.Columns.Count

    $green = 5296274
    $sheet1.Range($sheet1.Cells.Item(2, 1), $sheet1.Cells.Item($sheet1Rows, $sheet1Cols)).Interior.Pattern = -4142
    $sheet2.Range($sheet2.Cells.Item(2, 1), $sheet2.Cells.Item($sheet2Rows, $sheet2Cols)).Interior.Pattern = -4142

    $sheet1MatchesByKey = @{}
    for ($row = 2; $row -le $sheet1Rows; $row++) {
        $postDate = $sheet1.Cells.Item($row, 2).Value2
        $checkNo = $sheet1.Cells.Item($row, 3).Text
        $debit = $sheet1.Cells.Item($row, 5).Value2
        $credit = $sheet1.Cells.Item($row, 6).Value2
        $key = Get-MatchKey $postDate $checkNo $debit $credit

        if (-not $sheet1MatchesByKey.ContainsKey($key)) {
            $sheet1MatchesByKey[$key] = New-Object System.Collections.Queue
        }
        $sheet1MatchesByKey[$key].Enqueue($row)
    }

    $matchedPairs = 0
    for ($row = 2; $row -le $sheet2Rows; $row++) {
        if ($Sheet2StoreFilter -ne "") {
            $store = ([string]$sheet2.Cells.Item($row, 2).Text).Trim()
            if ($store -ine $Sheet2StoreFilter) {
                continue
            }
        }

        $postDate = $sheet2.Cells.Item($row, 5).Value2
        $checkNo = $sheet2.Cells.Item($row, 6).Text
        $credit = $sheet2.Cells.Item($row, 8).Value2
        $debit = $sheet2.Cells.Item($row, 9).Value2
        $key = Get-MatchKey $postDate $checkNo $debit $credit

        if ($sheet1MatchesByKey.ContainsKey($key) -and $sheet1MatchesByKey[$key].Count -gt 0) {
            $sheet1Row = $sheet1MatchesByKey[$key].Dequeue()
            $sheet1.Range($sheet1.Cells.Item($sheet1Row, 1), $sheet1.Cells.Item($sheet1Row, $sheet1Cols)).Interior.Color = $green
            $sheet2.Range($sheet2.Cells.Item($row, 1), $sheet2.Cells.Item($row, $sheet2Cols)).Interior.Color = $green
            $matchedPairs++
        }
    }

    if (Test-Path -LiteralPath $outputPath) {
        Remove-Item -LiteralPath $outputPath -Force
    }

    $workbook.SaveAs($outputPath, 51)
    [PSCustomObject]@{
        Output = $outputPath
        Sheet1Rows = $sheet1Rows - 1
        Sheet2Rows = $sheet2Rows - 1
        MatchedPairs = $matchedPairs
        Sheet2StoreFilter = $Sheet2StoreFilter
    } | Format-List
}
finally {
    if ($null -ne $workbook) {
        $workbook.Close($false)
    }
    if ($null -ne $excel) {
        $excel.Quit()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
