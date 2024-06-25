import React, { useState, useEffect } from 'react';
import { Mietech_backend } from 'declarations/Mietech_backend';
import './index.scss';


function App() {

  const [students, setStudents] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', school: 'IPRC-NGOMA' });
  const [editingStudent, setEditingStudent] = useState(null);

  
  useEffect(() => {
    const checkLoginStatus = async () => {
      const authClient = await authClientPromise;
      const isAuthenticated = await authClient.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
      if (isAuthenticated) {
        const identity = authClient.getIdentity();
        updateIdentity(identity);
      }
    };

    checkLoginStatus();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsList = await Mietech_backend.getStudents();
      console.log("Fetched students:", studentsList);
      setStudents(studentsList);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    console.log("Submitting student:", newStudent);

    try {
      if (editingStudent) {
        await Mietech_backend.updateStudent(editingStudent.id, newStudent.firstName, newStudent.lastName, newStudent.school);
        console.log("Student updated successfully");
      } else {
        await Mietech_backend.addStudent(newStudent.firstName, newStudent.lastName, newStudent.school);
        console.log("Student added successfully");
      }
      setNewStudent({ firstName: '', lastName: '', school: 'IPRC-NGOMA' });
      setShowAddStudentForm(false);
      setEditingStudent(null);
      fetchStudents(); // Fetch students after adding/updating a student
    } catch (error) {
      console.error("Failed to add/update student:", error);
    }
  };

  const handleEditStudent = (student) => {
    setNewStudent({ firstName: student.firstName, lastName: student.lastName, school: student.school });
    setEditingStudent(student);
    setShowAddStudentForm(true);
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await Mietech_backend.deleteStudent(studentId);
      console.log("Student deleted successfully");
      fetchStudents(); // Fetch students after deleting a student
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleFetchStudents = () => {
    fetchStudents();
    setShowAddStudentForm(false); // Close the add student form when fetching students
    setEditingStudent(null);
  };
  const handleAddformStudents = () => {
    // fetchStudents();
    setShowAddStudentForm(true); // Close the add student form when fetching students
    setEditingStudent(null);
  };

  return (
    <main className='mt-4'>
      
        <>
         
         
          <button onClick={handleAddformStudents} className='btn btn-primary' data-toggle="modal" data-target="#exampleModalCenter">Add New Student</button>
          <button onClick={handleFetchStudents}className='btn btn-secondary'>View Students</button>
          <h2>Student List</h2>
          <table className='table table-hover'>
          <thead class="thead-dark">
            <tr className=''>
              <th>FirstName</th>
              <th>LastName</th>
              <th>School</th>
              <th colSpan={2}>Action</th>
            </tr>
            </thead>
           
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.school}</td>
               <td><button onClick={() => handleEditStudent(student)} className='btn btn-success'>Edit</button>
                <button onClick={() => handleDeleteStudent(student.id)} className='btn btn-danger'>Delete</button>
                </td>
              </tr>
            ))}
          </table>
          {showAddStudentForm && (
            
            <form onSubmit={handleAddStudent}>
              <label>
                First Name:
                <input
                  type="text"
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                  required
                />
              </label>
              <label>
                School:
                <select
                  value={newStudent.school}
                  onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                  required
                >
                  <option value="IPRC-NGOMA">IPRC-NGOMA</option>
                  <option value="IPRC-MUSANZE">IPRC-MUSANZE</option>
                  <option value="IPRC-TUMBA">IPRC-TUMBA</option>
                </select>
              </label>
              <button type="submit" >{editingStudent ? "Update Student" : "Save Student"}</button>
            </form>
          )}
        </>
  
    </main>
  );
}

export default App;