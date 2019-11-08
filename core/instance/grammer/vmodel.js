import {setValue} from "../../util/ObjectUtil.js"
export function vmodel(vm,elm,data){//元素，对象，对应的属性
    elm.onchange = function(event){
        setValue(vm._data,data,elm.value);//vue对象,该元素绑定的属性，该元素的新value
    }
}