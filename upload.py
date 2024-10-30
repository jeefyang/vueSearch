import requests
from codecs import encode
import os
import stat
import json
import sys
import getopt
from pathlib import Path
import re
import fnmatch


ignore_data: list[str] = []


def main(argv):
    global ignore_data

    basedir = "./"
    http_url = "http://localhost:3008/uploadfile"

    outfile = "index.txt"
    ignorefile = ""
    argliststr: str = ""

    opts, args = getopt.getopt(
        argv, "", ['basedir=', 'outfile=', "httpurl=", "ignorefile=", 'arglist='])
    for opt, arg in opts:
        if opt in ("--arglist"):
            argliststr = arg
        elif opt in ("--basedir"):
            basedir = arg
        elif opt in ("--outfile"):
            outfile = arg
        elif opt in ("--httpurl"):
            http_url = arg
        elif opt in ("--ignorefile"):
            ignorefile = arg

    print("忽略文件:"+ignorefile)

    if ignorefile is not "":
        with open(ignorefile, "r", encoding="utf-8")as f:
            ignore_data = f.read().splitlines()
            

    if argliststr is not "" :
        arglist=argliststr.split(',')
        for i in range(0,len(arglist),2):
            once_main(http_url,arglist[i],arglist[i+1])
            pass
    else:
        once_main(http_url, basedir, outfile)
    pass


def once_main(http_url: str, basedir: str, outfile: str):

    print("基础路径:"+basedir)
    print("上传路径:"+http_url)
    print("输出文件名:"+outfile)

    big_data: list[str] = [""]
    big_data[0] += "?"+basedir+"?"

    loopFile(big_data, basedir)
    with open(os.path.join(basedir, outfile), "w", encoding="utf-8")as file:
        file.write(big_data[0])
        file.close()

    post_data(http_url, os.path.join(basedir, outfile))
    pass


def post_data(http_url: str, file_url: str):
    files = {"file": open(file_url, "rb")}
    res = requests.post(http_url, files=files)
    data = res.text
    print(data)


def check_ignore(n: str):

    for k in ignore_data:
        if fnmatch.fnmatch(n, k):
            return True
    return False


def loopFile(big_data: list[str], dir: str, relate_dir: str = ""):
    print("正在遍历:", dir)
    filesys = os.scandir(dir)

    for entry in filesys:
        new_url = entry.path
        relate_url = os.path.join(relate_dir, entry.name)
        if check_ignore(relate_url):
            continue
        # s=os.stat(new_url)
        s = Path.stat(Path(new_url))

        file_msg = ""
        if entry.is_dir() is True:
            file_msg = "0"+"*"+relate_url+"*" + \
                str(s.st_size)+"*"+str(s.st_atime)+"*" + \
                str(s.st_ctime)+"*"+str(s.st_mtime)+"|"
            # 测试
        elif entry.is_file() is True:
            file_msg = "1"+"*"+relate_url+"*" + \
                str(s.st_size)+"*"+str(s.st_atime)+"*" + \
                str(s.st_ctime)+"*"+str(s.st_mtime)+"|"
            # 测试
        if file_msg != "":
            big_data[0] += file_msg
        if entry.is_dir() is True:
            loopFile(big_data, new_url, relate_url)
            pass
    filesys.close()
    return


if __name__ == "__main__":
    main(sys.argv[1:])
    print('打完收工')
