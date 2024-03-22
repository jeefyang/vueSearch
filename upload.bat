@echo off

@echo %~dp0

::  - 用于触发`upload.py`的批处理,需要根据需求修改
::  - `%~dp0`:是为了兼容网络路径
::  - `--basedir`:遍历的文件夹,默认`./`
::  - `--outfile`:收集信息文件输出的文件名,默认`index.txt`,名字含有`_`将会自动分类,切记名字不能带中文
::  - `--httpurl`:上传的网络路径,默认`http://localhost:3007/uploadfile` 
start python %~dp0upload.py --basedir=%~dp0 --outfile=file.txt

@REM pause
@echo off