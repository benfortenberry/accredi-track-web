package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/benfortenberry/accredi-track/employees"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
)

var db *sql.DB

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

func main() {
	// Capture connection properties.
	cfg := mysql.Config{
		User:   os.Getenv("DBUSER"),
		Passwd: os.Getenv("DBPASS"),
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "main",
	}
	// Get a database handle.
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
	router.GET("/employees", func(c *gin.Context) {
		employees.GetEmployees(db, c)
	})
	router.POST("/employees", func(c *gin.Context) {
		employees.InsertEmployee(db, c)
	})
	router.DELETE("/employees:id", func(c *gin.Context) {
		employees.DeleteEmployee(db, c)
	})
	router.PUT("/employees:id", func(c *gin.Context) {
		employees.UpdateEmployee(db, c)
	})

	router.Run("localhost:8080")
}
