package employees

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Employee struct {
	ID            int    `json:"id"`
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	MiddleName    string `json:"middleName,omitempty"` // Optional field
	StreetAddress string `json:"streetAddress"`
	City          string `json:"city"`
	State         string `json:"state"`
	Zipcode       string `json:"zipcode"`
	Phone1        string `json:"phone1"`
	Phone2        string `json:"phone2,omitempty"` // Optional field
	Email         string `json:"email"`
	EmployerID    int    `json:"employerID"`
	StatusID      int    `json:"statusID"`
}

func GetEmployees(db *sql.DB, c *gin.Context) {
	var employees []Employee
	rows, err := db.Query("SELECT * FROM employees")
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query employees"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var emp Employee
		if err := rows.Scan(
			&emp.ID, &emp.FirstName, &emp.LastName, &emp.MiddleName,
			&emp.StreetAddress, &emp.City, &emp.State, &emp.Zipcode,
			&emp.Phone1, &emp.Phone2, &emp.Email, &emp.EmployerID, &emp.StatusID,
		); err != nil {
			fmt.Println("Error: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan employee data"})
			return
		}
		employees = append(employees, emp)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over rows"})
		return
	}

	c.IndentedJSON(http.StatusOK, employees)
}

func InsertEmployee(db *sql.DB, c *gin.Context) {
	// Bind the JSON payload to an Employee struct
	var emp Employee
	if err := c.BindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Prepare the SQL statement for inserting an employee
	query := `
        INSERT INTO employees (
            firstName, lastName, middleName, streetAddress, city, state, zipcode,
            phone1, phone2, email, employerID, statusID
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

	// Execute the query
	result, err := db.Exec(query,
		emp.FirstName, emp.LastName, emp.MiddleName, emp.StreetAddress, emp.City,
		emp.State, emp.Zipcode, emp.Phone1, emp.Phone2, emp.Email, emp.EmployerID, emp.StatusID,
	)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert employee"})
		return
	}

	// Get the ID of the newly inserted employee
	id, err := result.LastInsertId()
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve inserted employee ID"})
		return
	}

	// Respond with the ID of the newly created employee
	c.JSON(http.StatusOK, gin.H{"message": "Employee inserted successfully", "id": id})
}

func DeleteEmployee(db *sql.DB, c *gin.Context) {
	// Get the employee ID from the URL parameter
	id := c.Param("id")

	// Prepare the SQL statement for deleting an employee
	query := "DELETE FROM employees WHERE id = ?"

	// Execute the query
	result, err := db.Exec(query, id)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete employee"})
		return
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve affected rows"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// Respond with a success message
	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

func UpdateEmployee(db *sql.DB, c *gin.Context) {
	// Get the employee ID from the URL parameter
	id := c.Param("id")

	// Bind the JSON payload to an Employee struct
	var emp Employee
	if err := c.BindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Prepare the SQL statement for updating an employee
	query := `
        UPDATE employees
        SET firstName = ?, lastName = ?, middleName = ?, streetAddress = ?, city = ?, state = ?, zipcode = ?,
            phone1 = ?, phone2 = ?, email = ?, employerID = ?, statusID = ?
        WHERE id = ?
    `

	// Execute the query
	result, err := db.Exec(query,
		emp.FirstName, emp.LastName, emp.MiddleName, emp.StreetAddress, emp.City,
		emp.State, emp.Zipcode, emp.Phone1, emp.Phone2, emp.Email, emp.EmployerID, emp.StatusID, id,
	)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update employee"})
		return
	}

	// Check if any rows were affected
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve affected rows"})
		return
	}

	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	// Respond with a success message
	c.JSON(http.StatusOK, gin.H{"message": "Employee updated successfully"})
}
