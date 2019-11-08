
let number = 1;
export default class VNode {//虚拟节点一个虚拟节点和一个真实节点相互对应
    constructor(tag,//标签类型，DIV,SPAN,INPUT
        elm,//对应的真实节点
        children,//当前节点下的子节点
        text,//当前节点下的文本
        data,//VNodeData,暂时保留,暂无意义
        parent,//父级节点
        nodeType,//节点类型

    ) {
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {};//当前节点的环境变量
        this.instructions = null;//存放指令
        this.template = [];//当前节点涉及到的模板
        this.number = number ++;//给每一个节点一个标识
    }
}