//有限状态机FSM处理字符串 ABCABX
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
    if(c==="A"){
        return foundA2;
    }
    else{
        return start;
    }
}
function foundA2(c){
    if(c==="B"){
        return foundB2
    }
    else{
        return start;
    }
}
function foundB2(c){
    if(c==="X"){
        return end
    }
    else{//处理ABCABCABX的情况
        return foundB(c);
    }
}
function end(c){
    return end;
}

console.error(matchViaFSM("GABCDEFG"))