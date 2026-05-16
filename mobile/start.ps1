$fnm = "C:\Users\AjayKumarMAQSoftware\AppData\Local\Microsoft\WinGet\Packages\Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe\fnm.exe"
& $fnm env --use-on-cd | Out-String | Invoke-Expression
& $fnm use 20.11.0
npx expo start
