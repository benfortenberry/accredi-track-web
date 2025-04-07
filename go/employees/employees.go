package main

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

	// An albums slice to hold data from returned rows.
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

	// Send the albums as a JSON response
	c.IndentedJSON(http.StatusOK, employees)
}
