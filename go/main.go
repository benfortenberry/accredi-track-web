package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	employeeLicesnses "github.com/benfortenberry/accredi-track/employeeLicenses"
	employees "github.com/benfortenberry/accredi-track/employees"
	licenses "github.com/benfortenberry/accredi-track/licenses"
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

	// employee routes
	router.GET("/employees", func(c *gin.Context) {
		employees.Get(db, c)
	})
	router.POST("/employees", func(c *gin.Context) {
		employees.Post(db, c)
	})
	router.DELETE("/employees/:id", func(c *gin.Context) {
		employees.Delete(db, c)
	})
	router.PUT("/employees/:id", func(c *gin.Context) {
		employees.Put(db, c)
	})

	// license routes
	router.GET("/licenses", func(c *gin.Context) {
		licenses.Get(db, c)
	})

	router.POST("/licenses", func(c *gin.Context) {
		licenses.Post(db, c)
	})

	router.PUT("/licenses/:id", func(c *gin.Context) {
		licenses.Put(db, c)
	})

	router.DELETE("/licenses/:id", func(c *gin.Context) {
		licenses.Delete(db, c)
	})

	// employee license routes
	router.GET("/employee-licenses", func(c *gin.Context) {
		employeeLicesnses.Get(db, c)
	})

	router.POST("/employee-licenses", func(c *gin.Context) {
		employeeLicesnses.Post(db, c)
	})

	router.PUT("/employee-licenses/:id", func(c *gin.Context) {
		employeeLicesnses.Put(db, c)
	})

	router.DELETE("/employee-licenses/:id", func(c *gin.Context) {
		employeeLicesnses.Delete(db, c)
	})
	router.Run("localhost:8080")
}
