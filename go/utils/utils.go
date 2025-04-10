package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetUserSub retrieves the userSub from the Gin context
func GetUserSub(c *gin.Context) (string, bool) {
	userSub, exists := c.Get("userSub")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: userSub not found"})
		return "", false
	}

	// Convert userSub to a string
	userSubStr, ok := userSub.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse userSub"})
		return "", false
	}

	return userSubStr, true
}
