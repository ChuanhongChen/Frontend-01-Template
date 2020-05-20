//有限状态机FSM处理字符串 ABCDEF
function matchViaFSM(string){
    let state = start;
    for(let c of string){
        state = state(c)
    }
    return state === end;
}
function start(c){
    if(c==="A"){
        return foundA;
    }
    else{
        return start;
    }
}
function foundA(c){
    if(c==="B"){
        return foundB;
    }
    else{
        return start;
    }
}
function foundB(c){
    if(c==="C"){
        return foundC;
    }
    else{
        return start;
    }
}
function foundC(c){
    if(c==="D"){
        return foundD;
    }
    else{
        return start;
    }
}
function foundD(c){
    if(c==="E"){
        return foundE
    }
    else{
        return start;
    }
}
function foundE(c){
    if(c==="F"){
        return end
    }
    else{
        return start;
    }
}
function end(c){
    return end;
}

console.error(matchViaFSM("GABCDEFG"))