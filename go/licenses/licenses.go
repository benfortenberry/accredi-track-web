package licenses

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type License struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func GetLicenses(db *sql.DB, c *gin.Context) {
	var licenses []License
	rows, err := db.Query("SELECT id, name FROM licenses")
	if err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query licenses"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var lic License
		if err := rows.Scan(
			&lic.ID, &lic.Name,
		); err != nil {
			fmt.Println("Error: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan license data"})
			return
		}
		licenses = append(licenses, lic)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error iterating over license rows"})
		return
	}

	c.IndentedJSON(http.StatusOK, licenses)
}
