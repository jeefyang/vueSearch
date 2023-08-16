import requests
from codecs import encode
import os
import stat
import json
import sys,getopt


big_data:tuple[str]=[""]

def main(argv):
    http_url="http://localhost:3008/upload-avatar"
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
    loopFile(basedir)

    with open(os.path.join(basedir,outfile),"w")as file:
        file.write(big_data[0])
        file.close()
    
    post_data(http_url,os.path.join(basedir,outfile))


def post_data(http_url:str, file_url:str):
    files={"file":open(file_url,"rb")}
    res=requests.post(http_url,files=files)
    data = res.text
    print(data)


def loopFile(dir:str,relate_dir:str=""):
   
    files=os.listdir(dir)
    for file in files:
        new_url=os.path.join(dir,file)
        s=os.stat(new_url)
        relate_url=os.path.join(relate_dir,file)
        file_msg=""
        if stat.S_ISDIR(s.st_mode) is True:
            file_msg="0"+"*"+relate_url+"*"+str(s.st_size)+"*"+str(s.st_atime)+"*"+str(s.st_ctime)+"*"+str(s.st_mtime)+"|"
            # 测试
        elif stat.S_ISREG(s.st_mode) is True:
            file_msg="1"+"*"+relate_url+"*"+str(s.st_size)+"*"+str(s.st_atime)+"*"+str(s.st_ctime)+"*"+str(s.st_mtime)+"|"
            # 测试
        if file_msg!="":
            big_data[0]+=file_msg
        if stat.S_ISDIR(s.st_mode) is True:
            loopFile(new_url,relate_url)
    return

if __name__ == "__main__":
   main(sys.argv[1:])
   print('打完收工')


