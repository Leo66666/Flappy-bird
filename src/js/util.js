/*
 * @Date: 2019-12-23 10:28:01
 * @LastEditors  : 廖晨希
 * @Author: 廖晨希
 * @LastEditTime : 2019-12-23 11:40:46
 */
class Util{
    // 预加载资源
    preloadSource(obj,callback){
        let total =Object.keys(obj).length;
        let count=0;
        let imgs=[]
        for(let key in obj){
            let item=obj[key];
            let img=new Image();
            img.src=item;
            img.onload=()=>{
                count++;
                imgs[key]=img
                if(count===total){
                    config.imgList=imgs;
                    callback()
                }
            }
        }
    }

}
