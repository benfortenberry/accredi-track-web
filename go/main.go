package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/benfortenberry/accredi-track/employees"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
)

var db *sql.DB

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

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET, POST, DELETE, PUT"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.GET("/employees", func(c *gin.Context) {
		employees.GetEmployees(db, c)
	})
	router.POST("/employees", func(c *gin.Context) {
		employees.InsertEmployee(db, c)
	})
	router.DELETE("/employees/:id", func(c *gin.Context) {
		employees.DeleteEmployee(db, c)
	})
	router.PUT("/employees/:id", func(c *gin.Context) {
		employees.UpdateEmployee(db, c)
	})

	router.Run("localhost:8080")
}
