package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
)

var db *sql.DB

type Employee struct {
	FirstName	string `json:"firstName"`,
	LastName		string `json:"lastName"`,
	EmployeeID	int    `json:"employeeID"`
	MiddleName	string `json:"middleName"`
    StreetAddress string `json:"streetAddress"`
    City          string `json:"city"`
    State         string `json:"state"`
    Zipcode       string `json:"zipcode"`
    Phone1        string `json:"phone1"`
    Phone2        string `json:"phone2"`
    Email         string `json:"email"`
    EmployerID    int    `json:"employerID"`
    StatusID      int    `json:"statusID"`
}

func main() {

	defer db.Close()
	// Capture connection properties.
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "main",
	}

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	fmt.Println("Connected!")

	router := gin.Default()
	router.GET("/employees", getEmployees)

	router.Run("localhost:8080")
}

func getAlbums(c *gin.Context) {

	// An albums slice to hold data from returned rows.
	var employees []Employee

	rows, err := db.Query("SELECT * FROM employees")
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query albums"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var emp Employee
		if err := rows.Scan(&emp.EmployeeID, &emp.FirstName, &emp.LastName, &emp.MiddleName, &emp.StreetAddress, &emp.City, &emp.State, &emp.Zipcode, &emp.Phone1, &emp.Phone2, &emp.Email, &emp.EmployerID, &emp.StatusID); err != nil {
			fmt.Println("Error: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan album data"})
			return
		}
		employees = append(employees, alb)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over rows"})
		return
	}

	// Send the albums as a JSON response
	c.IndentedJSON(http.StatusOK, employees)
}