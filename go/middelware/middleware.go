package middleware

import (
	"fmt"
	"net/http"
	"os"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	"github.com/form3tech-oss/jwt-go"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates the JWT
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
			ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
				// Use the Auth0 public key to validate the token
				audience := os.Getenv("AUTH0_AUDIENCE")
				issuer := fmt.Sprintf("https://%s/", os.Getenv("AUTH0_DOMAIN"))

				claims, ok := token.Claims.(jwt.MapClaims)
				if !ok || !token.Valid {
					return nil, fmt.Errorf("invalid token")
				}

				// Validate audience
				if claims["aud"] != audience {
					return nil, fmt.Errorf("invalid audience")
				}

				// Validate issuer
				if claims["iss"] != issuer {
					return nil, fmt.Errorf("invalid issuer")
				}

				return []byte(os.Getenv("AUTH0_CLIENT_SECRET")), nil
			},
			SigningMethod: jwt.SigningMethodHS256,
		})

		err := jwtMiddleware.CheckJWT(c.Writer, c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		c.Next()
	}
}
