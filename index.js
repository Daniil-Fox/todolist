
const todoAddBtn = document.querySelector('.todolist__add')
const todoListState = document.querySelector('.todolist .list')
const form = document.querySelector('.todolist')



const months =['January', 'February', 'Martch', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December'];
// Тудушка
class TodoList {
    constructor(){
        this.tasklist = []
        this.alarm = new Alarm()
    }

    getTask(){
        return this.task
    }
    changeState(){
        setInterval(() => {
            todoListState.innerHTML = ''
            for(let i = 0; i < this.tasklist.length; i++){
                todoListState.innerHTML += `<li class="list__item list-item">
                    <div class="list-item__content">
                        <span>${this.tasklist[i].getTask()}</span>
                        <button class="rm">&times;</button>
                    </div>
                    <p class="list-item__time">осталось <span class="time">${Math.floor(this.tasklist[i].getTime() / 1000 / 60 / 60).toString().padStart(2, '0')}:${Math.round(this.tasklist[i].getTime() / 1000 / 60 % 60).toString().padStart(2, '0')}</span></p>
                </li>`
            }
            const data = []
            this.tasklist.forEach(obj => {
                data.push(obj)
            })
            localStorage.setItem('todolist', JSON.stringify(data))
        }, 1000)
        
    }
    addTask(task){
        if(task.getTime() < 0){
            alert('Нельзя создать задачу в прошлом, к сожалению :(')
        } else {
            this.tasklist.push(task)
            this.changeState()
            this.alarm.createNotify(task)
        }
    }
    removeTask(taskText){
       
        this.tasklist = this.tasklist.filter((task) => task.getTask() !== taskText);
        this.changeState()
    }
    
}
// Таск
class Task {
    constructor(task, time, state){
        if(typeof time == 'string'){
            time = replaceTime(time)
        }
        this.time = time
        this.task = task
        this.state = state

        setInterval(() => this.updateTime(), 60000)
    }
    getTask(){
        return this.task
    }
    setTask(task){
        this.task = task
    }
    getTime(){
        return this.time
    }
    setTime(time){
        this.time = time
    }
    getState(){
        return this.state
    }
    setState(){
        this.state = this.state
    }
    updateTime(){
        let newTime = new Date() - new Date(this.time)
        this.time = newTime < 0 ? newTime : 0
    }
}
function replaceTime(time = ''){
    let chDay = +document.querySelector('.ch-day').textContent
    let chMonthIndex = months.indexOf(document.querySelector('thead td .currMonth').textContent)
    let chYear = +document.querySelector('thead td .currYear').textContent
    let hours = +time.slice(0,2)
    let minutes = +time.slice(3, )

    return new Date(chYear, chMonthIndex, chDay, hours, minutes) - new Date()
}


// Календарь
class Cal {
    constructor(divId){

        this.divId = divId;
        this.daysOfWeek = [
          'Пн',
          'Вт',
          'Ср',
          'Чтв',
          'Птн',
          'Суб',
          'Вск'
        ];
        this.months =['January', 'February', 'Martch', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December'];
        let d = new Date();
        this.currMonth = d.getMonth();
        this.currYear = d.getFullYear();
        this.currDay = d.getDate();

        this.getId('btnNext').onclick = () => {
            this.nextMonth();
        };
        this.getId('btnPrev').onclick = () => {
            this.previousMonth();
        };
    }
    nextMonth(){
        if ( this.currMonth == 11 ) {
            this.currMonth = 0;
            this.currYear = this.currYear + 1;
          }
          else {
            this.currMonth = this.currMonth + 1;
          }
          this.showcurr();
    }
    previousMonth(){
        if ( this.currMonth == 0 ) {
            this.currMonth = 11;
            this.currYear = this.currYear - 1;
          }
          else {
            this.currMonth = this.currMonth - 1;
          }
          this.showcurr();
    }
    showcurr(){
        this.showMonth(this.currYear, this.currMonth);
    }
    showMonth(y, m){
        let d = new Date()

        let firstDayOfMonth = new Date(y, m, 7).getDay()

        let lastDateOfMonth =  new Date(y, m+1, 0).getDate()

        let lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();
        let html = '<table>';
        html += '<thead><tr>';
        html += '<td colspan="7"><span class="currMonth">' + this.months[m] + '</span> <span class="currYear">' + y + '</span></td>';
        html += '</tr></thead>';

        html += '<tr class="days">';
        for(let i=0; i < this.daysOfWeek.length;i++) {
          html += '<td data-td>' + this.daysOfWeek[i] + '</td>';
        }
        html += '</tr>';
        let i=1;
        do {
          let dow = new Date(y, m, i).getDay();
          if ( dow == 1 ) {
            html += '<tr>';
          }
          else if ( i == 1 ) {
            html += '<tr>';
            let k = lastDayOfLastMonth - firstDayOfMonth+1;
            for(let j=0; j < firstDayOfMonth; j++) {
              html += '<td class="not-current" data-td>' + k + '</td>';
              k++;
            }
          }
          let chk = new Date();
          let chkY = chk.getFullYear();
          let chkM = chk.getMonth();
          if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
            html += '<td class="today ch-day" data-td>' + i + '</td>';
          } else {
            html += '<td class="normal" data-td>' + i + '</td>';
          }
          if ( dow == 0 ) {
            html += '</tr>';
          }
          else if ( i == lastDateOfMonth ) {
            let k=1;
            for(dow; dow < 7; dow++) {
              html += '<td class="not-current" data-td>' + k + '</td>';
              k++;
            }
          }
          i++;
        }while(i <= lastDateOfMonth);
        html += '</table>';
        document.getElementById(this.divId).innerHTML = html;
    }
    getId(id) {
        return document.getElementById(id);
    }

   
}

class Alarm {
    constructor(){

    }
    createNotify(task){

        task.interval = setInterval(this.checkTime(task), 60000)
    }
    removeNotify(task){

    }

    checkTime(task){
        if(Math.floor(task.getTime() / 1000 / 60 / 60) < 1 && Math.floor(task.getTime() / 1000 / 60 % 60) < 60){
            alert('Поспешите закончить следующее задание: ' + task.getTask() + '. Осталось менее часа!')
        }
    }
}









todoListState.addEventListener('click', e => {
    e.preventDefault()
    if(e.target.classList.contains('rm')){
        const taskData = e.target.closest('.list-item__content').querySelector('span').textContent
        dashboard.getTodoList().removeTask(taskData)
    }
})

document.querySelector('#divCal').addEventListener('click', e => {

    if(e.target.dataset){
        if(e.target.tagName == "TD" && !e.target.closest('tr.days'))
        { 
            document.querySelectorAll('.ch-day').forEach(el => el.classList.remove('ch-day'))
            e.target.classList.add('ch-day')
        }
    }
})


form.addEventListener('submit', e => {
    e.preventDefault()
    todoAddBtn.click()
})




class Timer {
    constructor(){
    }
    getTime(){
        setInterval(() => {
            document.querySelector('.timer__time').innerHTML = `${Math.round(new Date().getHours()).toString().padStart(2, '0')}:${Math.floor(new Date().getMinutes()).toString().padStart(2, '0')}:${Math.floor(new Date().getSeconds()).toString().padStart(2, '0')}`
        }, 1000)
    }
}



class Dashboard {
    constructor(calendar, timer, todolist){
        this.calendar = calendar
        this.timer = timer
        this.todolist = todolist
    }
    getTodoList(){
        return this.todolist
    }
    getCalendar(){
        return this.calendar
    }
    getTimer(){
        return this.timer
    }

    showDashBoard(){
        			
        this.calendar.showcurr();
    
        
        if(localStorage.getItem('todolist')){
            JSON.parse(localStorage.getItem('todolist')).forEach(task => {
                this.todolist.addTask(new Task(task.task, task.time, task.state))
            })
        }

        this.timer.getTime()
    }
}

const dashboard = new Dashboard(new Cal("divCal"), new Timer(), new TodoList())
dashboard.showDashBoard()
todoAddBtn.addEventListener('click', e => {
    e.preventDefault()

    const todo = document.querySelector('.todo-value')
    const todoTime = document.querySelector('.todo-time')


    const task = todo.value
    const time = todoTime.value
    let state = false
    
    todo.value = ''
    todoTime.value = ''


    const taskObj = new Task(task, time, state)
    dashboard.getTodoList().addTask(taskObj)

})

