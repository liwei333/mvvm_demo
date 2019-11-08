import { getValue } from "../util/ObjectUtil.js"
// 通过模板，找到那些节点用到了这个模板
//to -> 2 for -> 4
let template2Vnode = new Map();
// 通过节点，找到，这个节点下有哪些模板
let vnode2Template = new Map();

export function renderMixin(Due) {
    Due.prototype._render = function () {
        renderNode(this, this._vnode)
        //console.log(this);//this是一个Due对象
    }
}

export function renderData(vm, data) {
    //content
    let vnodes = template2Vnode.get(data);
    if (vnodes != null) {
        for (let i = 0; i < vnodes.length; i++) {
            renderNode(vm, vnodes[i]);
        }
    }
}
//如果传经来的是文本节点我就渲染它，如果不是那我就向下递归
export function renderNode(vm, vnode) {//希望调用一个方法就能进行渲染
    if (vnode.nodeType == 3) { //是个文本节点
        let templates = vnode2Template.get(vnode);
        if (templates) {
            let result = vnode.text;
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);//当前节点的参数，可以来自于Due对象，也可以来自于父级节点
                if (templateValue) {
                    result = result.replace("{{" + templates[i] + "}}", templateValue);
                }
            }
            vnode.elm.nodeValue = result; //node.nodeValue 节点的内容
        }
    } else if (vnode.nodeType == 1 && vnode.tag == "INPUT") {
        let templates = vnode2Template.get(vnode);
        if (templates) {
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);
                if (templateValue) {
                    vnode.elm.value = templateValue;
                }
            }
        }
    } else {
        for (let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i]);
        }
    }
}
export function prepareRender(vm, vnode) {

    if (vnode == null) {
        return;
    }
    if (vnode.nodeType == 3) {//3是个文本节点
        analysisTemplateString(vnode)
    }
    if (vnode.nodeType == 0) {//表示虚拟节点
        setTemplate2Vnode( vnode.data, vnode);
        setVnode2Template( vnode.data, vnode);
    }
    analysisAttr(vm, vnode);
    //nodeType == 1是标签
    for (let i = 0; i < vnode.children.length; i++) {
        prepareRender(vm, vnode.children[i]);

    }
}

function analysisTemplateString(vnode) {//分析
    let templateStrList = vnode.text.match(/{{[a-zA-Z0-9_.]+}}/g)
    for (let i = 0; templateStrList && i < templateStrList.length; i++) {
        setTemplate2Vnode(templateStrList[i], vnode);
        setVnode2Template(templateStrList[i], vnode)
    }

}
function setTemplate2Vnode(template, vnode) {//模板到节点的映射
    let templateName = getTemplateName(template);
    let vnodeSet = template2Vnode.get(templateName);
    if (vnodeSet) {
        vnodeSet.push(vnode);
    } else {
        template2Vnode.set(templateName, [vnode]);
    }
}
function setVnode2Template(template, vnode) {//节点到模板
    let templateSet = vnode2Template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)]);
    }
}
function getTemplateName(template){//解掉花括号
    //判断是否有花括号，如果有，则解掉，如果没有则直接返回
    if(template.substring(0,2) == "{{"&&template.substring(template.length-2,template.length)=="}}"){//代表有花括号
            return template.substring(2,template.length-2);
    }else{
        return template;
    }
}
export function getTemplate2VnodeMap() {//测试方法
    return template2Vnode;
}

export function getVnode2TemplateMap() {//测试方法
    return vnode2Template;
}


function getTemplateValue(objs, templateName) {//为什么是objs，因为是一个预留
    for (let i = 0; i < objs.length; i++) {
        let temp = getValue(objs[i], templateName);
        if (temp != null) {
            return temp;
        }
    }
    return null;
}
function analysisAttr(vm, vnode) {
    if (vnode.nodeType != 1) {
        return;
    }
    let attrNames = vnode.elm.getAttributeNames();
    if (attrNames.indexOf("v-model") > -1) {
        setTemplate2Vnode(vnode.elm.getAttribute("v-model"), vnode);
        setVnode2Template(vnode.elm.getAttribute("v-model"), vnode);
    }
}
export function getVNodeByTemplate(template) {
    return template2Vnode.get(template);
}
export function clearMap() {
    template2Vnode.clear();
    vnode2Template.clear();
}