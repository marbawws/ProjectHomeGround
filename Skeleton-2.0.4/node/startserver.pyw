import subprocess
si = subprocess.STARTUPINFO()
si.dwFlags |= subprocess.STARTF_USESHOWWINDOW
subprocess.call('node localhost.js', startupinfo=si)