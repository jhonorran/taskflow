console.log("VERSÃO NOVA DO GITHUB ATIVA");

const taskInput = document.getElementById("taskInput");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const taskCategory = document.getElementById("taskCategory");
const filterTasks = document.getElementById("filterTasks");
const taskPriority = document.getElementById("taskPriority");
const taskDaily = document.getElementById("taskDaily");
const taskDay = document.getElementById("taskDay");
const filterCategory = document.getElementById("filterCategory");
const searchTask = document.getElementById("searchTask");
const themeToggle = document.getElementById("themeToggle");
const colorTheme = document.getElementById("colorTheme");

let draggedIndex = null;
let placeholder = null;

let tasks = [];

const savedTasks = localStorage.getItem("tasks");

if(savedTasks){

    tasks = JSON.parse(savedTasks);
}

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateTaskCount() {
    taskCount.textContent = `${tasks.length} tarefas`;
}

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;
    const search = searchTask ? searchTask.value.toLowerCase(): "";
    

    if(search !== ""){
        filteredTasks = filteredTasks.filter(task =>
            task.text.toLowerCase().includes(search)
        );
    }
    
    if(filterTasks.value === "completed"){

        filteredTasks = tasks.filter(task => task.completed);
    }
     if(filterTasks.value === "pending"){

        filteredTasks = tasks.filter(task => !task.completed);
    }
    if(filterCategory.value !== "all"){
        filteredTasks = filteredTasks.filter(task => String(task.category).trim() === String(filterCategory.value).trim()
    );
    }

    filteredTasks.forEach((task, index) => {
        

        let priorityEmoji = "";

        const p = (task.priority || "").toLowerCase();

        if(p.includes("alta")){
            priorityEmoji = "🚨"
        }
        else if (p.includes("média")){
            priorityEmoji = "🔶";
        }
        else if (p.includes("baixa")){
            priorityEmoji = "🟩";
        }

        let categoryEmoji = "";

        if(task.category === "Estudos"){
            categoryEmoji = "📚"
        }
         if(task.category === "Trabalho"){
            categoryEmoji = "💼"
        }
         if(task.category === "Academia"){
            categoryEmoji = "🏋️‍♀️"
        }
         if(task.category === "Pessoal"){
            categoryEmoji = "🏡"
        }


        const li = document.createElement("li");
        li.classList.add("task");
        li.dataset.index = index;
        li.style.position = "relative";
        li.style.cursor = "grab";

        li.addEventListener("pointerdown", (e) => {
            draggedIndex = index;
            li.classList.add("dragging");
        });
    

        console.log("TASK", task.text);
        console.log("DRAG TEST:", li.draggable);
      

        if(isTaskLate(task) && !task.completed){
            li.classList.add("late");
        }

        if(task.completed){
            li.classList.add("completed");
        }

        li.innerHTML = `
          <div>
          ${isTaskLate(task) && !task.completed ? "⏳<strong style='color:#ef4444'>Tarefa atrasada</strong><br>" : ""}
            <span>${task.text}</span>

            <br>
            <small>

            ${task.day}
            <br>

            
          ${priorityEmoji}
           Prioridade
           ${task.priority}

            <br>
            ${categoryEmoji}
            ${task.category}

            <br>
            
            ⏲️Inicio: ${task.startTime || "__;__"}
            <br>
            🕰️Fim: ${task.time || "__;__"}
            </small>
            
          </div>   
          
          <div class="task-meta">
            Criado em: ${task.date}
        
          <div>
            <button onclick="toggleTask(${index})">
            ✔️
            </button>
            <button onclick="editTask(${index})">
            ✏️
            </button>
            <button onclick="deleteTask(${index})">
            🗑️
            </button>
          </div>
         `;
         taskList.appendChild(li);
    });

    updateTaskCount();
    updateProgress();
    renderCalendar();
}

function addTask(){

    console.log("clicou");

    const text = taskInput.value.trim();
    const time = taskTime.value;
    const startTime = taskStartTime.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;
    const day = taskDay.value;
    

    if(text === ""){
        return;
    }

    tasks.push({
        text: text,
        completed: false,
        date: new Date().toLocaleString(),
        startTime: startTime,
        time: time,
        category: category,
        priority: priority,
        daily: taskDaily.checked,
        day: day,
    });

    saveTasks();

    taskInput.value = "";

    renderTasks();
    renderCalendar();
    updateProgress();
}

function toggleTask(index){
    tasks[index].completed =
    !tasks[index].completed;

    saveTasks();

    renderTasks();
    renderCalendar();
    updateProgress();
}

