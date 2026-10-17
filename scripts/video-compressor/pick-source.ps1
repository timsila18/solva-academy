Add-Type -AssemblyName System.Windows.Forms
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$dialog = New-Object System.Windows.Forms.OpenFileDialog
$dialog.Title = 'Solva Academy - Choose the original video'
$dialog.Filter = 'Video files|*.mp4;*.mov;*.mkv;*.webm;*.avi;*.m4v|All files|*.*'
$dialog.Multiselect = $false
$dialog.CheckFileExists = $true
$owner = New-Object System.Windows.Forms.Form
$owner.TopMost = $true
try {
  if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) {
    ConvertTo-Json -Compress -InputObject @{ path = $dialog.FileName }
  } else {
    ConvertTo-Json -Compress -InputObject @{ cancelled = $true }
  }
} finally {
  $dialog.Dispose()
  $owner.Dispose()
}
