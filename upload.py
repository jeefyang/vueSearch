import requests
from codecs import encode
import os
import stat
import json
import sys,getopt
from pathlib import Path


big_data:tuple[str]=[""]

def main(argv):
    http_url="http://localhost:3008/uploadfile"
    basedir="./"
    outfile="index.txt"

    opts,args=getopt.getopt(argv,"",['basedir=','outfile=',"httpurl="])
    for opt,arg in opts:
        if opt in ("--basedir"):
            basedir=arg
        elif opt in ("--outfile"):
            outfile=arg
        elif opt in ("--httpurl"):
            http_url=arg
    big_data[0]+="?"+basedir+"?"

    print(http_url)
    print(outfile)

    loopFile(basedir)
    with open(os.path.join(basedir,outfile),"w",encoding="utf-8")as file:
        file.write(big_data[0])
        file.close()

    post_data(http_url,os.path.join(basedir,outfile))


def post_data(http_url:str, file_url:str):
    files={"file":open(file_url,"rb")}
    res=requests.post(http_url,files=files)
    data = res.text
    print(data)


def loopFile(dir:str,relate_dir:str=""):
    print("正在遍历:",dir)
    filesys=os.scandir(dir)

    for entry in filesys:
        new_url=entry.path
        # s=os.stat(new_url)
        s=Path.stat(Path(new_url))
        relate_url=os.path.join(relate_dir,entry.name)
        file_msg=""
        if entry.is_dir() is True:
            file_msg="0"+"*"+relate_url+"*"+str(s.st_size)+"*"+str(s.st_atime)+"*"+str(s.st_ctime)+"*"+str(s.st_mtime)+"|"
            # 测试
        elif entry.is_file() is True:
            file_msg="1"+"*"+relate_url+"*"+str(s.st_size)+"*"+str(s.st_atime)+"*"+str(s.st_ctime)+"*"+str(s.st_mtime)+"|"
            # 测试
        if file_msg!="":
            big_data[0]+=file_msg
        if entry.is_dir() is True:
            loopFile(new_url,relate_url)
    filesys.close()
    return

if __name__ == "__main__":
   main(sys.argv[1:])
   print('打完收工')


