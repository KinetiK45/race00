const current_result = document.getElementById('result');
const history = document.getElementById('history');
const operations = [
    { symbol: '+', func: Addition, priority: 3, position: 'after' },
    { symbol: '-', func: subtracting, priority: 3, position: 'after' },
    { symbol: '*', func: multiplication, priority: 2, position: 'after' },
    { symbol: '÷', func: division, priority: 2, position: 'after' },
    { symbol: '%', func: percent, priority: 1, position: 'after' },
    { symbol: '!', func: factorial, priority: 1, position: 'after' },
    { symbol: '^', func: exponent, priority: 1, position: 'after' },
    { symbol: '√', func: square_root, priority: 1, position: 'before' },
    { symbol: '∛', func: cube_root, priority: 1, position: 'before' },
    { symbol: '(', func: change_priority_before, priority: 0, position: 'before' },
    { symbol: ')', func: change_priority_after, priority: 0, position: 'after' }
];
show_convert();

const self_operations = ['%', '!', '(', ')'];

let current_number = '';
let task = [];

document.querySelectorAll('.button.number').forEach((element) => {
    element.addEventListener('click', () => {
        if (Math.abs(Number(current_number)) === 3.1415){
            return;
        }
        if (element.textContent === '000' && (current_number === '0' || current_number === '')) {
            return;
        }
        if (task.length !== 0 && Number(task[task.length-1])){
            task = [];
            current_result.textContent = '';
            current_number = '';
        }
        if (current_result.textContent === '0'){
            current_result.textContent = '';
            current_number = '';
            task = [];
        }
        if (element.textContent === '.' && current_number === ''){
            current_number += '0';
            add_symbol('0');
        }
        if (element.textContent === '.' && current_number.includes('.')) {
            return;
        }
        if (element.textContent === 'π'){
            if (current_number === '' && task.length === 0){
                current_result.textContent += 'π';
                current_number = '3.1415';
            }
            else if (current_number === '' && typeof task[task.length-1] !== 'number'){
                current_result.textContent += 'π';
                current_number = '3.1415';
            }
            return;
        }
        current_number += element.textContent;
        add_symbol(element.textContent);
    });
});

document.querySelectorAll('.button.operation').forEach((element) => {
    element.addEventListener('click', () => {
        if (can_do_operation(element.textContent)){
            let operation = get_operation(element.textContent);
            add_symbol(operation.symbol);
            current_number = '';
            task.push(element.textContent);
        }
    });
});

function can_do_operation(operation_symbol){
    if (current_number !== '' && get_operation(operation_symbol).position !== 'before'){
        if (!(task.length !== 0 && Number(task[task.length-1]))){
            task.push(Number(current_number));
        }
        return true;
    }
    let operation = get_operation(operation_symbol);
    if (operation.position === 'before'){
        if (task.length === 0 && current_number === ''){
            if (current_result.textContent === '0')
                current_result.textContent = '';
            return true;
        }
        else if (task.length === 0 && current_result.textContent === '-'){
            task.push(0);
            task.push('-');
            return true;
        }
        if (get_operation(task[task.length-1])){
            let operation_before = get_operation(task[task.length-1]);
            if (current_number === '-0'){
                task.push(0);
                task.push('-');
                return true;
            }
            if (operation_before.position === 'after'){
                if (current_result.textContent === '0')
                    current_result.textContent = '';
                return true;
            }
            else if (operation_before.position === 'before'){
                return true;
            }
        }
    }
    if (task[task.length - 1]){
        let symbol = task[task.length - 1];
        for (let i = 0; i < self_operations.length; i++) {
            if (self_operations[i] === symbol)
                return true;
        }
    }
    return false;
}

function clear_results(){
    history.textContent = '';
    current_result.textContent = '0';
    task = [];
    current_number = '';
    document.getElementById('copy').classList.remove('active');
}

