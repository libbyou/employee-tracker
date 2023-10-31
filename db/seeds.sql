INSERT INTO department(name)
    VALUES
        ("Editing"),
        ("Publishing");

INSERT INTO role (title, salary, department_id)
    VALUES
    ("Editing Manager", 100.50, 1),
    ("Editor", 80.50, 1),
    ("Publishing Manager", 120.50, 2),
    ("Publishing Lead", 90.50, 2);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
    VALUES
    (616, "Peter", "Parker", 3, null),
    (1610, "Miles", "Morales", 4, 616),
    (65, "Gwen", "Stacy", 2, 928),
    (928, "Miguel", "O'Hara", 1, null),
    (138, "Hobart", "Brown", 2, 928);