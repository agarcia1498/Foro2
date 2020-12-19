const db = firebase.firestore();

const taskform = document.getElementById('task-form');
const tasksContainer = document.getElementById('task-containers');

let editStatus = false;
let id = '';

const GuardarAlumno = (ide, name, carrera, years, mail, cell) =>
    db.collection('Foro2').doc().set({
        ide,
        name,
        carrera, 
        years,
        mail,
        cell,
    });

const ObtenerAlumno = () => db.collection('Foro2').get();
const ActualizarAlumno = (callback) => db.collection('Foro2').onSnapshot(callback);
const EliminarAlumno = id => db.collection('Foro2').doc(id).delete();
const EditarAlumno = (id) => db.collection('Foro2').doc(id).get();
const ActulalizarTodo = (id, updatedTask) => db.collection('Foro2').doc(id).update(updatedTask);

window.addEventListener('DOMContentLoaded', async (e) =>{

    ActualizarAlumno((querySnapshot) =>{
        tasksContainer.innerHTML = "";
        
        querySnapshot.forEach((doc) =>{
            
            const alum = doc.data();
            alum.id = doc.id;
           
            tasksContainer.innerHTML += `<div class="card card-body mt2m border primary">
                <table>
                    <tr>
                        <td>Cuenta</td><td>Nombre</td><td>Carrera</td><td>Edad</td><td>Correo</td><td>Celular</td>
                    </tr>
                    <tr>
                        <td>${alum.ide}</td><td>${alum.name}</td><td>${alum.carrera}</td>
                        <td>${alum.years}</td><td>${alum.mail}</td><td>${alum.cell}</td>
                        
                        <td><button class="btn btn-primary btn-delete" data-id="${alum.id}">Eliminar</button>
                        <button class="btn btn-primary btn-edit" data-id="${alum.id}">Editar</button>
                        </td>
                    </tr>
                </table>    
            </div>`;

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn =>{
                btn.addEventListener('click', async (e)=>{
                    await EliminarAlumno(e.target.dataset.id)
                })
            })
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn =>{
                btn.addEventListener('click', async (e)=>{
                    const doc = await EditarAlumno(e.target.dataset.id);
                    const al = doc.data();
                    editStatus = true;
                    id = doc.id;

                    taskform['task-id'].value =  al.ide;
                    taskform['task-name'].value =  al.name;
                    taskform['task-carrera'].value =  al.carrera;
                    taskform['task-years'].value =  al.years;
                    taskform['task-mail'].value =  al.mail;
                    taskform['task-cell'].value =  al.cell;
                 


  
                    taskform['btn-task-form'].innerText = 'Actualizar';
  
                })
            }) 
        });
    });
    
});
taskform.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ide = taskform['task-id'];
    const name = taskform['task-name'];
    const carrera = taskform['task-carrera'];
    const years = taskform['task-years'];
    const mail = taskform['task-mail'];
    const cell = taskform['task-cell'];
 




    if (!editStatus){
        await GuardarAlumno(ide.value, name.value, carrera.value, years.value, mail.value, cell.value);
    }else{
        await ActulalizarTodo(id, {
            ide: ide.value,
            name: name.value,
            carrera: carrera.value,
            years: years.value,
            cell: cell.value,
            

        });
        editStatus = false;
        id = '';
        taskform['btn-task-form'].innerText = 'Guarda';
    }
    await ObtenerAlumno();
    taskform.reset();
    ide.focus();

    console.log('submiting')
})
