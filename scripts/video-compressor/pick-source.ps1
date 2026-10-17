Add-Type -AssemblyName System.Windows.Forms
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
$dialog = New-Object System.Windows.Forms.OpenFileDialog
$dialog.Title = 'Solva Academy - Choose the original video'
$dialog.Filter = 'Video files|*.mp4;*.mov;*.mkv;*.webm;*.avi;*.m4v|All files|*.*'
$dialog.Multiselect = $false
$dialog.CheckFileExists = $true
$owner = New-Object System.Windows.Forms.Form
$owner.TopMost = $true
$owner.ShowInTaskbar = $false
$owner.StartPosition = [System.Windows.Forms.FormStartPosition]::CenterScreen
$owner.Size = New-Object System.Drawing.Size(1, 1)
$owner.Opacity = 0
try {
  $owner.Show()
  $owner.Activate()
  $owner.BringToFront()
  [System.Windows.Forms.Application]::DoEvents()
  if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) {
    ConvertTo-Json -Compress -InputObject @{ path = $dialog.FileName }
  } else {
    ConvertTo-Json -Compress -InputObject @{ cancelled = $true }
  }
} finally {
  $owner.Close()
  $dialog.Dispose()
  $owner.Dispose()
}
