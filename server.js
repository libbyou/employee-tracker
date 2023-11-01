const express = require('express');
// Import and require mysql2
const mysql = require('mysql');
const logo = require('asciiart-logo');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'eyvqcfxf5reja3nv.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'i4mdsdg4at5sdvt2',
        password: 'wbg0r5cn25cyb9s8',
        database: 'cvd6k2vjnp5om40d'
    },
    console.log(`Connected to the database.`)
);

const question = [{
    type: 'list',
    name: 'option',
    message: 'What would you like to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
}]

function init() {
    inquirer
        .prompt(question)
        .then((response) => {
            switch (response.option) {
                case 'View all departments':
                    db.query('SELECT * FROM  department', (err, results) => {
                        err ? console.log(err) : console.table(results);
                    });
                    init();
                    break;
                case 'View all roles':
                    db.query('SELECT * FROM role', (err, results) => {
                        err ? console.log(err) : console.table(results);
                    });
                    init();
                    break;
                case 'View all employees':
                    db.query('SELECT * FROM employee', (err, results) => {
                        err ? console.log(err) : console.table(results);
                        init();
                    });
                    break;
                case 'Add a department':
                    inquirer
                        .prompt([{
                            type: 'input',
                            name: 'departmentAdd',
                            message: "What department would you like to add?"
                        }])
                        .then((answer) => {
                            console.log(answer)
                            db.query(`INSERT INTO department (name) VALUES ("${answer.departmentAdd}")`, (err) => {
                                err ? console.log(err) : db.query('SELECT * FROM department', (err, results) => {
                                    console.table(results)
                                });
                                init();
                            })
                        });
                    break;
                case 'Add a role':
                    inquirer
                        .prompt([{
                            type: 'input',
                            name: 'roleAdd',
                            message: "What role would you like to add?"
                        },
                        {
                            type: 'input',
                            name: 'department',
                            message: 'What department is this role in?'
                        },
                        {
                            type: 'number',
                            name: 'salary',
                            message: 'What is the salary of this role?'
                        }])
                        .then((answer) => {
                            db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleAdd}", "${answer.salary}", "${answer.department}")`, (err) => {
                                err ? console.log(err) : db.query('SELECT * FROM role', (err, results) => {
                                    console.table(results)
                                });
                                init();
                            })
                        });
                    break;
                case 'Add an employee':

                    db.query('SELECT id FROM employee WHERE manager_id IS NULL', (err, managerResults) => {
                        const roleChoices = []
                        const managerChoices = []
                        managerResults.forEach(person => managerChoices.push(person.id))
                        console.log('managerChoices', managerChoices)
                        db.query('SELECT id from role', (err, roleResults) => {
                            if (err) {
                                console.error('Error querying the database:', err);
                                return;
                            }
                            roleResults.forEach(role => roleChoices.push(role.id))
                            // const roleChoices = results.map((row) => row.role_id)
                            // const managerChoices = results.map((row) => row.manager_id)

                            console.log(roleChoices)
                            console.log(managerChoices);
                            inquirer
                                .prompt([
                                    {
                                        type: 'number',
                                        name: 'employeeId',
                                        message: "What ID number would you like to give this employee?"
                                    },
                                    {
                                        type: 'input',
                                        name: 'firstName',
                                        message: "What is the first name of this employee?"
                                    },
                                    {
                                        type: 'input',
                                        name: 'lastName',
                                        message: "What is the last name of this employee?"
                                    },
                                    {
                                        type: "list",
                                        name: 'role',
                                        message: 'What is the role of this employee?',
                                        choices: roleChoices
                                    },
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: 'Who is the manager of this employee?',
                                        choices: managerChoices
                                    }
                                ])
                                .then((answer) => {
                                    db.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (? ,?, ?, ?, ?)`, [answer.employeeId, answer.firstName, answer.lastName, answer.role, answer.manager], (err, results) => {
                                        err ? console.log(err) :db.query('SELECT * FROM employee', (err, results) => {
                                            console.table(results)
                                        });
                                        init();
                                    })
                                })
                        });
                    })

                    break;
                case 'Update an employee role':
                    db.query('SELECT id, first_name FROM employee', (err, listOfEmployees) => {
                        if (err) {
                            console.error('Error querying the database:', err);
                            return;
                        }

                        const employeeChoices = []
                        listOfEmployees.forEach(employee => employeeChoices.push({name: employee.first_name, value: employee.id}))

                        console.log(employeeChoices)
            
                        // const employeeName = results.map((row) => row.first_name);

                        db.query('SELECT id, title FROM role', (err, listOfRoles) => {
                            if (err) {
                                console.error('Error querying the database:', err);
                                return;
                            }
                            const roleChoices = []
                            listOfRoles.forEach(role => roleChoices.push({name: role.title, value: role.id}));

                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'employeeName',
                                        message: "What employee would you like to update?",
                                        choices: employeeChoices
                                    },
                                    {
                                        type: 'list',
                                        name: 'employeeRole',
                                        message: 'What role would you like to update them to?',
                                        choices: roleChoices
                                    }
                                ])
                                .then((answer) => {
                                    console.log(answer)
                                    db.query(`UPDATE employee SET role_id = "${answer.employeeRole}" WHERE first_name = "${answer.employeeName}"`, (err, results) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            db.query('SELECT * FROM employee', (err, results) => {
                                                console.table(results)
                                            });
                                            init();
                                        }
                                    });
                                });
                        });
                    });
                    break;
                case 'Quit':
                    console.log('Goodbye!');
                    process.exit();
                default:
                    console.log('hitting default');
            }
        });
};

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

init();