package encoding

import (
	"log"

	"github.com/speps/go-hashids"
)

var hashID *hashids.HashID

func initHashids() {
	hd := hashids.NewData()
	hd.Salt = "your-unique-salt" // Use a strong, unique salt
	hd.MinLength = 8             // Minimum length of the generated hash
	var err error
	hashID, err = hashids.NewWithData(hd)
	if err != nil {
		log.Fatalf("Failed to initialize Hashids: %v", err)
	}
}
