package licensetypes

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LicenseType struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetLicenseTypes(db *sql.DB, c *gin.Context) {
	var licensesTypes []LicenseType
	rows, err := db.Query("SELECT id, name FROM licenseTypes where deleted IS NULL")
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query license types"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var lic LicenseType
		if err := rows.Scan(
			&lic.ID, &lic.Name,
		); err != nil {
			fmt.Println("Error: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan license type data"})
			return
		}
		licensesTypes = append(licensesTypes, lic)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over license type rows"})
		return
	}

	c.IndentedJSON(http.StatusOK, licensesTypes)
}

func InsertLicenseType(db *sql.DB, c *gin.Context) {
	// Bind the JSON payload to an Employee struct
	var lic LicenseType
	if err := c.BindJSON(&lic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Prepare the SQL statement for inserting an employee
	query := `
        INSERT INTO licenseType (
            name
        ) VALUES (?)
    `

	// Execute the query
	result, err := db.Exec(query,
		lic.Name,
	)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert license type"})
		return
	}

	// Get the ID of the newly inserted employee
	id, err := result.LastInsertId()
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve inserted license type ID"})
		return
	}

	// Respond with the ID of the newly created employee
	c.JSON(http.StatusOK, gin.H{"message": "License type inserted successfully", "id": id})
}

func DeleteLicenseType(db *sql.DB, c *gin.Context) {
	// Get the employee ID from the URL parameter
	id := c.Param("id")

	// Prepare the SQL statement for deleting an employee
	query := `
        UPDATE licenseTypes
        SET delete = current_timestamp()
        WHERE id = ?
    `

	// Execute the query
	result, err := db.Exec(query, id)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete licenseType"})
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

func UpdateLicenseType(db *sql.DB, c *gin.Context) {
	// Get the employee ID from the URL parameter
	id := c.Param("id")

	// Bind the JSON payload to an Employee struct
	var lic LicenseType
	if err := c.BindJSON(&lic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Prepare the SQL statement for updating an employee
	query := `
        UPDATE licenseTypes
        SET name = ?
        WHERE id = ?
    `

	// Execute the query
	result, err := db.Exec(query,
		lic.Name,
	)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update license type"})
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
		c.JSON(http.StatusNotFound, gin.H{"error": "license type not found"})
		return
	}

	// Query the updated employee data
	var updatedLicenseType LicenseType
	getQuery := `
		 SELECT id, firstName, lastName, phone1, email
		 FROM employees
		 WHERE id = ?
	 `
	err = db.QueryRow(getQuery, id).Scan(
		&updatedLicenseType.ID,
		&updatedLicenseType.Name,
	)
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated license type"})
		return
	}

	// Respond with the updated employee data
	c.JSON(http.StatusOK, updatedLicenseType)

}
