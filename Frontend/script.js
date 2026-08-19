

const SERVER_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

// Login page logic
function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    .then(async (response) => {
        const data = await response.json(); 

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data;
    })

    .then(data => {
        localStorage.setItem("token", data.token);
        window.location.href = "todos.html";
    })

    .catch(error => {
        alert(error.message);
    });
}

// Register page logic
function register() {

    const email = document.getElementById("email").value ;
    const password = document.getElementById("password").value;

    fetch( `${SERVER_URL}/auth/register`,{
        method : "POST",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({email,password})
    })

    .then(Response =>{
        if(Response.ok){
            alert("Registration Successful , Please Login !")
            window.location.href ="login.html"
        }
        else{
            return Response.json().then(data => {throw new Error(data.message || "Registration failed ")});
            
        }
    }).catch(error=>{
        alert(error.message);
    })

}

// Todos page logic
function createTodoCard(todo) {

    const card = document.createElement("div");
    card.className ="todo-card";

    const checkbox = document.createElement("input");
    checkbox.type="checkbox"
    checkbox.checked=todo.completed;

    checkbox.addEventListener("change", function(){
        const updatetodo = {...todo , completed: checkbox.checked};
        updateTodoStatus(updatetodo);
    })

    const span = document.createElement("span");
    span.textContent=todo.title;

    if (todo.completed) {
        span.style.textDecoration="line-through"
        span.style.color="#aaa";
    }

    const deletebtn = document.createElement("Button");
    deletebtn.textContent="x";

    deletebtn.onclick= function(){
        console.log("Deleting ID:", todo.id);
        (deleteTodo(todo.id));};

        console.log(todo);
    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(deletebtn);

    return card ;
}

function loadTodos() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Plese login first")
        window.location.href="login.html"
        return ;

    }
    fetch(`${SERVER_URL}/api/todos`,{
        method:"GET",
        headers:{ Authorization : `Bearer ${token}`}
            
    })

    .then(async(response)=>{
         const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message ||" Failed to Get todos");
        }
        return data;
    })
    .then( (todos) =>{
        const todolist = document.getElementById("todo-list");
        todolist.innerHTML="";
        
        if (!todos || todos.length ===0) {
            todolist.innerHTML = `<p id="empty-message"> No todo yet. Add todo below! </p>`;
        }
        else{
            todos.forEach(todo => {
                todolist.appendChild(createTodoCard(todo));

            });
        }
    } )

    .catch(error=>
        {
            console.log(error);
            document.getElementById("todo-list").innerHTML = `<p style= "color:red"> Faild to load todos !</p>`;
        })
}

function addTodo() {

    const input =  document.getElementById("new-todo");
    const todotext = input.value.trim();

    if(!todotext) return;

    console.log({
    title: todotext,
    Completed: false
});
    fetch(`${SERVER_URL}/api/todos`,{
        method:"POST",
        headers:{"Content-Type" : "application/json",
            Authorization : `Bearer ${token}`},
            body: JSON.stringify({title:todotext  , Completed: false})
    })

    .then(async(response)=>{
         const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message ||" Failed to update todos");
        }
        return data;
    })
    .then((newtodo)=>{
        input.value="";
        loadTodos();
    })

    .catch(error=>
        {
            alert(error.message);
        })
}

function updateTodoStatus(todo) {

    fetch(`${SERVER_URL}/api/todos/${todo.id}`,{
        method:"PUT",
        headers:{"Content-Type" : "application/json",
             Authorization : `Bearer ${token}`},
            body: JSON.stringify({
                title: todo.title,
            completed: todo.completed
            })
    })

    .then(async(response)=>{
         const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message ||" Failed to update todos");
        }
        return data;
    })
    .then(() => loadTodos())

    .catch(error=>
        {
            alert(error.message);
        })
}

function deleteTodo(id) {

    fetch(`${SERVER_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    })

    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }
        return true ;
    })

    .then(() => loadTodos())   

    .catch(error => {
        alert(error.message);
    })
}


// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});