function clear_last(){
    if (current_number !== '' && typeof task[task.length - 1] !== 'number'){
        if (current_result.textContent[current_result.textContent.length - 1] === 'π'){
            if (Math.abs(Number(current_number)) < 0){
                current_result.textContent = current_result.textContent.substring(0, current_result.textContent.length-2);
            }
            else {
                current_result.textContent = current_result.textContent.substring(0, current_result.textContent.length-1);
            }
            current_number = '';
        }
        else {
            current_number = current_number.substring(0, current_number.length-1);
            current_result.textContent = current_result.textContent.substring(0, current_result.textContent.length-1);
        }
    }
    else if (current_number !== '' && typeof task[task.length - 1] === 'number'){
        task.pop();
        current_result.textContent = current_number;
    }
    else if (task.length !== 0) {
        task.pop();
        if (task.length !== 0 && typeof task[task.length - 1] === 'number'){
            current_number = task.pop().toString();
        }
        current_result.textContent = current_result.textContent.substring(0, current_result.textContent.length-1);
    }
}
function add_symbol(symbol) {
    current_result.textContent += symbol;
    document.getElementById('copy').classList.remove('active');
}

function change_sign(){
    if (current_number !== ''){
        if (Math.abs(Number(current_number)) === 3.1415){
            current_number = `${Number(current_number) * -1}`;
            if (Number(current_number) < 0){
                current_result.textContent = current_result.textContent.substring(0, current_result.textContent.length - 1);
                current_result.textContent += '-π';
            }
            else {
                current_result.textContent = current_result.textContent.substring(0, current_result.textContent.length - 2);
                current_result.textContent += 'π';
            }
            return;
        }
        let target = `${Number(current_number)}`;
        current_number = `${Number(current_number) * -1}`;
        current_result.textContent =
            current_result.textContent.substring(0,
                current_result.textContent.length - target.length) + current_number;
    }
    else{
        if (current_result.textContent === '0')
            current_result.textContent = '';
        current_number = '-0';
        add_symbol('-');
    }
}
function solve(){
    if (current_number !== ''){
        if (!(task.length !== 0 && Number(task[task.length-1]))){
            task.push(Number(current_number));
        }
    }
    fix_double_numbers();
    show_history_text();
    prepare_operations();
    let result = 0;
    try {
        if (task.length !== 0)
            result = get_result(0);
        else result = NaN;
    } catch (error){
        alert(error.message);
    }
    document.getElementById('copy').classList.add('active');
    current_result.textContent = parseFloat(result.toFixed(10)).toString();
    current_number = parseFloat(result.toFixed(10)).toString();
    task = [parseFloat(result.toFixed(10))];
}

function prepare_operations(){
    for (let i = 0; i < task.length; i++) {
        if (get_operation(task[i])){
            task[i] = get_operation(task[i]);
        }
    }
}

function fix_double_numbers(){
    for (let i = 1; i < task.length; i++) {
        if (typeof task[i-1] === 'number' && typeof task[i] === 'number'){
            task.splice(i-1, 1);
        }
    }
}

function show_history_text(){
    for (let i = 1; i < task.length; i++) {
        if (typeof task[i] === 'string' && task[i] === '!'){
            if (!Number.isInteger(task[i-1])) {
                task[i-1] = Math.floor(task[i-1]);
            }
        }
    }
    history.textContent = task.join(' ');
    history.textContent = history.textContent.replaceAll('√ ', '√');
    history.textContent = history.textContent.replaceAll('∛ ', '∛');
    history.textContent = history.textContent.replaceAll(' !', '!');
    history.textContent = history.textContent.replaceAll(' ^ ', '^');
    history.textContent = history.textContent.replaceAll(' )', ')');
    history.textContent = history.textContent.replaceAll('( ', '(');
    history.textContent = history.textContent.replaceAll(' %', '%');
    history.textContent = history.textContent.replaceAll('0 - ', '-');
}

function get_result(current_priority){
    if (current_priority > 20){
        task = [NaN];
    }
    if (task.length === 1 && typeof task[0] === 'number')
        return task[0];
    for (let i = 0; i < task.length; i++) {
        let operation = task[i];
        if (typeof operation !== 'number' && operation.priority === current_priority) {
            operation.func(i);
            return get_result(current_priority);
        }
    }
    return get_result(current_priority + 1);
}

function get_operation(text){
    for (let i = 0; i < operations.length; i++) {
        if (operations[i].symbol === text)
            return operations[i];
    }
}

//Operations:
function Addition(i){
    let result = task[i-1] + task[i+1];
    task.splice(i-1, 3, result);
}

function subtracting(i){
    let result = task[i-1] - task[i+1];
    task.splice(i-1, 3, result);
}

function multiplication(i){
    let result = task[i-1] * task[i+1];
    task.splice(i-1, 3, result);
}

function division(i){
    let result = task[i-1] / task[i+1];
    task.splice(i-1, 3, result);
}

