const db = firebase.firestore();

const taskform = document.getElementById('task-form');
const tasksContainer = document.getElementById('task-containers');

let editStatus = false;
let id = '';

const GuardarAlumno = (ide, name, lastname, years, adress, phone) =>
    db.collection('Foro2').doc().set({
        ide,
        name,
        lastname, 
        years,
        adress,
        phone,
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
                        <td>${alum.ide}</td><td>${alum.name}</td><td>${alum.lastname}</td>
                        <td>${alum.years}</td><td>${alum.adress}</td><td>${alum.phone}</td>
                        
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
                    taskform['task-lastname'].value =  al.lastname;
                    taskform['task-years'].value =  al.years;
                    taskform['task-adress'].value =  al.adress;
                    taskform['task-phone'].value =  al.phone;
                 


  
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
    const lastname = taskform['task-lastname'];
    const years = taskform['task-years'];
    const adress = taskform['task-adress'];
    const phone = taskform['task-phone'];
 




    if (!editStatus){
        await GuardarAlumno(ide.value, name.value, lastname.value, years.value, adress.value, phone.value);
    }else{
        await ActulalizarTodo(id, {
            ide: ide.value,
            name: name.value,
            lastname: lastname.value,
            years: years.value,
            phone: phone.value,
            

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
