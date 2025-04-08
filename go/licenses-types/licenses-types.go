package licenseTypes

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

func GetLicenses(db *sql.DB, c *gin.Context) {
	var licensesTypes []LicenseType
	rows, err := db.Query("SELECT id, name FROM licenseTypes")
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