function percent(i) {
    let result = task[i-1] / 100;
    task.splice(i-1, 2, result);
}

function factorial(i){
    let result = 1;
    for (let j = 2; j <= Math.abs(task[i-1]); j++) {
        result *= j;
    }
    if (task[i-1] < 0)
        result *= -1;
    task.splice(i-1, 2, result);
}

function exponent(i){
    let result = task[i-1] ** task[i+1];
    task.splice(i-1, 3, result);
}

function square_root(i) {
    let result = NaN;
    if (i + 1 < task.length)
        result = Math.sqrt(task[i+1]);
    task.splice(i, 2, result);
}

function cube_root(i){
    let result = NaN;
    if (i + 1 < task.length)
        result = Math.cbrt(task[i+1]);
    task.splice(i, 2, result);
}

function change_priority_before(i){
    let task_temp = Array.from(task);
    if (find_close_for(i)){
        let end = find_close_for(i);
        task = task.slice(i+1, end);
        let result = get_result(0);
        task = task_temp;
        task.splice(i, end-i+1, result);
    }
    else
        task = [NaN];
}

function find_close_for(i){
    let index = 1;
    for (let j = i+1; j < task.length; j++) {
        if (!Number.isInteger(task[j])){
            if (task[j].symbol === '(')
                index += 1;
            if (task[j].symbol === ')')
                index -= 1;
            if (index === 0){
                return j;
            }
        }
    }
}

function change_priority_after(i){
    let count = 0;
    for (let j = 0; j < task.length; j++) {
        if (typeof task[j] === "object"){
            if (task[j].symbol === '(')
                count += 1;
            if (task[j].symbol === ')')
                count -= 1;
        }
    }
    if (count !== 0)
        task = [NaN];
}


//creative
function show_convert() {
    let convertBlock = document.querySelector('.convert');
    convertBlock.classList.toggle('show-block');
}


//memory
function clearLocalStorage() {
    localStorage.clear();
}

function mem_write(number){
    localStorage.setItem('number', number);
}

function fill_from_memory() {
    if (localStorage.getItem('number')){
        let result = localStorage.getItem('number');
        current_result.textContent = `${result}`;
        current_number = result;
        task = [Number(result)];
    }
}

function mem_add(){
    solve();
    let old = Number(localStorage.getItem('number'));
    if (old){
        mem_write(old + Number(current_result.textContent));
    }
    else
        mem_write(Number(current_result.textContent));
}

function mem_remove(){
    solve();
    let old = Number(localStorage.getItem('number'));
    if (old){
        mem_write(old - Number(current_result.textContent));
    }
    else
        mem_write(Number(current_result.textContent));
}

//conversation

document.querySelectorAll('.buttons_conv > .button').forEach((button) => {
    button.addEventListener('click', () => {
        let elements = document.querySelectorAll('.buttons_conv > .button');
        let first_target;
        for (let some_element of elements) {
            if (some_element.classList.contains('target_from')){
                first_target = some_element;
                break;
            }
        }
        if (first_target){
            if (button !== first_target && button.classList.contains('same_value')){
                convert(first_target, button);
                first_target.classList.remove('target_from');
            }
            else if (button !== first_target){
                first_target.classList.remove('target_from');
            }
            else {
                button.classList.remove('target_from');
            }
            clear_selection_convert();
        }
        else {
            button.classList.add('target_from');
            let class_value = '';
            for (let some_class of button.classList) {
                if (some_class.match(/^c_\d$/)){
                    class_value = some_class;
                    break;
                }
            }
            document.querySelectorAll('.buttons_conv > .button.' + class_value).forEach((element) => {
               element.classList.add('same_value');
            });
            button.classList.remove('same_value');
        }
    });
});

function clear_selection_convert(){
    document.querySelectorAll('.buttons_conv > .button.same_value').forEach((element) => {
        element.classList.remove('same_value');
    });
}

function convert(first_target, second_target){
    let coef = Number(first_target.value) / Number(second_target.value);
    solve();
    let value = Number(current_result.textContent);
    if (value) {
        let result = value * coef;
        current_result.textContent = parseFloat(result.toFixed(10)) + ' ' + second_target.textContent;
        history.textContent += ' ' + first_target.textContent;
    }
}


//copy
function copyText(text) {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}

function copy(){
    let hist = history.textContent;
    if (hist){
        copyText(hist + ' = ' + current_result.textContent);
    }
}
