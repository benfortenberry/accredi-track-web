package employees

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Employee struct {
	ID        int    `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Phone1    string `json:"phone1"`
	Email     string `json:"email"`
}

func Get(db *sql.DB, c *gin.Context) {
	var employees []Employee
	rows, err := db.Query("SELECT id, firstName, lastName,  phone1, email FROM employees where deleted IS NULL")
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query employees"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var emp Employee
		if err := rows.Scan(
			&emp.ID, &emp.FirstName, &emp.LastName,

			&emp.Phone1, &emp.Email,
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

func Post(db *sql.DB, c *gin.Context) {
	// Bind the JSON payload to an Employee struct
	var emp Employee
	if err := c.BindJSON(&emp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Prepare the SQL statement for inserting an employee
	query := `
        INSERT INTO employees (
            firstName, lastName, 
            phone1, email
        ) VALUES (?, ?, ?, ?)
    `

	// Execute the query
	result, err := db.Exec(query,
		emp.FirstName, emp.LastName, emp.Phone1, emp.Email,
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

func Delete(db *sql.DB, c *gin.Context) {
	// Get the employee ID from the URL parameter
	id := c.Param("id")

	// Prepare the SQL statement for deleting an employee
	query := `
        UPDATE employees
        SET deleted = current_timestamp()
        WHERE id = ?
    `

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

func Put(db *sql.DB, c *gin.Context) {
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
        SET firstName = ?, lastName = ?, phone1 = ?, email = ?
        WHERE id = ?
    `

	// Execute the query
	result, err := db.Exec(query,
		emp.FirstName, emp.LastName, emp.Phone1, emp.Email, id,
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

	// Query the updated employee data
	var updatedEmployee Employee
	getQuery := `
		 SELECT id, firstName, lastName, phone1, email
		 FROM employees
		 WHERE id = ?
	 `
	err = db.QueryRow(getQuery, id).Scan(
		&updatedEmployee.ID,
		&updatedEmployee.FirstName,
		&updatedEmployee.LastName,
		&updatedEmployee.Phone1,
		&updatedEmployee.Email,
	)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated employee"})
		return
	}

	// Respond with the updated employee data
	c.JSON(http.StatusOK, updatedEmployee)

}
