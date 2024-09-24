const API_URL = 'http://localhost:8009/api/students';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
    const modal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Cargar estudiantes al iniciar
    loadStudents();

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        addStudent({ name, email });
    });

    // Cargar estudiantes
    function loadStudents() {
        fetch(API_URL)
            .then(response => response.json())
            .then(students => {
                table.innerHTML = ''; // Limpiamos la tabla antes de agregar los nuevos datos
                students.forEach(student => {
                    addStudentToTable(student);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Agregar estudiante
    function addStudent(student) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        })
        .then(response => response.json())
        .then(newStudent => {
            addStudentToTable(newStudent);
            form.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    // Agregar estudiante a la tabla
    function addStudentToTable(student) {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>
                <button onclick="editStudent(${student.id}, '${student.name}', '${student.email}')">Editar</button>
                <button onclick="deleteStudent(${student.id}, this)">Eliminar</button>
            </td>
        `;
    }

    // Editar estudiante
    window.editStudent = function(id, name, email) {
        document.getElementById('editId').value = id;
        document.getElementById('editName').value = name;
        document.getElementById('editEmail').value = email;
        modal.style.display = 'block';
    }

    // Cerrar modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Cerrar modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Manejar envío del formulario de edición
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        updateStudent(id, { name, email });
    });

    // Actualizar estudiante
    function updateStudent(id, student) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        })
        .then(response => response.json())
        .then(updatedStudent => {
            const rows = table.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].cells[0].textContent == id) {
                    rows[i].cells[1].textContent = updatedStudent.name;
                    rows[i].cells[2].textContent = updatedStudent.email;
                    rows[i].style.backgroundColor = '#FFFF99';  // Resaltar la fila actualizada
                    setTimeout(() => {
                        rows[i].style.backgroundColor = '';  // Volver al color normal después de 1 segundo
                    }, 1000);
                    break;
                }
            }
            modal.style.display = 'none';
            alert('Estudiante actualizado con éxito');  // Mostrar un mensaje de éxito
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el estudiante');  // Mostrar un mensaje de error
        });
    }

    // Eliminar estudiante
    window.deleteStudent = function(id, button) {
        fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                button.closest('tr').remove();
            } else {
                throw new Error('No se pudo eliminar el estudiante');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});