function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    renderTasks();
    renderCalendar();
    updateProgress();
}
function editTask(index){
    const task = tasks[index];

    const clean = (v) => v ? v.trim() : "";

    const newText = prompt("Editar tarefa:", task.text);

    if(newText === null){
        return;
    }
    const newPriority = prompt("Prioridade (alta, média, baixa):",
        task.priority
    );
    if(newPriority === null) return;
    const newCategory = prompt("Categoria (Estudos, Trabalho, Academia, Pessoal):",
        task.category
    );
    if(newCategory === null) return;
    const newDay = prompt("Dia (Segunda, Terça, Quarta, Quinta, Sexta, Sábado, Domingo):",
        task.day
    );
    if(newDay === null) return;

    const newStartTime = prompt("Hora de início:",
        task.startTime || "");
    if(newStartTime === null) return;
    
    const newTime = prompt("Hora de término:",
        task.startTime || "");
    if(newTime === null) return;
    

  
    task.text = clean(newText);
    task.priority = clean(newPriority).toLowerCase();
    task.category = clean(newCategory);
    task.day = clean(newDay);
    task.startTime = clean(newStartTime);
    task.time = clean(newTime);

    saveTasks();
    renderTasks();
    renderCalendar();

}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        addTask();
    }
});    
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
        if(document.body.classList.contains("dark")){
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        } 
        else{
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        }
});
colorTheme.addEventListener("change", (e) => {

    const color = e.target.value;

    document.documentElement.style.setProperty(
        "--primary",
        color
    );
    document.documentElement.style.setProperty(
        "--primary-dark",
        color + "cc"
    );
    localStorage.setItem("themeColor", color);
});

taskTime.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        addTask();
    }
   
});
filterTasks.addEventListener(
    "change",
    renderTasks
);
filterCategory.addEventListener(
    "change",
    renderTasks
);
searchTask.addEventListener(
    "input",
    renderTasks
);

function isTaskLate(task){

    if(!task.time || !task.day) return false;

    const daysMap = {
        "Domingo": 0,
        "Segunda": 1,
        "Terça": 2,
        "Quarta": 3,
        "Quinta": 4,
        "Sexta": 5,
        "Sábado": 6,
    }

    const now = new Date();
    const [hours, minutes] = task.time.split(":");
    const taskDate = new Date();

    taskDate.setHours(hours);
    taskDate.setMinutes(minutes);
    taskDate.setSeconds(0);

    const diffDays = daysMap[task.day] - now.getDay();
    if(diffDays < 0){
        taskDate.setDate(now.getDate() + diffDays + 7);
    } else{
        taskDate.setDate(now.getDate() + diffDays);
    }

    return taskDate < now;
}
function updateProgress(){

    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const progress = total === 0 ? 0 : (completed / total) * 100;
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    progressBar.style.width = progress + "%";
    progressText.textContent = `${completed} de ${total} tarefas concluídas (${Math.round(progress)}%)`;

}
function resetDailyTasks(){
    
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("lastDate");

    if(lastDate !== today){
        tasks = tasks.map(task =>{

            if(task.daily){
                task.completed = false;
            }
            return task;
        });
        localStorage.setItem("lastDate", today);
        saveTasks();
    }
}
function renderCalendar(){

    const days = document.querySelectorAll(".day-tasks");

    days.forEach(day => day.innerHTML = "");
    tasks.forEach(task => {

        const dayColumn = document.querySelector(
            `.day[data-day="${task.day}"] .day-tasks`
        );
        if(dayColumn){

            const div = document.createElement("div");
            div.classList.add("calendar-task");

            div.innerHTML = `
            ${task.text}
            <br>
            <small>${task.time || ""}</small>
            `;
            dayColumn.appendChild(div);
        }
    });
}
resetDailyTasks();
renderTasks();

const savedColor = localStorage.getItem("themeColor");

if(savedColor){
    document.documentElement.style.setProperty(
        "--primary",
        savedColor
    );
    document.documentElement.style.setProperty(
        "--primary-dark",
        savedColor + "cc"
    );
}
if("serviceWorker" in navigator){
    window.addEventListener("load", () => {
        navigator.serviceWorker
        .register("./service-worker.js")
        .then(() => {
            console.log("PWA funcionando 🚀");
        })
        .catch(error => {
            console.log("Erro no PWA", error);
        });
    });
}
window.addEventListener("load", () => {
const days = document.querySelectorAll(".day");

days.forEach(day => {

    day.addEventListener("dragover", (e) => {
        e.preventDefault();
        day.classList.add("drag-over");
    });

    day.addEventListener("dragleave", () => {
        day.classList.remove("drag-over");
    });

    day.addEventListener("drop", (e) => {
        e.preventDefault();
        day.classList.remove("drag-over");

        const index = Number(e.dataTransfer.getData("text/plain"));
        const newDay = day.dataset.day;

        if (isNaN(index)) return;

        tasks[index].day = newDay;

        saveTasks();
        renderTasks();
        renderCalendar();
    });
});

});

  
