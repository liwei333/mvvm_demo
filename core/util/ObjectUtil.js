export function getValue(obj, name) {//key.a
    if (!obj) {
        return obj;
    }
    let nameList = name.split(".");
    let temp = obj;
    for (let i = 0; i < nameList.length; i++) {//for循环没循环一圈，属性就递进一层
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]];
        } else {
            return undefined;
        }
    }
    return temp;
}
//_data = {content:"panda",desc:"abcd"}
export function setValue(obj, data, value) {//那个对象，那个属性，值是什么
    if (!obj) {
        return;
    }
    let attrList = data.split(".");
    let temp = obj;
    for (let i = 0; i < attrList.length - 1; i++) {
        if (temp[attrList[i]]) {
            temp = temp[attrList[i]];
        } else {
            return;
        }
    }
    if (temp[attrList[attrList.length - 1]] != null) {
        temp[attrList[attrList.length - 1]] = value;
    }
}
//{a:1,b:2} {c:3,d:4} ->{a:1,b:2,c:3,d:4}
export function mergeAttr(obj1, obj2) {
    if (obj1 == null) {
        return clone(obj2);
    }
    if (obj2 == null) {
        return clone(obj1);
    }
    let result = {};
    let obj1Attrs = Object.getOwnPropertyNames(obj1);
    for (let i = 0; i < obj1Attrs.length; i++) {
        result[obj1Attrs[i]] = obj1[obj1Attrs[i]];

    }

    let obj2Attrs = Object.getOwnPropertyNames(obj2);
    for (let i = 0; i < obj2Attrs.length; i++) {
        result[obj2Attrs[i]] = obj2[obj2Attrs[i]]
    }
    return result;
}
export function easyclone(obj) {//无法合并代理对象，vm._data,
    JSON.parse(JSON.stringify(obj));
}
//这三段是经典的克隆算法
function clone(obj) {
    if (obj instanceof Array) {
        return cloneArray(obj);
    } else if (obj instanceof Object) {
        return cloneObject(obj);
    } else {
        return obj;
    }
}
//Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
function cloneObject(obj) {
    let result = {};
    let names = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < names.length; i++) {
        result[names[i]] = clone(obj[names[i]]);//递归
    }
    return result;
}
function cloneArray(obj) {
    let result = new Array(obj.length);
    for (let i = 0; i < obj.length; i++) {
        result[i] = clone(obj[i]);
    }
    return result;
}
export function getEnvAttr(vm,vnode){
    let result = mergeAttr(vm._data,vnode.env);
    result = mergeAttr(result,vm.computed);
    return result;
}