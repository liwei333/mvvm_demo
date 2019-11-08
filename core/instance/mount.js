import VNode from "../vdom/vnode.js";
import { prepareRender, getVNodeByTemplate, clearMap, renderData } from "./render.js"
import { vmodel } from "./grammer/vmodel.js";
import { mergeAttr } from "../util/ObjectUtil.js"
import { vforInit } from "./grammer/vfor.js"
import { checkVBind } from "./grammer/vbind.js";
import { checkVOn } from "./grammer/von.js";
export function initMount(Due) {//可以通过$mount方式挂载
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}

export function mount(vm, elm) {
    //进行挂载
    vm._vnode = constructVNode(vm, elm, null);
    // console.log(vm._vnode)
    //进行预备渲染(建立渲染索引，通过模板找vnode,通过vnode找模板)
    prepareRender(vm, vm._vnode);
    // console.log(getTemplate2VnodeMap());
    // console.log(getVnode2TemplateMap());

}
function constructVNode(vm, elm, parent) {//深度优化搜索  构建虚拟dom树
    let vnode = analysisAttr(vm, elm, parent);
    if (vnode == null) {
        let children = [];
        let text = getNodeText(elm);
        let data = null;
        let nodeType = elm.nodeType;
        let tag = elm.nodeName;
        let key = null;
        vnode = new VNode(tag, elm, children, text, data, parent, nodeType, key);
        if (elm.nodeType == 1 && elm.getAttribute("env")) {
            vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute("env")));
        } else {
            vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
        }
    }
    checkVBind(vm,vnode);
    checkVOn(vm,vnode);
    //childNodes子节点们
    let childs = vnode.nodeType == 0 ? vnode.parent.elm.childNodes : vnode.elm.childNodes;
    let len = vnode.nodeType == 0 ? vnode.parent.elm.childNodes.length : vnode.elm.childNodes.length;
    for (let i = 0; i < len; i++) {
        //递归深度优先搜索

        let childNodes = constructVNode(vm, childs[i], vnode);

        if (childNodes instanceof VNode) {//返回单一节点的时候

            vnode.children.push(childNodes);
        } else {//返回节点数组
            vnode.children = vnode.children.concat(childNodes);

        }

    }
    return vnode;

}
function getNodeText(elm) {
    if (elm.nodeType == 3) {
        return elm.nodeValue;
    } else {
        return "";
    }
}
//解析指令
function analysisAttr(vm, elm, parent) {
    if (elm.nodeType == 1) {
        let attrNames = elm.getAttributeNames();
        if (attrNames.indexOf("v-model") > -1) {
            vmodel(vm, elm, elm.getAttribute("v-model"));
        }
        if (attrNames.indexOf("v-for") > -1) {//(key) in list
            return vforInit(vm, elm, parent, elm.getAttribute("v-for"));
        }
    }
}
export function rebuild(vm, template) {
    let virtualNode = getVNodeByTemplate(template);//找到对应的虚拟节点
    for (let i = 0; i < virtualNode.length; i++) {
        virtualNode[i].parent.elm.innerHTML = "";
        virtualNode[i].parent.elm.appendChild(virtualNode[i].elm);
        let result = constructVNode(vm, virtualNode[i].elm, virtualNode[i].parent);
        virtualNode[i].parent.children = [result];
        clearMap();
        prepareRender(vm, vm._vnode);
        renderData(vm, vm._vnode);
    }
}
